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

export async function uploadCover(bookId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const file = formData.get("cover") as File;
  if (!file || file.size === 0) return;

  const ext = file.name.split(".").pop();
  const filePath = `${bookId}/cover.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("book-covers")
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw new Error(uploadError.message);

  const { data: { publicUrl } } = supabase.storage.from("book-covers").getPublicUrl(filePath);

  const { error: updateError } = await (supabase.from("books") as any)
    .update({ cover_url: publicUrl })
    .eq("id", bookId);

  if (updateError) throw new Error(updateError.message);
  revalidatePath("/stories");
}
