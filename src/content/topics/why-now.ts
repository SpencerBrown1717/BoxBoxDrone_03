import type { Topic } from './types';

export const whyNow: Topic = {
  slug: 'why-now',
  section: 'company',
  card: {
    title: 'Why now',
    text: 'America is behind China in drones. We plan to win on software.',
    icon: 'tag',
  },
  meta: {
    title: 'Why now: America and the drone race | BBD',
    description: 'China leads the drone market. BBD’s plan: drive hardware costs toward zero and win on software, from Palo Alto, California.',
  },
  hero: {
    kicker: 'Why now',
    title: 'America is behind in drones.',
    lead: 'One Chinese company makes almost every drone flying over the United States. We think the way back is software: make the hardware nearly free, and make the intelligence the product.',
    visual: { scene: 'america' },
    caption: 'A drawing of two curves: the cost of drone hardware falling toward zero while the value of the software rises.',
    actions: {
      primary: { label: 'Talk to us', href: '/contact' },
      secondary: { label: 'Our model', href: '/wam' },
    },
  },
  need: {
    title: 'The gap, in numbers.',
    intro: 'The market runs on Chinese hardware, and US demand for drones is about to grow fast.',
    stats: [
      { value: '96%+', label: 'of drone platforms detected in US airspace were DJI, in FAA-funded research', sources: ['a83'] },
      { value: '70%+', label: 'of the global consumer drone market is DJI’s, by industry estimates', sources: ['ckgsb'] },
      { value: '1 million', label: 'drones the US Army plans to buy within two to three years', sources: ['armyMillion'] },
    ],
  },
  why: {
    title: 'How we win.',
    intro: 'China wins on hardware scale. We won’t out-build it on airframes. We plan to beat it on software.',
    chart: {
      kind: 'segments',
      title: 'Who flies over America.',
      caption:
        'Share of drone platforms detected in US airspace, in FAA-funded research reported in March 2026. DJI was more than 96% and Skydio slightly more than 1%, so the rest is under 3%. Shares are rounded.',
      unit: '%',
      total: '100%',
      parts: [
        { label: 'DJI', value: 96, display: 'More than 96%', tone: 'highlight' },
        { label: 'Skydio', value: 1, display: 'About 1%', tone: 'classical' },
        { label: 'Everyone else', value: 3, display: 'Under 3%', tone: 'context' },
      ],
      sources: ['a83'],
    },
    points: [
      {
        icon: 'tag',
        title: 'Hardware toward zero',
        text: 'Simple, low-cost airframes. When the hardware costs almost nothing, factory scale stops being the edge.',
      },
      {
        icon: 'model',
        title: 'Win on software',
        text: 'The value moves to the model that flies the drone. That is where we compete.',
      },
      {
        icon: 'flag',
        title: 'Policy is moving',
        text: 'Washington is backing US drones: an executive order in June 2025, then new limits on foreign-made drones in December 2025.',
        sources: ['eo14307', 'fccCoveredList'],
      },
    ],
  },
  how: {
    title: 'The plan.',
    intro: 'Software first, from Palo Alto.',
    steps: [
      { icon: 'sim', title: 'Train in simulation', text: 'Build the base model on simulated environments, fast and cheap.' },
      { icon: 'drone', title: 'Fly low-cost hardware', text: 'Put the model on simple airframes and fly in the real world.' },
      { icon: 'layers', title: 'Specialize', text: 'Tune the base model for delivery, Drako, shows and test.' },
      { icon: 'chart', title: 'Scale', text: 'Each new fleet adds flight data, and the model improves for every customer.' },
    ],
  },
  // sign-off
  bbd: {
    title: 'What BBD is building.',
    text: 'AI models for drones, designed in Palo Alto, California.',
    items: [
      'A world action model for every environment',
      'Specialists for delivery, Drako, shows and test',
      'Low-cost hardware to fly them',
      'Software designed and built in Palo Alto',
    ],
  },
  related: ['wam', 'models', 'delivery'],
  cta: {
    title: 'Help America lead in drones.',
    text: 'Partners, investors and engineers: let’s talk.',
    primary: { label: 'Talk to us', href: '/contact' },
    secondary: { label: 'Our model', href: '/wam' },
  },
};
