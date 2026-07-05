/*
  ── Database type definitions ─────────────────────────────────────────────────
  These mirror the Supabase table schemas exactly.
  Sprint 4: run `npx supabase gen types typescript` to auto-generate from live schema.

  SQL to create these tables is in /supabase/schema.sql
*/

export type BookStatus = "draft" | "published" | "archived";
export type ChapterStatus = "draft" | "published";
export type PoemStatus = "draft" | "published";

export interface BookRow {
  id: string;
  title: string;
  slug: string;
  synopsis: string;
  cover_url: string | null;
  genre: string;
  accent: "purple" | "teal" | "coral" | "gold";
  status: BookStatus;
  author: string;
  created_at: string;
  updated_at: string;
}

export interface ChapterRow {
  id: string;
  book_id: string;
  title: string;
  slug: string;
  chapter_number: number;
  subtitle: string | null;
  content: string;          /* JSON string: string[] of paragraphs */
  status: ChapterStatus;
  read_time: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PoemRow {
  id: string;
  title: string;
  content: string;          /* Plain text, line-separated */
  tags: string[];
  status: PoemStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

/* Supabase Database type — passed to createClient<Database>() */
export interface Database {
  public: {
    Tables: {
      books: {
        Row: BookRow;
        Insert: Omit<BookRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<BookRow, "id" | "created_at" | "updated_at">>;
      };
      chapters: {
        Row: ChapterRow;
        Insert: Omit<ChapterRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<ChapterRow, "id" | "created_at" | "updated_at">>;
      };
      poems: {
        Row: PoemRow;
        Insert: Omit<PoemRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<PoemRow, "id" | "created_at" | "updated_at">>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
