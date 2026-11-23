import type { Topic } from './types';

export const wam: Topic = {
  slug: 'wam',
  section: 'technology',
  card: {
    title: 'World action model',
    text: 'One model that predicts what happens next, then picks the move.',
    icon: 'model',
  },
  meta: {
    title: 'Our world action model | BBD',
    description:
      'BBD’s world action model learns how the world responds to a drone’s actions, so one model can fly delivery, training drones and shows in every environment.',
  },
  hero: {
    kicker: 'Technology',
    title: 'One model for every sky.',
    // sign-off
    lead: 'Our software is a world action model. It learns how the world responds to what a drone does, predicts what happens next, and chooses the move. We train it for wind, rain, night and places it has never seen.',
    visual: { scene: 'wam' },
    caption: 'A drawing of a drone path crossing wind, rain, night and city blocks, with the model’s predicted path drawn ahead of it.',
    actions: {
      primary: { label: 'Talk to the team', href: '/contact#engineering' },
      secondary: { label: 'How we specialize it', href: '/models' },
    },
  },
  need: {
    title: 'AI can fly. Not yet everywhere.',
    intro: 'Learned flight already beats people on a known course. Reliability in the open world is the unsolved part.',
    stats: [
      { value: '2023', label: 'the year a learned controller first beat human champion pilots in drone racing', sources: ['swift'] },
      { value: '79.12%', label: 'average success for the best published aerial world action model, in simulation', sources: ['worldvln'] },
      { value: '5 to 4', label: 'a human world champion beat the fastest AI drone in a 2026 best-of-nine final', sources: ['a2rl'] },
    ],
  },
  why: {
    title: 'Why a world action model.',
    intro: 'A policy that only maps pictures to motor commands learns one job. A model of how the world responds can plan, adapt and carry what it learns to new jobs.',
    chart: {
      kind: 'bars',
      title: 'World action models already lead in simulation.',
      caption:
        'Average task success on the UAV-Flow-Sim aerial navigation benchmark, in simulation, with fixed-template instructions. The world action model is WorldVLN (2026); the comparison is the strongest earlier model in the same test.',
      unit: '%',
      rows: [
        { label: 'World action model', value: 79.12, display: '79.12%', tone: 'highlight' },
        { label: 'Strongest earlier model', value: 65.61, display: '65.61%', tone: 'classical' },
      ],
      sources: ['worldvln'],
    },
    points: [
      // sign-off
      {
        icon: 'spark',
        title: 'It predicts, then acts',
        text: 'The model imagines the next moments of flight before it commits to a move, and corrects as the real world answers.',
      },
      {
        icon: 'layers',
        title: 'Every environment',
        text: 'Training mixes wind, rain, night, cities and open fields, so no environment is a surprise.',
      },
      {
        icon: 'drone',
        title: 'Any low-cost airframe',
        text: 'The intelligence lives in the model, not the airframe, so the hardware can stay simple and cheap.',
      },
    ],
  },
  how: {
    title: 'How it learns.',
    intro: 'Simulation teaches the basics fast. Real flights settle the details.',
    steps: [
      { icon: 'sim', title: 'Simulate', text: 'Train across many generated environments: streets, fields, weather and light.' },
      { icon: 'model', title: 'Predict', text: 'Learn how the world changes after each action, and use that to plan.' },
      { icon: 'drone', title: 'Fly', text: 'Run on onboard hardware with a camera and inertial sensors.' },
      { icon: 'route', title: 'Improve', text: 'Fold every real flight back into training, so the model keeps getting better.' },
    ],
  },
  stage: {
    title: 'Where we are.',
    level: 0,
    text: 'Our model trains and flies in simulation today. First real flights come next, in Palo Alto.',
    milestones: [
      { year: '2023', text: 'A learned controller beats human champions on a known racing course.', sources: ['swift'] },
      { year: '2026', text: 'A world action model leads aerial navigation benchmarks in simulation.', sources: ['worldvln'] },
      { year: '2026', text: 'A human champion still edges the fastest AI drone, after the AI makes a mistake.', sources: ['a2rl'] },
    ],
  },
  // sign-off
  bbd: {
    title: 'What BBD is building.',
    text: 'One base model for every BBD drone, with a specialist for each job.',
    items: [
      'A world action model trained in simulation across many environments',
      'Onboard flight on a camera and inertial sensors',
      'A training loop that learns from every real flight',
      'Specialists for delivery, Drako, shows and test',
    ],
    note: 'Simulation first. Real flights settle it.',
  },
  related: ['models', 'delivery', 'why-now'],
  cta: {
    title: 'Build the model with us.',
    text: 'Researchers and engineers who want autonomy to work everywhere: talk to us about joining the team in Palo Alto.',
    primary: { label: 'Talk to us', href: '/contact#engineering' },
    secondary: { label: 'Specialized models', href: '/models' },
  },
};
