import { getCollection, type CollectionEntry } from 'astro:content';
import type { MiniSceneName } from '../content/nav';

export type Story = CollectionEntry<'news'>;
export type Category = Story['data']['category'];

export const categories: { id: Category; label: string; all: string; description: string }[] = [
  { id: 'autonomy', label: 'Autonomy', all: 'All autonomy stories', description: 'Software and models that fly aircraft themselves.' },
  { id: 'missions', label: 'Missions', all: 'All mission stories', description: 'Delivery, training targets and the work drones are asked to do.' },
  { id: 'industry', label: 'Industry', all: 'All industry stories', description: 'Shows, factories and the wider drone business.' },
];

/** The still field scene that stands in for a photo on each section's stories. */
export const categoryScene: Record<Category, MiniSceneName> = {
  autonomy: 'model',
  missions: 'delivery',
  industry: 'shows',
};

export const categoryLabel = (id: Category) => categories.find((c) => c.id === id)?.label ?? id;

/** Published stories, newest first. */
export async function getStories(category?: Category): Promise<Story[]> {
  const all = await getCollection('news', ({ data }) => !data.draft && (!category || data.category === category));
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id));
}

export const storyHref = (story: Story) => `/news/${story.id}`;

const formatter = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
export const formatDate = (date: Date) => formatter.format(date);
export const isoDate = (date: Date) => date.toISOString().slice(0, 10);

/** Rough reading time at 230 words a minute. */
export const readingMinutes = (body = '') => Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 230));
