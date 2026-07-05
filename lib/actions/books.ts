"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";

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
  uploadCover — returns a result object instead of throwing.
  This keeps errors on the client side and prevents Server Component
  render crashes. Uses the service-role admin client to bypass Storage
  RLS policies which may block anon-key uploads.
*/
export async function uploadCover(
  bookId: string,
  formData: FormData
): Promise<{ success: boolean; publicUrl?: string; error?: string }> {
  try {
    // 1. Verify the user is authenticated via the session client
    const sessionClient = await createClient();
    const { data: { user } } = await sessionClient.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated. Please log in again." };

    // 2. Get the file
    const file = formData.get("cover") as File;
    if (!file || file.size === 0) return { success: false, error: "No file received." };

    // 3. Use service-role client for storage + db writes (bypasses RLS)
    const supabase = await createAdminClient();

    // 4. Build a unique file path — timestamp prevents stale CDN cache
    const ext      = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const filePath = `${bookId}/cover-${Date.now()}.${ext}`;

    // 5. Upload to Supabase Storage bucket "book-covers"
    const { error: uploadError } = await supabase.storage
      .from("book-covers")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type || "image/jpeg",
      });

    if (uploadError) {
      console.error("[uploadCover] storage error:", uploadError);
      return { success: false, error: `Storage error: ${uploadError.message}` };
    }

    // 6. Get the public URL (always succeeds — no error to check)
    const { data: urlData } = supabase.storage
      .from("book-covers")
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;
    if (!publicUrl) return { success: false, error: "Could not generate public URL." };

    // 7. Save the URL into books.cover_url
    const { error: dbError } = await (supabase.from("books") as any)
      .update({ cover_url: publicUrl })
      .eq("id", bookId);

    if (dbError) {
      console.error("[uploadCover] db error:", dbError);
      return { success: false, error: `Database error: ${dbError.message}` };
    }

    // 8. Revalidate public pages so the new cover appears immediately
    revalidatePath("/stories");
    revalidatePath(`/stories/${bookId}`);
    revalidatePath("/admin/books");

    return { success: true, publicUrl };
  } catch (err: any) {
    console.error("[uploadCover] unexpected error:", err);
    return { success: false, error: err?.message ?? "Unexpected error during upload." };
  }
}
