/**
 * The two main menus and the links after them. Every item is its own page.
 * Titles, one-line descriptions and icons come from each page's card in
 * src/content/topics, so the menus can't drift from the pages they open.
 */
import type { IconName } from '../components/icon-paths';
import type { SceneName } from './topics/types';
import { cardFor } from './topics';

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
  id: 'products' | 'technology';
  label: string;
  href: string;
  headline: string;
  description: string;
  allLabel: string;
  scene: SceneName;
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
    id: 'products',
    label: 'Products',
    href: '/products',
    headline: 'One model, three ways to fly.',
    description: 'Last-mile delivery, Drako training drones and drone show software.',
    allLabel: 'All products',
    scene: 'delivery',
    items: ['delivery', 'drako', 'shows'].map(item),
    groups: [
      {
        title: 'Get started',
        links: [
          { title: 'Start a delivery pilot', href: '/contact#delivery', icon: 'package' },
          { title: 'Plan a Drako exercise', href: '/contact#drako', icon: 'flag' },
          { title: 'Plan a show', href: '/contact#shows', icon: 'sparkle' },
        ],
      },
    ],
    note: 'Every BBD product runs on the same world action model.',
    cta: { label: 'Talk to us', href: '/contact' },
  },
  {
    id: 'technology',
    label: 'Technology',
    href: '/technology',
    headline: 'AI models for drones.',
    description: 'A world action model trained for every environment, with a specialist for each job.',
    allLabel: 'All technology',
    scene: 'wam',
    items: ['wam', 'models'].map(item),
    groups: [
      {
        title: 'Learn more',
        links: [
          { title: 'Why now', href: '/why-now', icon: 'tag' },
          { title: 'Talk to the team', href: '/contact#engineering', icon: 'message' },
        ],
      },
    ],
    note: 'Simulation first. Real flights settle it.',
    cta: { label: 'Talk to the team', href: '/contact#engineering' },
  },
];

/** Plain links after the menus */
export const links = [
  { label: 'Why now', href: '/why-now' },
  { label: 'Company', href: '/company' },
];
