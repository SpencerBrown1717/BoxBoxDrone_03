/**
 * All home page copy lives here, so it can be edited without touching layout code.
 * Copy rules: headline up to 7 words, supporting line up to 25, one action per
 * section, numbers over adjectives, no dashes or arrows.
 */

export const hero = {
  then: {
    headline: 'Drones have been a hardware race.',
    support: 'Mostly built by one company in China. Each one needs a pilot, a mapped route and a calm, clear day.',
    hint: 'Scroll to drop the cost',
  },
  now: {
    headline: 'AI models for drones.',
    support: 'BBD builds the world action model that flies any drone, anywhere, in any weather, on hardware that costs next to nothing.',
    cta: 'Talk to us',
  },
  /** The scale beside the cost line. Each row is rewritten as the line passes it. */
  scale: [
    {
      then: { label: 'A pilot for every drone', value: '1 : 1' },
      now: { label: 'One model, every drone', value: '1 : N' },
    },
    {
      then: { label: 'Mapped routes only', value: 'Pre-mapped' },
      now: { label: 'Places it has never seen', value: 'Unmapped' },
    },
    {
      then: { label: 'Calm, clear days', value: 'Fair weather' },
      now: { label: 'Wind, rain and night', value: 'All weather' },
    },
    {
      then: { label: 'Win on hardware', value: '$ per airframe' },
      now: { label: 'Hardware near zero', value: 'Software wins' },
    },
  ],
};

export const sky = {
  id: 'sky',
  headline: 'Now look up.',
  support: 'One model flies the whole fleet: delivery drones, Drako targets and show swarms, in every environment.',
};

// sign-off
export const model = {
  id: 'model',
  headline: 'One model. Every world.',
  support:
    'A world action model imagines what happens next for each possible move, then flies the best one. Pick a world and watch it plan.',
  specs: [
    { term: 'Model', value: 'World action model' },
    { term: 'Sees with', value: 'Cameras and motion sensors' },
    { term: 'Runs on', value: 'The drone itself' },
    { term: 'Trained for', value: 'City to snowfield, day and night' },
    { term: 'Weather', value: 'Calm, wind and rain' },
    { term: 'Specialists', value: 'Delivery, Drako, shows' },
  ],
  demo: {
    label: 'Pick a world',
    note: 'An illustration of how the model plans, not live flight data.',
    worlds: [
      { id: 'city', label: 'City' },
      { id: 'suburb', label: 'Suburb' },
      { id: 'coast', label: 'Coast' },
      { id: 'mountain', label: 'Mountains' },
      { id: 'snow', label: 'Snow' },
    ],
    conditions: [
      { id: 'wind', label: 'Wind' },
      { id: 'rain', label: 'Rain' },
      { id: 'night', label: 'Night' },
    ],
    description:
      'An illustrated flight. The drone flies from the hub to the door. Faint lines are the moves the model imagines; the bright line is the move it flies.',
  },
  cta: { label: 'See the model', href: '/models' },
};

export const missions = [
  {
    id: 'delivery',
    scene: 'delivery',
    beats: ['delivery', 'weather'],
    eyebrow: 'Delivery',
    headline: 'The last mile, by air.',
    support: 'Our model flies the final stretch to doors it has never seen, in wind, rain and the dark.',
    link: { label: 'Explore delivery', href: '/delivery' },
  },
  {
    id: 'drako',
    scene: 'drako',
    eyebrow: 'Drako Drones',
    headline: 'Built to be shot down.',
    support: 'Unarmed, low-cost target drones that fly like real threats, in swarms, so crews can practice taking them out of the sky.',
    link: { label: 'Explore Drako', href: '/drako' },
  },
  {
    id: 'shows',
    scene: 'shows',
    eyebrow: 'Drone shows',
    headline: 'Shows that fly themselves.',
    support: 'Design, simulate and fly light shows with a model built to hold tight formation in real wind.',
    link: { label: 'Explore shows', href: '/shows' },
  },
  {
    id: 'fleet',
    scene: 'fleet',
    eyebrow: 'The flywheel',
    headline: 'Every flight makes it smarter.',
    support: 'Deliveries, Drako passes and shows all train one model. More drones in the air means a better fleet.',
    link: { label: 'How the model learns', href: '/models#how-it-works' },
  },
] as const;

/** Labels drawn in the sky. */
export const skyLabels = {
  hub: 'Hub',
  door: 'Doorstep',
  weather: 'Wind and rain',
  lane: 'Training lane',
  hit: 'Hit',
  formation: 'Show formation',
  spares: 'Spares',
  model: 'BBD model',
};

// sign-off
export const roadmap = {
  id: 'roadmap',
  headline: 'Building America’s drone software.',
  support: 'We start with autonomy. Missions and the fleet come next, built in Palo Alto.',
  stages: [
    { when: 'Now', name: 'Autonomy', detail: 'The BBD model’s first flights, trained across every environment.' },
    { when: 'Next', name: 'Missions', detail: 'Drako targets for training ranges, and delivery routes with local partners.' },
    { when: 'Later', name: 'Every drone', detail: 'The show suite, and the BBD model on any airframe.' },
  ],
};

export const gap = {
  id: 'gap',
  eyebrow: 'Why America',
  headline: 'America fell behind in drones.',
  support: 'We think software is how it wins them back.',
  facts: [
    { value: '70 to 80%', label: 'of the world’s civilian drone market belongs to one Chinese company' },
    { value: '40×', label: 'more drones built in Ukraine each year than military drones in the US' },
    { value: '33,615', label: 'drones in the largest drone show on record, flown in China' },
  ],
  link: { label: 'See the numbers and sources', href: '/why-america' },
};

// sign-off
export const closing = {
  id: 'talk',
  headline: 'Build the future of flight with us.',
  support: 'Drako targets, delivery routes, shows and partnerships. Tell us what you need to fly.',
  cta: 'Talk to us',
  credentials: ['Based in Palo Alto, California', 'AI models for drones'],
};
