"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createPoem(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const title   = formData.get("title") as string;
  const content = formData.get("content") as string;
  const tagsRaw = (formData.get("tags") as string) || "";
  const status  = (formData.get("status") as string) || "draft";
  const tags    = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);
  const publishedAt = status === "published" ? new Date().toISOString() : null;

  const { error } = await supabase.from("poems").insert([
    { title, content, tags, status, published_at: publishedAt }
  ] as any);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/poems");
  redirect("/admin/poems");
}

export async function updatePoem(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const title   = formData.get("title") as string;
  const content = formData.get("content") as string;
  const tagsRaw = (formData.get("tags") as string) || "";
  const status  = formData.get("status") as string;
  const tags    = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);

  const { data: existing } = await (supabase.from("poems") as any)
    .select("published_at").eq("id", id).single();

  const publishedAt =
    status === "published" && !existing?.published_at
      ? new Date().toISOString()
      : existing?.published_at ?? null;

  const { error } = await (supabase.from("poems") as any)
    .update({ title, content, tags, status, published_at: publishedAt })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/poems");
  redirect("/admin/poems");
}

export async function deletePoem(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { error } = await (supabase.from("poems") as any).delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/poems");
}

/* Called from PoemImageUploader after client-side storage upload */
export async function savePoemImageUrl(poemId: string, publicUrl: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await (supabase.from("poems") as any)
    .update({ image_url: publicUrl || null })
    .eq("id", poemId);

  if (error) throw new Error(error.message);
  revalidatePath("/poems");
  revalidatePath("/admin/poems");
}
