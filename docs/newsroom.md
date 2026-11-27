# Newsroom guide

The newsroom at `/news` publishes sourced stories about drones and the software that flies them. The homepage shows the latest three. This file is the brief for whoever writes it, person or agent. Follow it exactly.

| Category | Covers |
| --- | --- |
| `autonomy` | Software and models that fly aircraft themselves: flight stacks, quieter or safer routing, world models, onboard decision-making. |
| `missions` | The work drones are asked to do: delivery, training targets, defense production, and related programs. |
| `industry` | Shows, factories, records and the wider drone business. |

## Picking the story

1. Look at what happened in the last 7 days. If the week was quiet, the last 14 days are fine.
2. Read the existing files in `src/content/news/` first. Do not cover an event, paper or announcement that is already covered. A real follow-up with new facts is fine, and should link back to the earlier story.
3. Prefer stories about software that flies aircraft, delivery, training targets and shows, since that is what BoxBox Drone builds. Rotate categories when the news allows.
4. A story needs at least two sources you have opened and read, and at least one should be primary: the company's or agency's own release, the certification, or the paper. Search snippets, aggregator summaries you did not open, and social posts do not count.
5. If nothing credible happened in a category, skip that category. Publishing nothing is better than publishing something thin or wrong.
6. Each week, add new sourced stories so the homepage strip of three refreshes. Up to three new stories is the usual batch. Older stories stay in the archive.

## Writing it

- **Your own words.** Paraphrase. At most one direct quote per source, and every quote under 15 words. Never copy a sentence from a source with the quote marks removed, and never follow a source's structure paragraph by paragraph.
- **Who says so.** Attribute every claim that is not settled fact: "Zipline says", "Guinness recognized", "Breaking Defense reported". Say when a claim is theoretical, self-reported or not independently measured.
- **Specific over hype.** Numbers, places, dates and names. No "revolutionary", "game-changing", "unprecedented" or "breakthrough" unless a source you cite uses it, and then in quotes.
- **Neutral.** Report programs, budgets and policy without opinion on parties or politicians.
- **No BoxBox Drone claims.** Do not mention BoxBox Drone's products or plans. The story is about the industry.
- **House style.** Sentence case for the headline and subheads. No em dashes or en dashes; use commas, colons or a new sentence. No arrows. No all-caps labels. Plain verbs. Write ranges as "3 to 9 months".
- **Length.** 450 to 700 words. Open with what happened, who and when, in the first two sentences. Then 2 to 4 short sections with `##` subheads. One bullet list at most. End with a short "Why it matters" or "What to watch" section that sticks to what the sources support.

## The file

Create `src/content/news/<slug>.md`.

- The slug is kebab-case, at most 60 characters, unique, and describes the story (`zipline-quieter-deliveries-sound-optimized-flight`). It must not be `autonomy`, `missions` or `industry`, since those are section pages.
- `title` at most 90 characters. `dek` at most 240 characters, one or two sentences that add to the title instead of repeating it.
- `date` is the publishing time in UTC, ISO format.
- `sources` lists every source the story relies on, primary first, at least two. `date` on a source is the date it was published, written out ("November 6, 2026").

```md
---
title: "Sentence case headline that says what happened"
dek: "One or two sentences of context the headline could not fit."
date: 2026-11-27T17:00:00Z
category: autonomy
sources:
  - title: "Exact title of the primary source"
    publisher: Organization name
    url: https://example.com/release
    date: November 20, 2026
  - title: "Exact title of the second source"
    publisher: Publication name
    url: https://example.com/article
    date: November 21, 2026
---

First paragraph: what happened, who did it, when.

## A short subhead

Body.

## What to watch

What the sources say comes next, or what has not been shown yet.
```

## Before you publish

1. `npm run build` passes. The schema rejects a missing field, a long title or dek, a bad URL, or fewer than two sources.
2. `npm test` passes.
3. Search the new file for `—`, `–` and `→`. There should be none.
4. Read the story once against each source. Every number, name and date must match.
5. Commit only the new story file when you are refreshing the week, with the message `News: <title>`, and push. If you are changing the newsroom itself, say so in the commit.
