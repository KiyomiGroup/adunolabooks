"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function toSlug(title: string): string {
  return title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
}

function textToParagraphs(text: string): string[] {
  return text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
}

export async function createChapter(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const bookId        = formData.get("book_id") as string;
  const title         = formData.get("title") as string;
  const subtitle      = (formData.get("subtitle") as string) || null;
  const chapterNumber = parseInt(formData.get("chapter_number") as string, 10);
  const rawPrologue   = (formData.get("prologue") as string) || null;
  const rawContent    = formData.get("content") as string;
  const readTime      = (formData.get("read_time") as string) || null;
  const status        = (formData.get("status") as string) || "draft";
  const slug          = toSlug(title);
  const content       = JSON.stringify(textToParagraphs(rawContent));
  const prologue      = rawPrologue?.trim() || null;
  const publishedAt   = status === "published" ? new Date().toISOString() : null;

  const { error } = await supabase.from("chapters").insert([{
    book_id: bookId, title, slug, chapter_number: chapterNumber,
    subtitle, prologue, content, read_time: readTime, status, published_at: publishedAt,
  }] as any);

  if (error) throw new Error(error.message);
  revalidatePath("/stories");
  revalidatePath("/admin/chapters");
  redirect("/admin/chapters");
}

export async function updateChapter(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const title      = formData.get("title") as string;
  const subtitle   = (formData.get("subtitle") as string) || null;
  const rawPrologue = (formData.get("prologue") as string) || null;
  const rawContent = formData.get("content") as string;
  const readTime   = (formData.get("read_time") as string) || null;
  const status     = formData.get("status") as string;
  const content    = JSON.stringify(textToParagraphs(rawContent));
  const prologue   = rawPrologue?.trim() || null;

  const { data: existing } = await (supabase.from("chapters") as any)
    .select("published_at, status").eq("id", id).single();

  const publishedAt =
    status === "published" && !existing?.published_at
      ? new Date().toISOString()
      : existing?.published_at ?? null;

  const { error } = await (supabase.from("chapters") as any)
    .update({ title, subtitle, prologue, content, read_time: readTime, status, published_at: publishedAt })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/stories");
  revalidatePath("/admin/chapters");
  redirect("/admin/chapters");
}

export async function deleteChapter(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { error } = await (supabase.from("chapters") as any).delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/stories");
  revalidatePath("/admin/chapters");
}
