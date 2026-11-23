import type { Topic } from './types';

export const delivery: Topic = {
  slug: 'delivery',
  section: 'products',
  card: {
    title: 'Delivery',
    text: 'Last-mile delivery drones that reach new doors, in new weather.',
    icon: 'package',
  },
  meta: {
    title: 'Last-mile delivery drones | BBD',
    description:
      'BBD builds last-mile delivery drones flown by its world action model, trained to reach new homes in new weather. Based in Palo Alto, California.',
  },
  hero: {
    kicker: 'Delivery',
    title: 'The last mile, flown.',
    // sign-off
    lead: 'Delivery drones that carry small orders from a local hub to the door. Our model is trained to reach homes it has never seen, in weather it has never flown.',
    visual: { scene: 'delivery' },
    caption: 'A drawing of a delivery hub with drone routes arcing out to homes across a neighborhood.',
    actions: {
      primary: { label: 'Talk to us', href: '/contact#delivery' },
      secondary: { label: 'How the model works', href: '/wam' },
    },
  },
  need: {
    title: 'The most expensive mile.',
    intro: 'The last stretch to the door costs more than any other step in getting an order to a customer. Drone delivery is starting to scale, and the rules are catching up.',
    stats: [
      { value: '41%', label: 'of total supply chain costs go to last-mile delivery', sources: ['capgemini'] },
      { value: '270', label: 'US Walmart locations planned for Wing drone delivery by the end of 2027', sources: ['walmart270'] },
      { value: '2025', label: 'the FAA proposed Part 108, a rule for routine drone flights beyond visual line of sight', sources: ['part108'] },
    ],
  },
  why: {
    title: 'Why drones, and why a model.',
    intro: 'A drone flies a straight line and skips the traffic. The hard part is every new street, roof and gust of wind. That is a software problem.',
    points: [
      {
        icon: 'route',
        title: 'Straight to the door',
        text: 'No roads, no traffic and no parking. A small order flies directly from the hub to the home.',
      },
      // sign-off
      {
        icon: 'home',
        title: 'New homes, first try',
        text: 'Our model trains on many simulated neighborhoods, so a new address is not a new problem.',
      },
      // sign-off
      {
        icon: 'rain',
        title: 'Weather it hasn’t flown',
        text: 'Wind, rain and night are part of training from the start, not edge cases added later.',
      },
    ],
  },
  how: {
    title: 'From hub to door.',
    intro: 'Every delivery is a short mission that repeats all day.',
    steps: [
      { icon: 'package', title: 'Load', text: 'A small order is packed at a local hub and loaded onto the drone.' },
      { icon: 'drone', title: 'Fly', text: 'The drone flies a direct route while the model reads the world around it.' },
      { icon: 'home', title: 'Deliver', text: 'It sets the order down at the address, then flies back to the hub.' },
      { icon: 'model', title: 'Learn', text: 'Every flight goes back into training, so the next one goes better.' },
    ],
  },
  stage: {
    title: 'Where drone delivery stands.',
    level: 2,
    text: 'Drone delivery is already scaling in parts of the United States. Routine flights beyond visual line of sight still wait on a final FAA rule.',
    milestones: [
      { year: '2025', text: 'An executive order directs the FAA to enable routine flights beyond visual line of sight.', sources: ['eo14307'] },
      { year: '2025', text: 'The FAA proposes Part 108, its rule for those flights.', sources: ['part108'] },
      { year: '2026', text: 'Wing and Walmart announce drone delivery from 150 more stores, coast to coast.', sources: ['wingWalmart'] },
      { year: '2026', text: 'The final Part 108 rule goes to the White House for review in July.', sources: ['part108'] },
    ],
  },
  // sign-off
  bbd: {
    title: 'What BBD is building.',
    text: 'Last-mile delivery drones and the model that flies them, starting in Palo Alto.',
    items: [
      'Delivery drones for small, everyday orders',
      'Hub software to load, launch and track every flight',
      'A world action model trained for new homes and new weather',
      'Low-cost hardware, so each flight costs less',
    ],
    note: 'In development, starting in Palo Alto. Talk to us about delivery pilots.',
  },
  related: ['wam', 'models', 'why-now'],
  cta: {
    title: 'Bring drone delivery to your customers.',
    text: 'Retailers, restaurants and logistics teams: tell us what you deliver and where.',
    primary: { label: 'Talk to us', href: '/contact#delivery' },
    secondary: { label: 'Why now', href: '/why-now' },
  },
};
