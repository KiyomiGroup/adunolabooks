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
  saveCoverUrl — called by CoverUploader AFTER the browser has already
  uploaded the file directly to Supabase Storage via XHR.
  Only job: write the public URL into books.cover_url and revalidate.
  Never handles file bytes — no timeout, no stuck state.
*/
export async function saveCoverUrl(
  bookId: string,
  publicUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Not authenticated." };
    }

    const { error: dbError } = await (supabase.from("books") as any)
      .update({ cover_url: publicUrl })
      .eq("id", bookId);

    if (dbError) {
      console.error("[saveCoverUrl] db error:", dbError.message);
      return { success: false, error: `Could not save cover URL: ${dbError.message}` };
    }

    try {
      revalidatePath("/stories");
      revalidatePath("/admin/books");
    } catch (e) {
      console.warn("[saveCoverUrl] revalidatePath warning:", e);
    }

    return { success: true };
  } catch (err: any) {
    console.error("[saveCoverUrl] unexpected error:", err?.message);
    return { success: false, error: err?.message ?? "Unexpected error." };
  }
}

/* Legacy — kept for backwards compat but no longer called by CoverUploader */
export async function uploadCover(
  bookId: string,
  formData: FormData
): Promise<{ success: boolean; publicUrl?: string; error?: string }> {
  return { success: false, error: "Use direct XHR upload instead." };
}
