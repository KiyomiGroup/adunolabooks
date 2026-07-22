export type BookStatus    = "draft" | "published" | "archived";
export type ChapterStatus = "draft" | "published";
export type PoemStatus    = "draft" | "published";

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
  prologue: string | null;
  content: string;
  status: ChapterStatus;
  read_time: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PoemRow {
  id: string;
  title: string;
  content: string;
  tags: string[];
  image_url: string | null;
  status: PoemStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

/* ── Sprint 4A: Reader profiles ──────────────────────────────────────────── */
export interface ProfileRow {
  id: string;               /* PK — same as auth.users.id */
  user_id: string;          /* FK → auth.users.id          */
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string | null;
  joined_at: string;
  updated_at: string;
  /* Sprint 4B: identifies the site author for the "Author" badge + pinning */
  is_admin: boolean;
  /* Sprint 4C: books_read, bookmarks, reading_progress counters added here */
}

/* ── Sprint 4B: Chapter discussion ────────────────────────────────────────── */
export interface CommentRow {
  id: string;
  chapter_id: string;
  user_id: string;
  parent_comment_id: string | null;
  root_comment_id: string | null;
  content: string;
  is_pinned: boolean;
  is_edited: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

/* ── Sprint 4C: Reader engagement ─────────────────────────────────────────── */
export interface BookmarkRow {
  id: string;
  user_id: string;
  book_id: string;
  chapter_id: string | null; /* null = story-level bookmark */
  created_at: string;
}

export interface ReadingProgressRow {
  id: string;
  user_id: string;
  book_id: string;
  current_chapter_id: string | null;
  last_read_at: string;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

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
      profiles: {
        Row: ProfileRow;
        Insert: Omit<ProfileRow, "id" | "joined_at" | "updated_at">;
        Update: Partial<Omit<ProfileRow, "id" | "user_id" | "joined_at">>;
      };
      comments: {
        Row: CommentRow;
        Insert: Omit<
          CommentRow,
          "id" | "root_comment_id" | "is_pinned" | "is_edited" | "is_deleted" | "created_at" | "updated_at"
        >;
        Update: Partial<Omit<CommentRow, "id" | "chapter_id" | "user_id" | "created_at">>;
      };
      bookmarks: {
        Row: BookmarkRow;
        Insert: Omit<BookmarkRow, "id" | "created_at">;
        Update: Partial<Omit<BookmarkRow, "id" | "user_id" | "created_at">>;
      };
      reading_progress: {
        Row: ReadingProgressRow;
        Insert: Omit<ReadingProgressRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<ReadingProgressRow, "id" | "user_id" | "book_id" | "created_at">>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
