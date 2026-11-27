import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { categoryLabel, getStories, storyHref } from '../../lib/news';
import { site } from '../../config/site';

export async function GET(context: APIContext) {
  const stories = await getStories();
  return rss({
    title: 'BoxBox Drone Newsroom',
    description: 'Three sourced stories a week on autonomy, missions and the drone industry.',
    site: context.site ?? site.url,
    items: stories.map((story) => ({
      title: story.data.title,
      description: story.data.dek,
      pubDate: story.data.date,
      link: storyHref(story),
      categories: [categoryLabel(story.data.category)],
    })),
    customData: '<language>en-us</language>',
  });
}
