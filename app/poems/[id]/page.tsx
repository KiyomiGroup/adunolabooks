import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { getPoemById } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

type Params = { id: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const poem = await getPoemById(id);
  if (!poem) return { title: "Poem not found — AdunolaBooks" };

  const firstLine = poem.content.split("\n").find((l) => l.trim()) ?? "";
  return {
    title: `${poem.title} — AdunolaBooks`,
    description: firstLine,
  };
}

/*
  ── PoemBody ─────────────────────────────────────────────────────────────────
  Renders the full poem with stanza spacing preserved.

  Content is plain text stored line-by-line.
  Empty lines between stanzas → visual gap between stanza blocks.
  Non-empty lines → displayed as poem lines with line-height rhythm.

  This mirrors the rendering logic in the original PoemFull component,
  but outputs proper stanza groupings instead of a flat list.
*/
function PoemBody({ content }: { content: string }) {
  // Split content into stanzas (groups separated by blank lines)
  const rawLines = content.split("\n");
  const stanzas: string[][] = [];
  let current: string[] = [];

  for (const line of rawLines) {
    if (line.trim() === "") {
      if (current.length > 0) {
        stanzas.push(current);
        current = [];
      }
    } else {
      current.push(line);
    }
  }
  if (current.length > 0) stanzas.push(current);

  // Fallback: if no blank-line stanzas found, treat each line as its own
  const groups = stanzas.length > 0 ? stanzas : rawLines.filter(Boolean).map((l) => [l]);

  return (
    <div className="poem-page-body">
      {groups.map((stanza, si) => (
        <div key={si} className="poem-stanza">
          {stanza.map((line, li) => (
            <span key={li} className="poem-page-line">{line}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

export default async function PoemPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const poem = await getPoemById(id);
  if (!poem) notFound();

  const publishedDate = poem.published_at
    ? new Date(poem.published_at).toLocaleDateString("en-GB", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  return (
    <div className="poem-page">
      <TopNav />

      <div className="poem-page-wrap fade-up">
        {/* Back link */}
        <Link href="/poems" className="poem-page-back">
          ← All Poems
        </Link>

        {/* Mood image — only renders when image_url is set */}
        {poem.image_url && (
          <div className="poem-page-image-wrap">
            <img
              src={poem.image_url}
              alt=""
              role="presentation"
              className="poem-page-image"
            />
          </div>
        )}

        {/* Title */}
        <h1 className="poem-page-title">{poem.title}</h1>

        {/* Meta: date + tags */}
        <div className="poem-page-meta">
          {publishedDate && (
            <span className="poem-page-date">{publishedDate}</span>
          )}
          {poem.tags?.length > 0 && (
            <div className="poem-page-tags" style={{ justifyContent: "flex-start", margin: 0 }}>
              {poem.tags.map((tag) => (
                <span key={tag} className="poem-card-tag">{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Full poem */}
        <PoemBody content={poem.content} />

        {/* End ornament */}
        <div className="poem-page-ornament" aria-hidden="true">
          <span>❧</span>
        </div>

        {/* Bottom tags (centred, decorative) */}
        {poem.tags?.length > 0 && (
          <div className="poem-page-tags">
            {poem.tags.map((tag) => (
              <span key={tag} className="poem-card-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
