/*
  ── Sprint 2: Story / Chapter data layer ─────────────────────────────────

  This file is the single source of truth for story + chapter mock data
  used by the /stories library, book detail, and chapter reader pages.

  Sprint 3 will replace the bodies of getAllStories / getStoryBySlug /
  getChapterData with Supabase queries (published_stories / chapters
  tables). Call sites elsewhere should not need to change — keep this
  the only file that knows the data is currently static.
*/

export type Accent = "purple" | "teal" | "coral" | "gold";

export interface Chapter {
  number: number;
  title: string;
  subtitle?: string;
  publishedAt?: string;
  readTime?: string;
  /* "available" = has real content. "drafting" = manuscript placeholder
     shown on the reader page. Sprint 3: drive this from a `published_at`
     column instead of a hand-set flag. */
  status: "available" | "drafting";
  content?: string[]; // paragraphs
}

export interface Story {
  id: number;
  slug: string;
  title: string;
  author: string;
  genre: string;
  status: "Ongoing" | "Complete";
  accent: Accent;
  /* Short, card-length blurb */
  excerpt: string;
  /* Longer, book-detail-page blurb */
  synopsis: string;
  lastUpdated: string;
  stats: { readers: string; avgReadTime: string };
  /* Sprint 3: replace with real per-reader progress from auth + a
     reading_progress table. 0 = unstarted, 100 = finished. */
  readingProgress: number;
  chapters: Chapter[];
}

/* ── Mock stories ─────────────────────────────────────────────────────── */
export const STORIES: Story[] = [
  {
    id: 1,
    slug: "dust-and-delay",
    title: "Dust and Delay",
    author: "Adunola",
    genre: "Literary Fiction",
    status: "Ongoing",
    accent: "purple",
    excerpt:
      "A slow, quiet novel about the letters we never send and the ones we shouldn't have.",
    synopsis:
      "Nine years after her mother's death, Temi finally opens the drawer she's been avoiding — and finds forty-one unsent letters, one of them addressed to no one in particular. A slow, quiet novel about grief measured in postage that was never bought, and the conversations we keep having with people who are no longer there to answer.",
    lastUpdated: "June 2025",
    stats: { readers: "4.2k", avgReadTime: "16 min" },
    readingProgress: 35,
    chapters: [
      {
        number: 1,
        title: "The Weight of Unsent Things",
        subtitle: "In which a drawer is opened for the first time in nine years.",
        publishedAt: "March 2, 2025",
        readTime: "12 min",
        status: "available",
        content: [
          "The drawer stuck the way it always had, swollen with humidity and the particular stubbornness of furniture that has decided, on your behalf, to keep a secret. Temi pulled twice before it gave, and when it did, it gave all at once, spilling open like a mouth mid-confession.",
          "Inside: forty-one envelopes, none of them sealed, all of them addressed in her mother's narrow, slanting hand. Some bore stamps from countries her mother had never visited. Most bore no stamps at all, as if the act of writing had been the whole point, and the sending an afterthought no one had gotten around to.",
          "She did not recognize all the names. Dele, twice. Aunty Ronke, once, underlined. And near the bottom, worn soft at the corners from handling, an envelope with no name on it at all — just a date, and beneath the date, in smaller letters: for whenever you're ready.",
          "Temi sat on the floor of her mother's old room with her back against the bed frame, the way she used to sit when she was small and the house felt too big for the two of them. Outside, a delivery truck reversed somewhere on the street, beeping its small mechanical apology into the afternoon.",
          "She did not open the unnamed envelope. Not yet. She only held it, weighing it the way you weigh a decision you've already made but haven't told yourself about.",
        ],
      },
      {
        number: 2,
        title: "Tuesday, Mostly",
        subtitle: "A week told sideways.",
        publishedAt: "March 9, 2025",
        readTime: "9 min",
        status: "available",
        content: [
          "Grief, Temi was learning, did not arrive on schedule. It came on Tuesdays, mostly — though she could never say why Tuesdays, except that Tuesday was the day her mother used to call, and the absence of a sound is its own kind of noise.",
          "At the office she answered emails with the wrong amount of warmth, oscillating between too brisk and too much, like a radio dial that couldn't find its station. Her colleagues had stopped asking how she was. She was grateful for this in a way she felt guilty about.",
          "In the evenings she read the unsent letters one at a time, rationing them like something that might run out. Her mother's handwriting changed across the years — looser in the early ones, careful and small in the last — and Temi found herself dating each letter not by the year written at the top, but by the shape of the T.",
          "She still had not opened the one with no name on it. It sat on her nightstand now, propped against the lamp, facing her every night like something waiting to be asked a question.",
        ],
      },
      { number: 3, title: "What the Neighbours Kept", status: "drafting" },
      { number: 4, title: "Aunty Ronke's Version", status: "drafting" },
      { number: 5, title: "The Stamp Drawer", status: "drafting" },
      { number: 6, title: "Dele, Twice", status: "drafting" },
      { number: 7, title: "A Smaller Kind of Quiet", status: "drafting" },
      { number: 8, title: "Things With No Address", status: "drafting" },
      { number: 9, title: "The Lawyer's Second Call", status: "drafting" },
      { number: 10, title: "Nine Years, Counted Backwards", status: "drafting" },
      {
        number: 11,
        title: "A House in the Middle of Rain",
        subtitle: "Eleven months later, the letters end where the house begins.",
        publishedAt: "May 30, 2025",
        readTime: "15 min",
        status: "available",
        content: [
          "The rain in Lagos did not fall so much as arrive — all at once, with the confidence of something that had been planning its entrance for hours. Temi stood under the carport of her mother's house and watched the street turn to river, and thought, not for the first time, that her mother would have found this funny.",
          "She had read thirty-eight of the forty-one letters by now. Three remained, including the nameless one, and she had begun to understand that she was not avoiding them out of fear exactly, but out of a reluctance to finish a thing that had become, without her noticing, the last conversation she was still having with her mother.",
          "The contractor had called twice about the roof. She had not called back. There were practical griefs and impractical ones, and lately she could only carry one at a time.",
          "Inside, the house smelled the way it always had — old wood and her mother's lavender soap, a smell that had outlasted the woman who chose it — and Temi found she could stand in the hallway for whole minutes without doing anything at all, just breathing it in like a held note.",
          "When the rain eased, she went back to the drawer. Two letters left. She picked up the one addressed to Dele, and began, finally, to read.",
        ],
      },
      {
        number: 12,
        title: "What the Window Knew",
        subtitle: "The last unsent letter, and what was written on the back of it.",
        publishedAt: "June 14, 2025",
        readTime: "18 min",
        status: "available",
        content: [
          "The nameless envelope had been waiting so long that Temi had started to think of it less as a letter and more as a piece of furniture — a thing that simply belonged in the room now, like the lamp or the bed frame.",
          "She opened it standing at the window, the way her mother always read important mail, as though the light outside might help make sense of what was inside.",
          "It was short. Four sentences, in the careful, late-years handwriting. It did not explain the other forty letters, or apologize for the years of silence between intention and ink. It only said what it said, plainly, the way her mother had rarely managed to say things out loud.",
          "Temi read it twice. Then she turned it over, and found one more line on the back, added later, in a different pen — a postscript written, she guessed, sometime after the rest, when her mother must have thought she had more time than she did.",
          "Outside, the street was drying in patches under the returning sun. Temi folded the letter along its original creases, set it on the windowsill where the light could reach it, and, for the first time in eleven months, let herself cry without trying to stop.",
        ],
      },
    ],
  },
  {
    id: 2,
    slug: "the-cartographers-daughter",
    title: "The Cartographer's Daughter",
    author: "Adunola",
    genre: "Historical",
    status: "Ongoing",
    accent: "teal",
    excerpt:
      "Set in 1940s Lagos, a woman inherits her father's maps and discovers they were never about geography.",
    synopsis:
      "When Adaeze inherits her late father's trunk of hand-drawn maps, she expects street names and survey lines. Instead she finds forty-two versions of a city that was never quite real — overlaid, again and again, with a love story he never told anyone. Set across 1940s Lagos, a novel about the places we draw to hold the people we can't.",
    lastUpdated: "May 2025",
    stats: { readers: "2.8k", avgReadTime: "19 min" },
    readingProgress: 0,
    chapters: [
      {
        number: 1,
        title: "Where the Lines Were Drawn",
        subtitle: "Lagos, 1947.",
        publishedAt: "April 6, 2025",
        readTime: "11 min",
        status: "available",
        content: [
          "Her father's maps were not maps of places so much as maps of mornings — the particular slant of light over Marina at six a.m., the smell of the lagoon before the fish sellers arrived, the sound a colonial office door made when it hadn't been oiled since the last administration.",
          "Adaeze had inherited the trunk three weeks after the funeral, when the lawyer finally stopped clearing his throat long enough to mention it. Forty-two maps, hand-drawn, none of them matching any atlas she had ever seen.",
          "The first one she unrolled showed her childhood street — except the street was labeled in a name she didn't recognize, and a small red X marked a house that, as far as she knew, had never existed.",
          "She sat with the map a long while, tracing the unfamiliar street name with one finger, before she understood that her father had not drawn Lagos as it was. He had drawn Lagos as he remembered wanting it to be.",
        ],
      },
      {
        number: 2,
        title: "Ink and Memory",
        subtitle: "What the second map revealed.",
        publishedAt: "April 13, 2025",
        readTime: "10 min",
        status: "available",
        content: [
          "The second map was dated eleven years before Adaeze was born, and it showed not a street but a single room — her father's old surveying office, every desk and shelf rendered with an obsessive, loving precision that surprised her.",
          "In the corner of the room, drawn smaller than everything else, was a woman she did not recognize, labeled only with an initial: R.",
          "Her mother's name began with an M. Adaeze sat with this fact the way you sit with a stone in your shoe — aware of it with every step, unable to ignore it, unwilling yet to stop and remove it.",
          "She put the map aside and told herself she would ask her aunties about it later. She did not, that week, or the next.",
        ],
      },
      { number: 3, title: "The Surveyor's Apprentice", status: "drafting" },
      { number: 4, title: "Letters That Were Never Maps", status: "drafting" },
      { number: 5, title: "R, Underlined", status: "drafting" },
      { number: 6, title: "The War Years, Redrawn", status: "drafting" },
      { number: 7, title: "What the Aunties Wouldn't Say", status: "drafting" },
      {
        number: 8,
        title: "The Lagos Grid",
        subtitle: "The last map, and the city it was hiding.",
        publishedAt: "June 7, 2025",
        readTime: "22 min",
        status: "available",
        content: [
          "The final map was the largest of the forty-two, and the only one Adaeze's father had signed — not with his surveyor's stamp, but in his own hand, the ink slightly smudged where his palm must have rested too long before it dried.",
          "It was a map of the whole city, but overlaid, impossibly, with a second city beneath it — streets that didn't exist drawn in fainter ink beneath the streets that did, like a photograph developed twice on the same plate.",
          "Adaeze understood, finally, what six months of unrolling her father's trunk had been building toward: he had not been mapping Lagos at all. He had been mapping every version of it he had loved and lost — the city before the war, the city before her mother, the city before the office that took twelve hours a day and gave back a man too tired to draw anything but ghosts.",
          "R, she now knew, had been a story he never told anyone, folded so carefully into cartography that it had taken his daughter forty-two pieces of paper to find it.",
          "She rolled the final map back up, gently, the way you handle something that has finally stopped being a mystery and started being simply true. Then she added it to the others, and began, for the first time, to draw her own.",
        ],
      },
    ],
  },
  {
    id: 3,
    slug: "soft-animals",
    title: "Soft Animals",
    author: "Adunola",
    genre: "Short Stories",
    status: "Complete",
    accent: "coral",
    excerpt:
      "A collection of very short fictions about belonging, hunger, and the specific grief of Sunday evenings.",
    synopsis:
      "Five small rooms — a porch, a hospital, a kitchen, a dinner table, a doorway — and the soft, unglamorous animal of staying as long as you can in each of them. A complete collection of very short fictions about belonging, hunger, and the particular grief of Sunday evenings.",
    lastUpdated: "April 2025",
    stats: { readers: "6.1k", avgReadTime: "8 min" },
    readingProgress: 100,
    chapters: [
      {
        number: 1,
        title: "Soft Animals",
        subtitle: "The title story.",
        publishedAt: "March 1, 2025",
        readTime: "6 min",
        status: "available",
        content: [
          "The cat that wasn't ours kept coming back to the porch, and we kept not naming it, as though naming were the thing that made an animal yours and we weren't ready for anything else to be ours that year.",
          "My brother fed it anyway. Said a name wasn't required for kindness, which was the kind of thing he said often that summer, usually about people too.",
          "By August it slept in the gap between the porch rail and the wall, a soft animal-shaped silence that neither of us mentioned to our mother, who was, by then, sleeping in a similar gap of her own — between the woman she'd been and whoever she was going to have to become.",
          "We never named the cat. It left in September, the way most soft things did that year, without ceremony, without a sound we noticed until after it was gone.",
        ],
      },
      {
        number: 2,
        title: "The Visiting Hour",
        publishedAt: "March 8, 2025",
        readTime: "5 min",
        status: "available",
        content: [
          "Hospitals have a particular hour — not on any clock, but felt — when the visitors thin out and the only sound left is machines agreeing quietly with themselves.",
          "I learned to love that hour. It was the only time my grandmother spoke plainly, without performing wellness for an audience of well-wishers.",
          "\"Bring grapes next time,\" she said once, during that hour, \"not because I'll eat them. Because rooms like this should have something round and green in them.\"",
          "I brought grapes every visit after that. She never ate one. They sat in their plastic clamshell on the windowsill, going soft, doing exactly the job she'd assigned them.",
        ],
      },
      {
        number: 3,
        title: "Salt",
        publishedAt: "March 15, 2025",
        readTime: "4 min",
        status: "available",
        content: [
          "My father taught me to cook the way other fathers teach fishing — patiently, and mostly by getting it wrong in front of me first.",
          "\"Salt is the only ingredient that admits when it's been forgotten,\" he used to say, tasting a stew with the same furrowed concentration he brought to crossword puzzles. \"Everything else just quietly fails.\"",
          "After he left, I oversalted everything for almost a year. I have never decided if it was grief or habit, or if, by then, there was a difference.",
        ],
      },
      {
        number: 4,
        title: "Sunday, Bring the Knives",
        publishedAt: "March 22, 2025",
        readTime: "5 min",
        status: "available",
        content: [
          "Sunday dinners at my aunt's house required a specific kind of bravery — not because of the food, which was always good, but because of the questions, which arrived between courses like uninvited cousins.",
          "\"Bring the good knives,\" she'd say on the phone beforehand, which meant: bring yourself prepared to be carved into, gently, by people who loved you.",
          "I went anyway, every Sunday, for years. I think now it was because being known badly by people who tried was better than the alternative — being unknown perfectly by people who didn't.",
          "The good knives stayed in a drawer at my own apartment now, mostly unused. I keep meaning to host a Sunday of my own. I keep finding reasons the knives can wait one more week.",
        ],
      },
      {
        number: 5,
        title: "How We Leave",
        subtitle: "The closing story.",
        publishedAt: "April 2, 2025",
        readTime: "6 min",
        status: "available",
        content: [
          "Nobody warns you that leaving happens in installments — a box first, then a key, then, much later, the specific way you stop expecting a certain door to open at a certain hour.",
          "I left my childhood home the way most people do: badly, and more than once. Once at eighteen, with too much confidence. Once at twenty-six, with too little. The final time, much quieter, was the time no one threw a party for — just a Tuesday, a rented van, a mother who helped carry boxes and didn't cry until the van was out of sight.",
          "These five small rooms — the porch, the hospital, the kitchen, the dinner table, the doorway — were never really about leaving at all. They were about the soft, unglamorous animal of staying as long as you can, in whatever shape staying takes.",
          "That, I think, is the only inheritance any of us really get: not the house, not the recipes, not even the grief — just the practice, repeated in small rooms, of learning how to leave well.",
        ],
      },
    ],
  },
  {
    id: 4,
    slug: "a-catalogue-of-quiet-hours",
    title: "A Catalogue of Quiet Hours",
    author: "Adunola",
    genre: "Slow Fiction",
    status: "Ongoing",
    accent: "gold",
    excerpt:
      "Two strangers leave letters for each other inside a library book no one else reads. Neither one signs their name.",
    synopsis:
      "Yetunde finds a stranger's note tucked into page 114 of a forgotten library book — and answers it on the back of a receipt. What begins as a one-time curiosity becomes a slow, anonymous correspondence, carried entirely through the margins of a novel neither of them can name out loud as the reason they keep coming back.",
    lastUpdated: "June 2025",
    stats: { readers: "1.1k", avgReadTime: "7 min" },
    readingProgress: 60,
    chapters: [
      {
        number: 1,
        title: "Dear Whoever Finds This",
        subtitle: "A letter left in a library book, and the reply that found her.",
        publishedAt: "June 1, 2025",
        readTime: "6 min",
        status: "available",
        content: [
          "The letter was tucked into page 114 of a library copy of a novel no one had checked out in six years, which Yetunde supposed was the point — a message meant for whoever was patient enough, or bored enough, to read that far.",
          "Dear whoever finds this, it began, in handwriting too neat to be careless, I don't know what I'm hoping for. Maybe just to know someone reached page 114.",
          "Yetunde had reached page 114 by accident, on a Tuesday she didn't otherwise remember, in a library she only visited because it was raining and her umbrella was, as always, somewhere else.",
          "She did not return the book the following week. Instead, she wrote a reply on the back of a receipt, tucked it into page 115, and returned both to the shelf, where she had no real reason to believe anyone would ever find them.",
        ],
      },
      {
        number: 2,
        title: "The Answer I Didn't Send",
        subtitle: "Three weeks, and the book finds its way back.",
        publishedAt: "June 15, 2025",
        readTime: "7 min",
        status: "available",
        content: [
          "The book was checked out the following Thursday — Yetunde knew because the library's ancient system still printed a paper slip, and she had taken, without quite deciding to, the small habit of checking the return dates of that particular shelf.",
          "When it came back, page 115 held a new note, in the same neat hand, this time addressed not to whoever but, cautiously, to the receipt person.",
          "They went on like this for three more exchanges, never meeting, never signing real names, building a small and improbable friendship out of margins and a single unreliable bookmark.",
          "Yetunde began to understand that she looked forward to Tuesdays now, not because of the rain, but because of what might be waiting on page 115. She did not examine this feeling too closely. Some things, she'd learned, only survive being looked at gently.",
        ],
      },
      { number: 3, title: "Page 116", status: "drafting" },
    ],
  },
];

/* ── Accent color tokens ──────────────────────────────────────────────── */
/* Extends the palette pattern from FeaturedStories.tsx with a gold accent
   for genres that don't fit purple / teal / coral. */
export const ACCENT_COLORS: Record<Accent, { top: string; badge: string; badgeBg: string }> = {
  purple: { top: "var(--purple)", badge: "var(--purple-dark)", badgeBg: "var(--purple-light)" },
  teal: { top: "var(--teal)", badge: "#1d8a7e", badgeBg: "rgba(56,201,180,0.14)" },
  coral: { top: "var(--coral)", badge: "#c0372c", badgeBg: "rgba(255,111,97,0.12)" },
  gold: { top: "var(--gold)", badge: "#9a7212", badgeBg: "rgba(245,185,66,0.16)" },
};

/* ── Accessors ─────────────────────────────────────────────────────────
   Sprint 3: swap these bodies for Supabase queries. Keep signatures. ── */

export function getAllStories(): Story[] {
  return STORIES;
}

export function getStoryBySlug(slug: string): Story | undefined {
  return STORIES.find((s) => s.slug === slug);
}

export interface ChapterLookup {
  story: Story;
  chapter: Chapter;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
}

export function getChapterData(slug: string, chapterNumber: number): ChapterLookup | undefined {
  const story = getStoryBySlug(slug);
  if (!story) return undefined;

  const chapter = story.chapters.find((c) => c.number === chapterNumber);
  if (!chapter) return undefined;

  const prevChapter = story.chapters.find((c) => c.number === chapterNumber - 1) ?? null;
  const nextChapter = story.chapters.find((c) => c.number === chapterNumber + 1) ?? null;

  return { story, chapter, prevChapter, nextChapter };
}

/* First chapter that actually has content — used by "Start Reading" /
   "Continue Reading" CTAs so they never link to a drafting placeholder. */
export function getFirstAvailableChapter(story: Story): Chapter | undefined {
  return story.chapters.find((c) => c.status === "available");
}
