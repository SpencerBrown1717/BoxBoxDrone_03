/**
 * Every mission and technology page, the section hubs, and lookups between them.
 * Routes come from here: src/pages/[...slug].astro builds one page per topic.
 */
import type { IconName } from '../../components/icon-paths';
import type { SceneName, Section, Topic } from './types';
import { delivery, drako, shows } from './missions';
import { hardware, models } from './technology';
import { whyAmerica } from './america';

export const topics: Topic[] = [delivery, drako, shows, models, hardware, whyAmerica];

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

/** Drawn scenes for pages whose hero is the live sky band. */
const bandScenes: Record<string, SceneName> = {
  delivery: 'delivery',
  drako: 'drako',
  shows: 'shows',
};

export function cardFor(slug: string): CardInfo {
  const topic = getTopic(slug);
  const scene = 'scene' in topic.hero.visual ? topic.hero.visual.scene : bandScenes[slug];
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

export const hubs: Record<Section, Hub> = {
  missions: {
    label: 'Missions',
    href: '/missions',
    meta: {
      title: 'Missions | BoxBox Drone',
      description: 'Last-mile delivery, Drako training targets and drone shows, all flown by the BBD world action model.',
    },
    title: 'Three missions, one model.',
    lead: 'Last-mile delivery, Drako targets for counter-drone training, and drone shows. One model flies them all, and every flight makes it better.',
    groups: [{ title: 'Missions', slugs: ['delivery', 'drako', 'shows'] }],
    cta: { title: 'Tell us your mission.', text: 'Ranges, restaurants, stores, cities and events.' },
  },
  technology: {
    label: 'Technology',
    href: '/technology',
    meta: {
      title: 'Technology | BoxBox Drone',
      description: 'A world action model for drones, trained for every environment, on hardware that costs next to nothing.',
    },
    title: 'The model is the product.',
    lead: 'A world action model trained for every environment and specialized by mission, flying aircraft that cost next to nothing.',
    groups: [{ title: 'Technology', slugs: ['models', 'hardware'] }],
    cta: { title: 'Fly our model.', text: 'Airframe makers, operators and research labs: talk to us about early access.' },
  },
  company: {
    label: 'Company',
    href: '/company',
    meta: {
      title: 'About BoxBox Drone',
      description: 'BoxBox Drone builds AI models for drones in Palo Alto, California.',
    },
    title: 'AI models for drones, built in Palo Alto.',
    lead: 'Why we exist, where we are going and how to reach us.',
    groups: [{ title: 'Company', slugs: ['why-america'] }],
    cta: { title: 'Talk to us.', text: 'Partnerships, press, investors and careers.' },
  },
};
