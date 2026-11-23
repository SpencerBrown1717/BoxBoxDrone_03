import type { Topic } from './types';

export const shows: Topic = {
  slug: 'shows',
  section: 'products',
  card: {
    title: 'Shows',
    text: 'Software to design, simulate and fly drone light shows.',
    icon: 'sparkle',
  },
  meta: {
    title: 'Drone show software | BBD',
    description: 'BBD’s drone show suite: design a show, simulate every flight path, and fly it with a model that keeps each drone on its mark.',
  },
  hero: {
    kicker: 'Shows',
    title: 'Choreography for the sky.',
    // sign-off
    lead: 'A software suite for drone light shows. Design the show, check every flight path in simulation, then fly it with our model holding each drone on its mark.',
    visual: { scene: 'shows' },
    caption: 'A drawing of drones rising from a launch grid to form a star in the night sky.',
    actions: {
      primary: { label: 'Talk to us', href: '/contact#shows' },
      secondary: { label: 'Specialized models', href: '/models' },
    },
  },
  need: {
    title: 'The biggest shows fly in China.',
    intro: 'Drone shows keep getting bigger. The records, and much of the hardware, come from China.',
    stats: [
      { value: '33,615', label: 'drones airborne at once in Sichuan, China, a Guinness World Record', sources: ['guinnessGroup'] },
      { value: '22,580', label: 'drones flown from a single computer in Hefei, China, a Guinness World Record', sources: ['guinnessSingle'] },
      { value: '10,183', label: 'drones in a record dragon over Texas, flown with the US partner of a Shenzhen show maker', sources: ['skyElements'] },
    ],
  },
  why: {
    title: 'Why our suite.',
    intro: 'A show is thousands of drones flying one plan. The software decides how good it looks and how safely it flies.',
    // sign-off
    points: [
      { icon: 'sparkle', title: 'Design in one place', text: 'Lay out formations and transitions on one timeline, set to music.' },
      { icon: 'sim', title: 'Simulate every path', text: 'Check spacing, timing and battery for every drone before the show leaves the ground.' },
      { icon: 'wind', title: 'Hold the mark', text: 'Our model corrects for wind, so each drone stays on its point in the picture.' },
    ],
  },
  how: {
    title: 'From idea to night sky.',
    intro: 'One file carries the show from the first sketch to the last frame.',
    steps: [
      { icon: 'sparkle', title: 'Design', text: 'Draw the formations and choose the music.' },
      { icon: 'sim', title: 'Simulate', text: 'Run the whole show in software and fix any conflict.' },
      { icon: 'drone', title: 'Fly', text: 'Launch from the grid. Our model flies each drone to its marks.' },
      { icon: 'chart', title: 'Review', text: 'Compare the flown show with the plan and tune the next one.' },
    ],
  },
  // sign-off
  bbd: {
    title: 'What BBD is building.',
    text: 'A show suite for producers, venues and cities in the United States.',
    items: [
      'Show design on one timeline',
      'Full-show simulation with spacing and battery checks',
      'Our model, specialized for holding formation in wind',
      'Support for low-cost show drones',
    ],
    note: 'In development. Talk to us about early show partners.',
  },
  related: ['models', 'wam', 'why-now'],
  cta: {
    title: 'Plan a show with us.',
    text: 'Producers, venues and cities: tell us about the night you have in mind.',
    primary: { label: 'Talk to us', href: '/contact#shows' },
    secondary: { label: 'Why now', href: '/why-now' },
  },
};
