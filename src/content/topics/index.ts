/**
 * Every topic page, the section hubs, and lookups between them.
 * Routes come from here: src/pages/[...slug].astro builds one page per topic.
 */
import type { IconName } from '../../components/icon-paths';
import type { SceneName, Section, Topic } from './types';
import { delivery } from './delivery';
import { drako } from './drako';
import { shows } from './shows';
import { wam } from './wam';
import { models } from './models';
import { whyNow } from './why-now';

export const topics: Topic[] = [delivery, drako, shows, wam, models, whyNow];

const bySlug = new Map(topics.map((topic) => [topic.slug, topic]));

export function getTopic(slug: string): Topic {
  const topic = bySlug.get(slug);
  if (!topic) throw new Error(`No topic page for "${slug}"`);
  return topic;
}

/** What a card needs to show any page. */
export interface CardInfo {
  href: string;
  title: string;
  text: string;
  icon: IconName;
  scene?: SceneName;
}

export function cardFor(slug: string): CardInfo {
  const topic = getTopic(slug);
  const scene = 'scene' in topic.hero.visual ? topic.hero.visual.scene : undefined;
  return { href: `/${topic.slug}`, ...topic.card, scene };
}

/** The trail above a page's title: section hub, parent, then the page. */
export function breadcrumbFor(topic: Topic): { label: string; href: string }[] {
  const trail = [{ label: hubs[topic.section].label, href: hubs[topic.section].href }];
  if (topic.parent) {
    const parent = getTopic(topic.parent);
    trail.push({ label: parent.card.title, href: `/${parent.slug}` });
  }
  trail.push({ label: topic.card.title, href: `/${topic.slug}` });
  return trail;
}

export interface Hub {
  label: string;
  href: string;
  meta: { title: string; description: string };
  title: string;
  lead: string;
  groups: { title: string; slugs: string[] }[];
  cta: { title: string; text: string };
}

/** Products and Technology have hub pages. Company is its own page; its hub entry only names the breadcrumb. */
export const hubs: Record<Section, Hub> = {
  products: {
    label: 'Products',
    href: '/products',
    meta: {
      title: 'Products | BBD',
      description: 'Last-mile delivery drones, Drako training drones and drone show software, all flown by one world action model.',
    },
    title: 'One model, three ways to fly.',
    lead: 'Delivery for the last mile, Drako training drones for counter-drone ranges, and a suite for drone light shows.',
    groups: [{ title: 'Products', slugs: ['delivery', 'drako', 'shows'] }],
    cta: { title: 'Tell us what you need to fly.', text: 'Delivery pilots, Drako exercises and shows.' },
  },
  technology: {
    label: 'Technology',
    href: '/technology',
    meta: {
      title: 'Technology | BBD',
      description: 'BBD’s world action model, trained for every environment, and the specialists built on top of it.',
    },
    title: 'AI models for drones.',
    lead: 'A world action model trained for every environment, and a specialist for each job.',
    groups: [
      { title: 'Technology', slugs: ['wam', 'models'] },
      { title: 'Why it matters', slugs: ['why-now'] },
    ],
    cta: { title: 'Talk to the team.', text: 'Research partnerships, pilots and questions about the model.' },
  },
  company: {
    label: 'Company',
    href: '/company',
    meta: {
      title: 'About BBD',
      description: 'BBD builds AI models for drones in Palo Alto, California.',
    },
    title: 'AI models for drones.',
    lead: 'BBD builds AI models for drones in Palo Alto, California.',
    groups: [{ title: 'Company', slugs: ['why-now'] }],
    cta: { title: 'Talk to us.', text: 'Partners, press and careers.' },
  },
};
