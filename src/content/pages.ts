/**
 * Copy for the company and contact pages. Edit words here, not in the layouts.
 * Mission and technology pages live in src/content/topics.
 *
 * Lines marked "sign-off" describe the company or intended product behaviour and need a team check.
 */
import type { CatalogItem } from '../lib/types';
import type { IconName } from '../components/icon-paths';

// sign-off
export const company = {
  meta: {
    title: 'About BoxBox Drone',
    description:
      'BoxBox Drone (BBD) builds AI models for drones and the low-cost aircraft they fly on. Based in Palo Alto, California, and incubated at Harvard Innovation Labs.',
  },
  hero: {
    eyebrow: 'Company',
    title: 'AI models for drones, built in Palo Alto.',
    lead: 'BoxBox Drone builds the world action model that flies any drone, and the low-cost aircraft it flies on. We call it BBD for short.',
  },
  pillars: [
    {
      id: 'pillar-model',
      kicker: 'The software',
      title: 'World action model',
      text: 'One model, trained for every environment and weather, that flies any airframe. Specialized for each mission.',
      link: { label: 'About the model', href: '/models' },
    },
    {
      id: 'pillar-missions',
      kicker: 'Where it flies',
      title: 'Missions',
      text: 'Last-mile delivery, Drako targets for counter-drone training, and drone shows.',
      link: { label: 'See the missions', href: '/missions' },
    },
    {
      id: 'pillar-hardware',
      kicker: 'What it flies on',
      title: 'Hardware near zero',
      text: 'Simple, low-cost aircraft, so more drones fly and every flight teaches the model.',
      link: { label: 'About the hardware', href: '/hardware' },
    },
  ] satisfies CatalogItem[],
  why: {
    title: 'Why we exist.',
    text: 'America fell behind in drones. We think software is how it wins: drive the cost of the hardware toward zero, then fly every drone better than anyone else.',
    facts: ['Based in Palo Alto, California', 'Incubated at Harvard Innovation Labs', 'Founded by Spencer Brown'],
  },
  cta: {
    title: 'Talk to us.',
    text: 'Partnerships, investors, press and careers. Tell us what you have in mind.',
  },
};

export interface ContactTopic {
  id: string;
  icon: IconName;
  title: string;
  text: string;
  subject: string;
}

export const contact = {
  meta: {
    title: 'Contact BoxBox Drone',
    description: 'Talk to BoxBox Drone about Drako targets, drone delivery, drone shows, our model, hardware, investment, press or careers.',
  },
  hero: {
    eyebrow: 'Contact',
    title: 'Talk to us.',
    lead: 'Pick what you want to talk about and send us a note. A person reads every message.',
  },
  topics: [
    {
      id: 'drako',
      icon: 'target',
      title: 'Drako targets',
      text: 'Training units, ranges and counter-drone test teams.',
      subject: 'Drako targets',
    },
    {
      id: 'delivery',
      icon: 'package',
      title: 'Drone delivery',
      text: 'Restaurants, stores and cities that want delivery by air.',
      subject: 'Drone delivery',
    },
    { id: 'shows', icon: 'sparkle', title: 'Drone shows', text: 'Cities, teams, brands and events.', subject: 'A drone show' },
    {
      id: 'models',
      icon: 'brain',
      title: 'Fly our model',
      text: 'Airframe makers, operators and research labs.',
      subject: 'The BBD model',
    },
    {
      id: 'hardware',
      icon: 'chip',
      title: 'Hardware and supply',
      text: 'Airframe makers, suppliers and fleet operators.',
      subject: 'Hardware',
    },
    {
      id: 'america',
      icon: 'flag',
      title: 'Investors and agencies',
      text: 'Investors, partners and public agencies.',
      subject: 'Investing and partnering',
    },
    { id: 'press', icon: 'press', title: 'Press', text: 'Stories, interviews and images.', subject: 'Press' },
    {
      id: 'careers',
      icon: 'partners',
      title: 'Careers',
      text: 'Engineers and operators who want to build America’s drone software.',
      subject: 'Careers',
    },
  ] satisfies ContactTopic[],
  action: 'Email us',
};
