import type { Topic } from './types';

export const drako: Topic = {
  slug: 'drako',
  section: 'products',
  card: {
    title: 'Drako',
    text: 'Low-cost, unarmed training drones and simulation for counter-drone ranges.',
    icon: 'flag',
  },
  meta: {
    title: 'Drako training drones | BBD',
    description:
      'Drako is BBD’s program of low-cost, unarmed training drones and range simulation software for counter-drone training and testing.',
  },
  hero: {
    kicker: 'Defense',
    title: 'Drako: drones built for practice.',
    // sign-off
    lead: 'Drako gives counter-drone crews something real to train on. Low-cost, unarmed drones fly set courses on the range, and simulation software lets teams rehearse before a live day.',
    visual: { scene: 'drako' },
    caption: 'A drawing of a training range: drones flying a marked course beside its simulated twin, with range control at the edge.',
    actions: {
      primary: { label: 'Talk to us', href: '/contact#drako' },
      secondary: { label: 'Specialized models', href: '/models' },
    },
  },
  need: {
    title: 'Training needs real drones.',
    intro: 'Units are building counter-drone training into their ranges. Some of it still relies on stand-ins that don’t fly like drones.',
    stats: [
      { value: '1 million', label: 'drones the US Army plans to buy within two to three years', sources: ['armyMillion'] },
      { value: '50,000', label: 'drones the Army buys in a year today', sources: ['armyToday'] },
      { value: 'Clay targets', label: 'and paper targets still sat alongside live drones at a 2026 Army counter-drone range', sources: ['braggRange'] },
    ],
  },
  why: {
    title: 'Why Drako.',
    intro: 'Good training is realistic, repeatable and cheap enough to do often.',
    points: [
      {
        icon: 'drone',
        title: 'Real flight, not stand-ins',
        text: 'Training units say they need realistic, hands-on experience. Drako drones fly like drones because they are drones.',
        sources: ['indiantownGap', 'realisticTraining'],
      },
      // sign-off
      {
        icon: 'tag',
        title: 'Low cost by design',
        text: 'Simple airframes keep each training drone cheap to replace, so units can train often.',
      },
      // sign-off
      {
        icon: 'shield',
        title: 'Unarmed and range-only',
        text: 'No payloads and no weapons. Drako drones fly set courses inside range limits, under range control.',
      },
    ],
  },
  how: {
    title: 'A Drako training day.',
    intro: 'Range staff stay in control from setup to debrief.',
    // sign-off
    steps: [
      { icon: 'sim', title: 'Plan', text: 'Build the exercise in simulation: the course, the timing and how many drones fly.' },
      { icon: 'flag', title: 'Set up', text: 'Range staff mark the course and its limits. Drones launch only inside them.' },
      { icon: 'drone', title: 'Fly', text: 'Drako drones fly the planned course, flown by our model, under range control.' },
      { icon: 'chart', title: 'Review', text: 'Replay the day in simulation and track how the unit improves over time.' },
    ],
  },
  // sign-off
  bbd: {
    title: 'What BBD is building.',
    text: 'The Drako program: training drones, the software that flies them, and the simulation around them.',
    items: [
      'Low-cost, unarmed training drones',
      'Range simulation software for planning and review',
      'Our model, specialized to fly set courses safely',
      'Designed in Palo Alto, California',
    ],
    note: 'In development. Drako is for training and testing only.',
  },
  related: ['models', 'wam', 'why-now'],
  cta: {
    title: 'Plan a Drako exercise.',
    text: 'Training units, test ranges and counter-drone teams: tell us what you need to practice.',
    primary: { label: 'Talk to us', href: '/contact#drako' },
    secondary: { label: 'Why now', href: '/why-now' },
  },
};
