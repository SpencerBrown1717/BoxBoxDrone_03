/**
 * The two main menus and the links after them. Every item is its own page.
 * Titles, one-line descriptions and icons come from each page's card in
 * src/content/topics, so the menus can't drift from the pages they open.
 */
import type { IconName } from '../components/icon-paths';
import { contactHref } from '../config/site';
import { cardFor } from './topics';

export type MiniSceneName = 'delivery' | 'drako' | 'shows' | 'model';

/** A main page in a menu: icon, title and one line. */
export interface NavItem {
  title: string;
  description: string;
  href: string;
  icon: IconName;
}

/** A compact link in a group: icon and title. */
export interface NavLink {
  title: string;
  href: string;
  icon: IconName;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

export interface NavTab {
  id: 'missions' | 'technology';
  label: string;
  href: string;
  headline: string;
  description: string;
  allLabel: string;
  scene: MiniSceneName;
  items: NavItem[];
  groups: NavGroup[];
  note: string;
  cta: { label: string; href: string };
}

const item = (slug: string): NavItem => {
  const card = cardFor(slug);
  return { title: card.title, description: card.text, href: card.href, icon: card.icon };
};

export const tabs: NavTab[] = [
  {
    id: 'missions',
    label: 'Missions',
    href: '/missions',
    headline: 'Three missions, one model.',
    description: 'Last-mile delivery, Drako training targets and drone shows, all flown by the BBD model.',
    allLabel: 'All missions',
    scene: 'delivery',
    items: ['delivery', 'drako', 'shows'].map(item),
    groups: [
      {
        title: 'Get started',
        links: [
          { title: 'Request Drako targets', href: contactHref('drako'), icon: 'target' },
          { title: 'Bring delivery to your town', href: contactHref('delivery'), icon: 'package' },
          { title: 'Plan a show', href: contactHref('shows'), icon: 'sparkle' },
        ],
      },
    ],
    note: 'Each page shows the need in numbers, where things stand and what BBD is building.',
    cta: { label: 'Talk to us', href: '/contact' },
  },
  {
    id: 'technology',
    label: 'Technology',
    href: '/technology',
    headline: 'The model is the product.',
    description: 'A world action model trained for every environment, on aircraft that cost next to nothing.',
    allLabel: 'All technology',
    scene: 'model',
    items: ['models', 'hardware'].map(item),
    groups: [
      {
        title: 'The model',
        links: [
          { title: 'How it’s specialized', href: '/models#specialists', icon: 'target' },
          { title: 'How we plan to beat the field', href: '/models#plan', icon: 'chart' },
          { title: 'How it learns', href: '/models#how-it-works', icon: 'layers' },
        ],
      },
    ],
    note: 'Each page lists the sources behind its numbers.',
    cta: { label: 'Fly our model', href: contactHref('models') },
  },
];

/** Plain links after the menus */
export const links = [
  { label: 'Why America', href: '/why-america' },
  { label: 'Newsroom', href: '/news' },
  { label: 'Company', href: '/company' },
];
