/**
 * All home page copy lives here, so it can be edited without touching layout code.
 * Copy rules: headline up to 7 words, supporting line up to 20, one action per
 * section, numbers over adjectives, no dashes or arrows.
 */
import type { FieldScene } from '../scripts/field';

export const hero = {
  then: {
    headline: 'The last mile still runs on vans.',
    support: 'Every order rides a truck to the door, one stop at a time, through traffic.',
    hint: 'Scroll to fly it',
  },
  now: {
    headline: 'The last mile, flown.',
    support: 'Delivery drones flown by our world action model, trained for every environment they meet.',
    cta: 'Talk to us',
  },
  /** The scale beside the line. Each row is rewritten as the line passes it. */
  scale: [
    {
      then: { label: 'Who drives', value: 'A person' },
      now: { label: 'Who flies', value: 'Our model' },
    },
    {
      then: { label: 'The route', value: 'Roads, traffic' },
      now: { label: 'The route', value: 'Straight line' },
    },
    {
      then: { label: 'Trained for', value: 'One city' },
      now: { label: 'Trained for', value: 'Every sky' },
    },
    {
      then: { label: 'The vehicle', value: 'A van' },
      now: { label: 'The vehicle', value: 'Low-cost drone' },
    },
  ],
};

/** The scenes told over the live field, in order. */
export const scenes: {
  id: string;
  scene: FieldScene;
  eyebrow: string;
  headline: string;
  support: string;
  link: { label: string; href: string };
}[] = [
  {
    id: 'delivery',
    scene: 'delivery',
    eyebrow: 'Delivery',
    headline: 'To doors it has never seen.',
    support: 'Our drones fly the last mile from a local hub to the door: new houses, new streets, new weather.',
    link: { label: 'Explore delivery', href: '/delivery' },
  },
  {
    id: 'model',
    scene: 'wam',
    eyebrow: 'World action model',
    headline: 'One model, every environment.',
    support: 'Our software is a world action model. It predicts what happens next, then picks the move, in wind, rain and dark.',
    link: { label: 'How the model works', href: '/wam' },
  },
  {
    id: 'drako',
    scene: 'drako',
    eyebrow: 'Defense',
    headline: 'Drako: drones built for practice.',
    support: 'Low-cost, unarmed training drones and range simulation, so counter-drone crews can train on the real thing.',
    link: { label: 'Explore Drako', href: '/drako' },
  },
  {
    id: 'shows',
    scene: 'shows',
    eyebrow: 'Shows',
    headline: 'Choreography for the sky.',
    support: 'Software to design, simulate and fly drone light shows, with every drone held on its mark.',
    link: { label: 'Explore shows', href: '/shows' },
  },
  {
    id: 'models',
    scene: 'models',
    eyebrow: 'Specialized models',
    headline: 'One base model, four specialists.',
    support: 'Delivery, Drako, shows and test each tune the same base model, so every flight teaches all of them.',
    link: { label: 'How we specialize', href: '/models' },
  },
];

/** Words drawn inside the live field. */
export const fieldLabels = {
  hub: 'Hub',
  door: 'New address',
  wind: 'Wind',
  rain: 'Rain',
  night: 'Night',
  city: 'City',
  range: 'Training range',
  control: 'Range control',
  sim: 'Simulated twin',
  base: 'Base model',
  delivery: 'Delivery',
  drako: 'Drako',
  shows: 'Shows',
  test: 'Test',
};

/** The America section after the story. Facts cite sources by id from topics/sources.ts. */
export const america = {
  id: 'why-now',
  eyebrow: 'Why now',
  headline: 'America is behind in drones.',
  support: 'China leads on hardware. We plan to win on software: drive hardware costs toward zero and make the model the product.',
  facts: [
    { value: '96%+', label: 'of drone platforms detected in US airspace were DJI', source: 'a83' },
    { value: '1 million', label: 'drones the US Army plans to buy within two to three years', source: 'armyMillion' },
    { value: '33,615', label: 'drones in the record for most airborne at once, set in China', source: 'guinnessGroup' },
  ],
  pillars: [
    { title: 'Hardware toward zero', text: 'Simple, low-cost airframes. When hardware costs almost nothing, factory scale stops being the edge.' },
    { title: 'Win on software', text: 'The value moves to the model that flies the drone. That is where we compete.' },
    { title: 'Every flight is data', text: 'Delivery, training and show flights all improve one model.' },
  ],
  link: { label: 'Read why now', href: '/why-now' },
} as const;

export const roadmap = {
  id: 'roadmap',
  headline: 'Software first, then the sky.',
  support: 'We train in simulation today. Real flights in Palo Alto come next, then fleets.',
  stages: [
    { when: 'Now', name: 'Simulation', detail: 'The base model trains and flies in simulation, across many environments.' },
    { when: 'Next', name: 'First flights', detail: 'Our model on low-cost hardware, flying real routes in Palo Alto.' },
    { when: 'Later', name: 'Fleets', detail: 'Delivery, Drako and show fleets on one model, each one making it better.' },
  ],
};

export const closing = {
  id: 'talk',
  headline: 'Fly with us.',
  support: 'Delivery partners, training units, show producers and engineers: tell us what you need to fly.',
  cta: 'Talk to us',
  audiences: ['Based in Palo Alto, California', 'Delivery partners', 'Training and test ranges', 'Show producers', 'Engineers'],
};
