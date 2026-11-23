import type { Topic } from './types';
import { talk } from './shared';

/* ------------------------------------------------------------------ */
/* The world action model                                             */
/* ------------------------------------------------------------------ */

export const models: Topic = {
  slug: 'models',
  section: 'technology',
  card: { title: 'World action model', text: 'One model that flies any drone, trained for every environment and specialized by mission.', icon: 'brain' },
  meta: {
    title: 'World Action Model for Drones | BoxBox Drone',
    description:
      'BBD is building a world action model for drones: it predicts what happens next and flies the move that gets the job done. Trained for every environment, specialized for delivery, Drako and shows.',
  },
  hero: {
    kicker: 'World action model',
    title: 'One model. Every world.',
    lead: 'A world action model predicts how the world will respond to each move, then flies the move that gets the job done. Ours is trained for every environment and specialized for each mission.',
    visual: { scene: 'wam' },
    caption:
      'An illustration of a world action model: camera frames go in, the model imagines several possible next moves, and the drone flies the one with the best predicted outcome.',
    actions: { primary: talk('models', 'Fly our model'), secondary: { label: 'How it’s specialized', href: '#specialists' } },
  },
  need: {
    title: 'The best drone models still live in simulators.',
    intro:
      'World action models for drones first appeared in research papers in 2026. They are promising, and most of their testing so far has been in simulation.',
    stats: [
      { value: '79%', label: 'WorldVLN’s success rate in a flight simulator, against 66% for the best earlier model', sources: ['worldvln'] },
      { value: 'Sim only', label: 'Where DroneWAM was tested. Its authors say it isn’t yet ready for real-world use', sources: ['dronewam'] },
      { value: 'Off board', label: 'Where WorldVLN ran in its real-drone test: on a remote server, not on the drone', sources: ['worldvln'] },
    ],
  },
  // sign-off
  specialists: {
    id: 'specialists',
    title: 'One base model, three specialists.',
    intro: 'We pre-train one model on flight in every environment, then post-train a specialist for each mission. Each one learns from its own flights.',
    items: [
      {
        name: 'BBD Delivery',
        mission: 'Delivery',
        href: '/delivery',
        does: 'Finds the door at an address it has never seen, lowers the box gently and keeps clear of people, pets and power lines.',
        learns: 'Every approach and every drop',
      },
      {
        name: 'BBD Drako',
        mission: 'Drako Drones',
        href: '/drako',
        does: 'Flies like a threat: fast, low and hard to predict, alone or in a swarm, and lands safely when it has to.',
        learns: 'Every scored pass on the range',
      },
      {
        name: 'BBD Shows',
        mission: 'Drone shows',
        href: '/shows',
        does: 'Holds tight formation in gusts, keeps spacing across the whole swarm and brings in spares when a drone drops out.',
        learns: 'Every show and every gust',
      },
    ],
  },
  why: {
    title: 'Why a world action model.',
    intro: 'A world action model learns how the world changes when the drone acts, so it can look ahead before it commits.',
    points: [
      {
        icon: 'eye',
        title: 'It looks ahead',
        text: 'Instead of reacting frame by frame, it predicts the next few moments for each candidate move and picks the one that reaches the goal.',
        sources: ['worldvln'],
      },
      {
        icon: 'layers',
        title: 'It learns from video',
        text: 'Training it to predict what the camera will see next gives it a dense signal to learn from, not just the actions.',
        sources: ['aeroact'],
      },
      {
        icon: 'route',
        title: 'It transfers',
        text: 'WorldVLN was trained only in simulation and still followed plain-language instructions on a real drone, with no extra training.',
        sources: ['worldvln'],
      },
    ],
  },
  // sign-off
  compare: {
    id: 'plan',
    title: 'How we plan to beat the field.',
    intro: 'Research models prove the idea. We are building the version that flies for a living.',
    columns: ['Research models today', 'The BBD model'],
    rows: [
      { label: 'Trained on', field: 'Mostly simulation', bbd: 'Simulation and real flights from our own fleet' },
      { label: 'Runs on', field: 'Lab computers, sometimes off the drone', bbd: 'The drone itself, with no link required' },
      { label: 'Tested in', field: 'Benchmark scenes', bbd: 'Cities to snowfields, day and night, wind and rain' },
      { label: 'Built for', field: 'Navigation tasks', bbd: 'Delivery, Drako targets and drone shows' },
      { label: 'Flies on', field: 'Research quadrotors', bbd: 'Low-cost aircraft built to scale' },
    ],
  },
  // sign-off
  how: {
    title: 'How the BBD model learns',
    intro: 'Pre-train broad, specialize narrow, and learn from every flight.',
    steps: [
      {
        icon: 'globe',
        title: 'Pre-train everywhere',
        text: 'Simulated and real flight across cities, suburbs, farms, coasts, mountains, deserts and snow, by day and night, in calm air, wind and rain.',
      },
      { icon: 'eye', title: 'Predict', text: 'At each moment, the model imagines what happens next under several candidate moves.' },
      { icon: 'drone', title: 'Act', text: 'It flies the move with the best predicted outcome, on the drone itself.' },
      { icon: 'target', title: 'Specialize', text: 'A post-training run turns the base model into a specialist for delivery, Drako or shows.' },
      { icon: 'layers', title: 'Learn', text: 'Every flight across the fleet goes back into training.' },
    ],
  },
  stage: {
    title: 'Where the field stands',
    level: 0,
    text: 'World action models for drones are new. The first papers appeared in 2026, mostly tested in simulators, with a few short real-world flights.',
    milestones: [
      { year: '2023', text: 'Swift, a reinforcement learning system, beats human champions at drone racing.', sources: ['swift'] },
      {
        year: '2026',
        text: 'WorldVLN, from Tsinghua University and partners, is published as the first autoregressive world action model for aerial navigation.',
        sources: ['worldvln'],
      },
      { year: '2026', text: 'AeroAct reports a world action model demonstrated in real quadrotor flight.', sources: ['aeroact'] },
      { year: '2026', text: 'DroneWAM, from a group of Chinese universities, is tested in simulation.', sources: ['dronewam'] },
    ],
  },
  // sign-off
  bbd: {
    title: 'What BBD is building.',
    text: 'A world action model that flies any drone: trained for every environment, specialized by mission, and small enough to run on the aircraft.',
    items: [
      'Pre-trained on simulated and real flight across every kind of terrain and weather',
      'Runs on the drone, so it keeps flying without a link to a server',
      'Specialists for delivery, Drako targets and drone shows',
      'Real flight data from our own fleet, not just simulators',
      'Designed and trained in Palo Alto',
    ],
    note: 'The BBD model is in development. We’ll publish results as flight testing produces them.',
  },
  related: ['hardware', 'why-america'],
  cta: {
    title: 'Fly our model on your drones.',
    text: 'Airframe makers, operators and research labs: talk to us about early access.',
    primary: talk('models'),
    secondary: { label: 'Hardware near zero', href: '/hardware' },
  },
};

/* ------------------------------------------------------------------ */
/* Hardware near zero                                                 */
/* ------------------------------------------------------------------ */

export const hardware: Topic = {
  slug: 'hardware',
  section: 'technology',
  card: { title: 'Hardware near zero', text: 'Simple, low-cost aircraft, so the value lives in the model.', icon: 'chip' },
  meta: {
    title: 'Low-Cost Drone Hardware | BoxBox Drone',
    description:
      'BBD keeps its aircraft simple and cheap and puts the intelligence in the model. Why cheap hardware and great software win the drone race.',
  },
  hero: {
    kicker: 'Hardware',
    title: 'Hardware near zero.',
    lead: 'We keep our aircraft simple and cheap, and put the intelligence in the model. Every dollar out of the airframe buys more drones, more flights and more data.',
    visual: { scene: 'hardware' },
    caption:
      'An exploded view of a small quadcopter: a simple frame, four motors and propellers, a battery, a camera and a low-cost computer that runs the BBD model.',
    actions: { primary: talk('hardware'), secondary: { label: 'Why software wins', href: '#why-title' } },
  },
  need: {
    title: 'Drones are getting cheap. Fast.',
    intro: 'Mass production in Ukraine has pushed small drones down to a few hundred dollars, and the Pentagon now buys them on price.',
    stats: [
      { value: '$400', label: 'Low end of what a frontline FPV drone costs to build in Ukraine', sources: ['fpvCost'] },
      { value: '$5,000 to $2,000', label: 'What the Pentagon pays per small drone today, and its target', sources: ['bd30k'] },
      { value: '340,000', label: 'Small drones the Pentagon plans to buy over two years', sources: ['twzDdp'] },
    ],
  },
  why: {
    title: 'When hardware is cheap, software decides.',
    intro:
      'If any factory can build the airframe, the advantage moves to how well it flies. Cheap aircraft also mean more of them in the air, and more flights to learn from.',
    chart: {
      kind: 'bars',
      title: 'Small drones $1 million buys, at each price',
      caption: '$1 million divided by each unit price: arithmetic on the cited prices.',
      unit: 'drones',
      rows: [
        { label: 'At $400, a Ukrainian FPV build', value: 2500, display: '2,500', tone: 'signal' },
        { label: 'At $2,000, the Pentagon’s target price', value: 500, display: '500', tone: 'highlight' },
        { label: 'At $5,000, the Pentagon’s price today', value: 200, display: '200', tone: 'other' },
      ],
      sources: ['fpvCost', 'bd30k'],
    },
    points: [
      {
        icon: 'factory',
        title: 'Volume beats margin',
        text: 'The Pentagon plans to cut its price per drone from $5,000 to $2,300 as each round’s order grows from 30,000 drones to 150,000.',
        sources: ['armyDdp'],
      },
      {
        icon: 'shield',
        title: 'Trusted parts matter',
        text: 'New FCC rules bar new foreign-made drones and critical components from US approval, with exceptions for trusted suppliers.',
        sources: ['fccCovered', 'fccJuly'],
      },
      {
        icon: 'brain',
        title: 'Software scales for free',
        text: 'A better model upgrades every drone in the fleet at once. Better hardware has to be bought one aircraft at a time.',
      },
    ],
  },
  // sign-off
  how: {
    title: 'What’s in a BBD aircraft',
    intro: 'Only what the model needs to fly the mission.',
    sequence: false,
    steps: [
      { icon: 'drone', title: 'A simple frame', text: 'Few parts, quick to build and quick to repair.' },
      { icon: 'spin', title: 'Commodity motors', text: 'Standard motors and propellers, made in volume.' },
      { icon: 'eye', title: 'Cameras and motion sensors', text: 'What the model sees and feels. No exotic payloads.' },
      { icon: 'chip', title: 'Low-cost compute', text: 'A small onboard computer sized to run the BBD model.' },
      { icon: 'battery', title: 'Swappable battery', text: 'Swapped between flights, so the aircraft keeps working.' },
      { icon: 'layers', title: 'Over-the-air updates', text: 'The model improves without anyone touching the aircraft.' },
    ],
  },
  // sign-off
  bbd: {
    title: 'How BBD keeps hardware cheap.',
    text: 'We design for cost from the first part, and spend the savings on flight time and data.',
    items: [
      'One airframe family across delivery, Drako and shows',
      'Few parts, simple frames, fast repairs',
      'Low-cost onboard compute sized for our model',
      'Supply chains checked against US rules for drone components',
    ],
    note: 'BBD aircraft are in development.',
  },
  related: ['models', 'drako', 'why-america'],
  cta: {
    title: 'Build with us.',
    text: 'Airframe makers, suppliers and fleet operators: help us drive the cost of flight toward zero.',
    primary: talk('hardware'),
    secondary: { label: 'See the model', href: '/models' },
  },
};
