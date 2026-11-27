import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Newsroom stories. One Markdown file per story in src/content/news.
 * The rules for writing one are in docs/newsroom.md.
 */
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string().max(90),
    dek: z.string().max(240),
    date: z.coerce.date(),
    category: z.enum(['autonomy', 'missions', 'industry']),
    sources: z
      .array(
        z.object({
          title: z.string(),
          publisher: z.string(),
          url: z.url(),
          date: z.string().optional(),
        }),
      )
      .min(2),
    draft: z.boolean().default(false),
  }),
});

export const collections = { news };
