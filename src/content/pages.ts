/**
 * Copy for the company and contact pages. Edit words here, not in the layouts.
 * Product and technology pages live in src/content/topics.
 *
 * Guardrails: capability-level language, no numbers the team can't back, and
 * every product claim signed off before launch. Lines marked "sign-off"
 * describe intended product behaviour and need a team check.
 */
import type { CatalogItem } from '../lib/types';

export const company = {
  meta: {
    title: 'About BBD | BoxBox Drone',
    description:
      'BBD, short for BoxBox Drone, builds AI models for drones in Palo Alto, California: delivery drones, Drako training drones and drone show software.',
  },
  hero: {
    eyebrow: 'Company',
    title: 'AI models for drones.',
    lead: 'BBD, short for BoxBox Drone, builds the models that fly drones and the low-cost hardware they fly on. We’re based in Palo Alto, California.',
  },
  // sign-off
  pillars: [
    {
      id: 'pillar-model',
      kicker: 'Software',
      title: 'The model',
      text: 'A world action model trained for every environment, with a specialist for each job.',
      link: { label: 'About the model', href: '/wam' },
    },
    {
      id: 'pillar-products',
      kicker: 'Products',
      title: 'Three ways to fly',
      text: 'Last-mile delivery drones, Drako training drones and software for drone shows.',
      link: { label: 'See the products', href: '/products' },
    },
    {
      id: 'pillar-hardware',
      kicker: 'Hardware',
      title: 'Toward zero cost',
      text: 'Simple, low-cost airframes, so the value lives in the software.',
      link: { label: 'Why now', href: '/why-now' },
    },
  ] satisfies CatalogItem[],
  beliefs: {
    title: 'What we believe.',
    text: 'The drone race will be won on software. Hardware should be cheap enough to replace without a second thought, and every flight should make the model better.',
    items: ['Software first, hardware toward zero cost', 'One model, many jobs', 'Every flight makes the model better', 'Built in Palo Alto, California'],
  },
  cta: {
    title: 'Talk to us.',
    text: 'Partners, press, investors and engineers. Tell us what you have in mind.',
  },
};

export const contact = {
  meta: {
    title: 'Contact BBD',
    description: 'Talk to BBD about delivery pilots, Drako training exercises, drone shows, engineering roles, press or investment.',
  },
  hero: {
    eyebrow: 'Contact',
    title: 'Talk to us.',
    lead: 'Tell us what you need to fly, and where. Pick a topic below, or write to us directly.',
  },
  topics: [
    { id: 'delivery', title: 'Delivery pilots', text: 'Retailers, restaurants and logistics teams.', subject: 'Delivery pilot' },
    { id: 'drako', title: 'Drako exercises', text: 'Training units, test ranges and counter-drone teams.', subject: 'Drako' },
    { id: 'shows', title: 'Drone shows', text: 'Producers, venues and cities.', subject: 'Drone show' },
    { id: 'engineering', title: 'Engineering and research', text: 'Join the team, or work with us on the model.', subject: 'Engineering' },
    { id: 'press', title: 'Press and investors', text: 'Interviews, partnerships and funding.', subject: 'Press and investors' },
  ],
  direct: 'Or write to',
};
