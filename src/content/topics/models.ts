import type { Topic } from './types';

export const models: Topic = {
  slug: 'models',
  section: 'technology',
  card: {
    title: 'Specialized models',
    text: 'One base model, tuned for delivery, Drako, shows and test.',
    icon: 'layers',
  },
  meta: {
    title: 'How our drone models are specialized | BBD',
    description: 'How BBD specializes one world action model for delivery, Drako training drones, drone shows and test.',
  },
  hero: {
    kicker: 'Technology',
    title: 'One base model, four specialists.',
    lead: 'Every BBD drone runs a version of the same world action model. Each job gets its own specialist, trained on top of the base, so what one learns can help the rest.',
    visual: { scene: 'models' },
    caption: 'A drawing of one base model branching into four specialists: delivery, Drako, shows and test.',
    actions: {
      primary: { label: 'Talk to us', href: '/contact' },
      secondary: { label: 'The base model', href: '/wam' },
    },
  },
  need: {
    title: 'Many drones, many jobs.',
    intro: 'Drones are about to be bought by the hundreds of thousands, for very different jobs. Building a new autonomy stack for each one is too slow.',
    stats: [
      { value: '1 million', label: 'drones the US Army plans to buy within two to three years', sources: ['armyMillion'] },
      { value: '270', label: 'US Walmart locations planned for Wing drone delivery by the end of 2027', sources: ['walmart270'] },
      { value: '22,580', label: 'drones flown from a single computer in one show, a Guinness World Record', sources: ['guinnessSingle'] },
    ],
  },
  why: {
    title: 'Why specialize one model.',
    intro: 'Specialists share what they learn. A gust handled on a delivery route is a gust handled over a show.',
    points: [
      { icon: 'model', title: 'A shared base', text: 'Flight, perception and physics are learned once, in the base model.' },
      { icon: 'layers', title: 'Thin specialists', text: 'Each job adds a layer of training on top, so a new job starts from everything the base already knows.' },
      { icon: 'route', title: 'Every flight counts', text: 'Data from each specialist flows back into the base, so they all improve together.' },
    ],
  },
  how: {
    title: 'The four specialists.',
    intro: 'Each one starts from the same base model.',
    sequence: false,
    // sign-off
    steps: [
      { icon: 'package', title: 'Delivery', text: 'Finds the door, sets the order down and flies home, in new places and new weather.' },
      { icon: 'flag', title: 'Drako', text: 'Flies unarmed training drones on set courses for counter-drone ranges, the same way every time.' },
      { icon: 'sparkle', title: 'Shows', text: 'Keeps every drone on its mark in the wind, frame after frame.' },
      { icon: 'sim', title: 'Test', text: 'Runs drones and the systems around them through simulated missions before anything flies.' },
    ],
  },
  // sign-off
  bbd: {
    title: 'What BBD is building.',
    text: 'The base model first, then the specialists, starting with delivery.',
    items: [
      'A base world action model for flight',
      'The delivery specialist, first',
      'Drako and test specialists for training ranges',
      'A show specialist for formation flight',
    ],
  },
  related: ['wam', 'delivery', 'drako'],
  cta: {
    title: 'Need a specialist we haven’t built?',
    text: 'Tell us the job and where it flies.',
    primary: { label: 'Talk to us', href: '/contact' },
    secondary: { label: 'The base model', href: '/wam' },
  },
};
