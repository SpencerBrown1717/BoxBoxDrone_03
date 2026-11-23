import type { Topic } from './types';
import { talk } from './shared';

export const whyAmerica: Topic = {
  slug: 'why-america',
  section: 'company',
  card: { title: 'Why America', text: 'The US fell behind China in drones. Software is how it catches up.', icon: 'flag' },
  meta: {
    title: 'America’s Drone Gap | BoxBox Drone',
    description:
      'One Chinese company makes most of the world’s civilian drones, and Ukraine builds forty times more drones a year than the US builds military drones. Why BBD thinks software is how America catches up.',
  },
  hero: {
    kicker: 'Why America',
    title: 'America fell behind in drones.',
    lead: 'One Chinese company makes most of the world’s civilian drones, and Ukraine builds forty times more drones a year than the United States builds military drones. We think America wins this back with software, on hardware that costs next to nothing.',
    visual: { scene: 'gap' },
    caption:
      'An illustration of the gap: a large field of dots for the drones Ukraine builds in a year, beside a small cluster for the military drones the United States builds.',
    actions: { primary: talk('america'), secondary: { label: 'See the numbers', href: '#need-title' } },
  },
  need: {
    title: 'The gap, in numbers.',
    intro: 'Most of the world’s drones are built somewhere else, and the gap is widest where it matters most.',
    stats: [
      { value: '70 to 80%', label: 'DJI’s estimated share of the world’s civilian drone market', sources: ['droneGirl'] },
      {
        value: '40×',
        label: 'How many more drones Ukraine builds a year than the US builds military drones: about 4 million against 100,000',
        sources: ['bloombergUa'],
      },
      {
        value: 'First',
        label: 'Time the FCC put a whole product category on its Covered List: new foreign-made drones and their critical parts, in December 2025',
        sources: ['wsgrFcc'],
      },
    ],
  },
  why: {
    title: 'Why software is how America wins.',
    intro: 'China won the hardware race by building more drones, cheaper. The next race is autonomy: whose model flies the most drones, best.',
    chart: {
      kind: 'bars',
      title: 'Drones built in a year',
      caption: 'Ukraine’s drones of all types against US military drones, as Bloomberg reported in November 2025.',
      unit: 'drones a year',
      rows: [
        { label: 'Ukraine', value: 4000000, display: 'About 4 million', tone: 'other' },
        { label: 'United States, military drones', value: 100000, display: 'About 100,000', tone: 'highlight' },
      ],
      sources: ['bloombergUa'],
    },
    points: [
      {
        icon: 'brain',
        title: 'The newest drone AI is coming out of China',
        text: 'Two of the first world action models for drones, WorldVLN and DroneWAM, came from university labs in China.',
        sources: ['worldvln', 'dronewam'],
      },
      {
        icon: 'factory',
        title: 'Hardware is becoming a commodity',
        text: 'The Pentagon is buying small drones by the hundred thousand, and pushing the price per drone down with every round.',
        sources: ['twzDdp', 'armyDdp'],
      },
      {
        icon: 'flag',
        title: 'The rules now favor US builders',
        text: 'New FCC rules bar new foreign-made drones and critical components from US approval, with exceptions for trusted suppliers.',
        sources: ['fccCovered', 'fccJuly'],
      },
    ],
  },
  // sign-off
  how: {
    title: 'How BBD closes the gap',
    intro: 'Four moves that build on each other.',
    steps: [
      { icon: 'chip', title: 'Cheap aircraft', text: 'Drive the cost of the airframe toward zero.' },
      { icon: 'brain', title: 'One model', text: 'A world action model that flies any airframe, anywhere.' },
      { icon: 'target', title: 'Many missions', text: 'Delivery, Drako and shows put more drones in the air.' },
      { icon: 'layers', title: 'More data', text: 'Every flight trains the model, so the fleet gets better as it grows.' },
    ],
  },
  stage: {
    title: 'How Washington is responding',
    text: 'Since 2025 the US has moved to buy more small drones, build them at home and open the airspace to routine flight.',
    milestones: [
      {
        year: '2025',
        text: 'Executive Order 14307 makes American leadership in drones national policy and pushes routine flights beyond visual line of sight.',
        sources: ['eo14307'],
      },
      { year: '2025', text: 'The Pentagon launches a $1 billion program to buy about 340,000 small drones over two years.', sources: ['twzDdp'] },
      { year: '2025', text: 'The FCC adds new foreign-made drones and critical components to its Covered List.', sources: ['fccCovered'] },
      { year: '2026', text: 'The FAA sends its final rule for routine flights beyond visual line of sight to the White House.', sources: ['part108Review'] },
      { year: '2026', text: 'The Army awards counter-drone contracts with a $4.15 billion ceiling.', sources: ['armyCuas'] },
    ],
  },
  // sign-off
  bbd: {
    title: 'Where BBD fits.',
    text: 'An American company building the software layer: AI models for drones, designed and trained in Palo Alto.',
    items: [
      'A world action model that flies any airframe',
      'Hardware kept near zero cost',
      'Three markets on one model: delivery, Drako and shows',
      'Designed and trained in Palo Alto, California',
    ],
  },
  related: ['models', 'hardware', 'drako'],
  cta: {
    title: 'Help America win the sky.',
    text: 'Investors, partners, agencies and engineers: talk to us.',
    primary: talk('america'),
    secondary: { label: 'About BBD', href: '/company' },
  },
};
