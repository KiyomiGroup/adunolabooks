"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function toSlug(title: string): string {
  return title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
}

/*
  ── textToParagraphs ──────────────────────────────────────────────────────────
  Converts the admin textarea value into a paragraph array for storage.

  Writer behaviour we must handle:
    A) Double newline between paragraphs  → always a paragraph break ✓
    B) Single newline between paragraphs  → treat as paragraph break
       (common: writer pressed Enter once, not twice)
    C) Single newlines WITHIN a paragraph → preserve as a line break
       (dialogue, poetry-style lines inside prose)

  Strategy:
    1. Normalise Windows line endings (\r\n → \n).
    2. Split on double newlines first to get intentional blocks.
    3. Within each block, if it looks like a single-newline separated
       list of lines (i.e. no sentence ends followed by a capital — it's
       probably not mid-sentence wrapping), keep it as one element with
       \n preserved. The renderer will turn \n → <br />.
    4. For blocks that are clearly multiple prose paragraphs joined by
       a single newline (detected by ". " + capital after the \n), split
       them further into separate paragraph elements.

  This preserves intentional poetry-style or dialogue line breaks
  while fixing the common "single enter between paragraphs" problem.
*/
function textToParagraphs(text: string): string[] {
  const normalised = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Step 1: split on double (or more) blank lines — explicit paragraph breaks
  const blocks = normalised.split(/\n{2,}/);

  const paragraphs: string[] = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    if (!trimmed.includes("\n")) {
      // No internal newlines — plain paragraph
      paragraphs.push(trimmed);
      continue;
    }

    // Block has internal single newlines.
    // Heuristic: if ANY line ends with sentence punctuation (. ! ? " ')
    // and the NEXT line starts with a capital letter, treat each line
    // as its own paragraph (writer used single Enter between paragraphs).
    const lines = trimmed.split("\n");
    const looksLikeMultipleParagraphs = lines.some((line, i) => {
      if (i === lines.length - 1) return false;
      const next = lines[i + 1]?.trim() ?? "";
      return (
        /[.!?"'\u2019\u201d]$/.test(line.trim()) &&
        /^[A-Z\u201c\u2018"]/.test(next)
      );
    });

    if (looksLikeMultipleParagraphs) {
      // Treat each line as its own paragraph
      for (const line of lines) {
        const t = line.trim();
        if (t) paragraphs.push(t);
      }
    } else {
      // Intentional line breaks within one unit (dialogue, poetry, etc.)
      // Keep as a single element; the renderer will honour \n as <br />
      paragraphs.push(trimmed);
    }
  }

  return paragraphs;
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

  const title       = formData.get("title") as string;
  const subtitle    = (formData.get("subtitle") as string) || null;
  const rawPrologue = (formData.get("prologue") as string) || null;
  const rawContent  = formData.get("content") as string;
  const readTime    = (formData.get("read_time") as string) || null;
  const status      = formData.get("status") as string;
  const content     = JSON.stringify(textToParagraphs(rawContent));
  const prologue    = rawPrologue?.trim() || null;

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
