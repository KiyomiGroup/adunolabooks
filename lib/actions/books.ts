"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function toSlug(title: string): string {
  return title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
}

export async function createBook(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const title    = formData.get("title") as string;
  const synopsis = formData.get("synopsis") as string;
  const genre    = formData.get("genre") as string;
  const accent   = (formData.get("accent") as string) || "purple";
  const status   = (formData.get("status") as string) || "draft";
  const slug     = toSlug(title);

  const { error } = await supabase.from("books").insert([
    { title, slug, synopsis, genre, accent, status, author: "Adunola" }
  ] as any);

  if (error) throw new Error(error.message);
  revalidatePath("/stories");
  revalidatePath("/admin/books");
  redirect("/admin/books");
}

export async function updateBook(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const title    = formData.get("title") as string;
  const synopsis = formData.get("synopsis") as string;
  const genre    = formData.get("genre") as string;
  const accent   = formData.get("accent") as string;
  const status   = formData.get("status") as string;

  const { error } = await (supabase.from("books") as any)
    .update({ title, synopsis, genre, accent, status })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/stories");
  revalidatePath("/admin/books");
  redirect("/admin/books");
}

export async function deleteBook(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { error } = await (supabase.from("books") as any).delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/stories");
  revalidatePath("/admin/books");
}

/*
  uploadCover — isolated from Server Component render.
  Returns a result object, never throws.
  Uses @supabase/supabase-js createClient directly with the service-role
  key — no cookie machinery, no SSR client — so there is zero risk of
  cookie/session conflicts or render-pipeline interference.
*/
export async function uploadCover(
  bookId: string,
  formData: FormData
): Promise<{ success: boolean; publicUrl?: string; error?: string }> {
  try {
    // 1. Verify auth via the session client (cookies-based, anon key)
    const sessionClient = await createClient();
    const { data: authData, error: authError } = await sessionClient.auth.getUser();
    if (authError || !authData?.user) {
      return { success: false, error: "Not authenticated. Please log in again." };
    }

    // 2. Validate file
    const file = formData.get("cover") as File | null;
    if (!file || file.size === 0) {
      return { success: false, error: "No file received." };
    }

    // 3. Verify env vars are present before using them
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      console.error("[uploadCover] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
      return { success: false, error: "Server configuration error. Contact the site admin." };
    }

    // 4. Create a plain service-role client — no cookies, no SSR, no session conflicts
    const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
    const adminClient = createSupabaseClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // 5. Build unique file path — timestamp prevents stale CDN cache
    const ext      = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    const filePath = `${bookId}/cover-${Date.now()}.${ext}`;

    // 6. Upload to Supabase Storage bucket "book-covers"
    const { error: uploadError } = await adminClient.storage
      .from("book-covers")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type || "image/jpeg",
      });

    if (uploadError) {
      console.error("[uploadCover] storage error:", uploadError.message);
      return { success: false, error: `Upload failed: ${uploadError.message}` };
    }

    // 7. Get public URL — getPublicUrl never throws, always returns data
    const { data: urlData } = adminClient.storage
      .from("book-covers")
      .getPublicUrl(filePath);

    const publicUrl = urlData?.publicUrl;
    if (!publicUrl) {
      return { success: false, error: "Could not generate a public URL for the image." };
    }

    // 8. Save URL into books.cover_url
    const { error: dbError } = await adminClient
      .from("books")
      .update({ cover_url: publicUrl })
      .eq("id", bookId);

    if (dbError) {
      console.error("[uploadCover] db error:", dbError.message);
      return { success: false, error: `Could not save cover URL: ${dbError.message}` };
    }

    // 9. Revalidate public-facing pages — wrapped separately so a render
    //    error here cannot affect the returned result
    try {
      revalidatePath("/stories");
      revalidatePath("/admin/books");
    } catch (revalErr) {
      // Non-fatal — the upload succeeded; revalidation will happen on next request
      console.warn("[uploadCover] revalidatePath warning:", revalErr);
    }

    return { success: true, publicUrl };

  } catch (err: any) {
    console.error("[uploadCover] unexpected error:", err?.message ?? err);
    return {
      success: false,
      error: err?.message ?? "An unexpected error occurred. Please try again.",
    };
  }
}
