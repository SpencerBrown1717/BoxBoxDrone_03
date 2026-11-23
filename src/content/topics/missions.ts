import type { Topic } from './types';
import { talk } from './shared';

/* ------------------------------------------------------------------ */
/* Delivery                                                           */
/* ------------------------------------------------------------------ */

export const delivery: Topic = {
  slug: 'delivery',
  section: 'missions',
  card: { title: 'Delivery', text: 'The last mile by air, to doors the model has never seen.', icon: 'package' },
  meta: {
    title: 'Last-Mile Drone Delivery | BoxBox Drone',
    description:
      'BBD builds the flight model for last-mile drone delivery: doorsteps it has never seen, in wind, rain and the dark. Based in Palo Alto.',
  },
  hero: {
    kicker: 'Delivery',
    title: 'The last mile, by air.',
    lead: 'Our model flies the hardest part of delivery: the final stretch to a door it has never seen, in wind, rain and the dark.',
    visual: { band: ['delivery', 'weather'] },
    caption:
      'An illustration of drone delivery: drones fly from a hub to the doorsteps of houses along the horizon, and keep flying as wind and rain move in.',
    actions: { primary: talk('delivery', 'Bring delivery to your town'), secondary: { label: 'How it works', href: '#how-it-works' } },
  },
  need: {
    title: 'Drone delivery is real. It still wants maps and good weather.',
    intro:
      'Deliveries by drone now number in the millions in the US and China. Every new street, storm and night flight is still a hard problem.',
    stats: [
      { value: '2M+', label: 'Commercial deliveries flown by Zipline by January 2026', sources: ['ziplineTwoMillion'] },
      { value: '1M+', label: 'Drone delivery orders completed by Meituan in China by June 2026', sources: ['meituanMillion'] },
      { value: '3 min', label: 'Zipline’s median flight time', sources: ['robotReport'] },
    ],
  },
  why: {
    title: 'Why the last mile needs a world model.',
    intro:
      'Most delivery systems fly mapped corridors inside careful weather limits. A world action model plans from what the drone sees right now.',
    points: [
      {
        icon: 'house',
        title: 'Every doorstep is new',
        text: 'New homes, fences, trees and patio furniture appear all the time. A model that predicts the scene can find a safe drop where a map is out of date.',
      },
      {
        icon: 'rain',
        title: 'Weather is the job',
        text: 'Meituan says its drone orders rose especially after it began flying at night and in the rain.',
        sources: ['yicaiNightRain'],
      },
      {
        icon: 'route',
        title: 'The rules are opening up',
        text: 'The FAA’s Part 108 rule for routine flights beyond visual line of sight is in final review at the White House.',
        sources: ['part108Review'],
      },
    ],
  },
  // sign-off
  how: {
    title: 'How a BBD delivery works',
    intro: 'Five steps, from the counter to the door and back.',
    steps: [
      { icon: 'message', title: 'Order', text: 'A store or restaurant books a drop for an order that fits the box.' },
      { icon: 'drone', title: 'Launch', text: 'A drone lifts off from a hub near the store with the order on board.' },
      { icon: 'route', title: 'Fly', text: 'The model plans the route from what the drone sees, and corrects for wind and rain as it goes.' },
      { icon: 'package', title: 'Drop', text: 'It lowers the box at the door, clear of people, pets and power lines.' },
      { icon: 'layers', title: 'Learn', text: 'The drone flies home, and the flight goes back into training.' },
    ],
  },
  stage: {
    title: 'Where it stands',
    level: 2,
    text: 'Drone delivery is in early commercial service in the US and China. In the US, routine flights beyond visual line of sight still need individual waivers until Part 108 is final.',
    milestones: [
      { year: '2021', text: 'Meituan makes its first drone deliveries to customers in Shenzhen.', sources: ['yicaiShanghai'] },
      { year: '2025', text: 'The FAA proposes Part 108, a rule for routine drone flights beyond visual line of sight.', sources: ['part108Proposed'] },
      { year: '2026', text: 'Zipline passes 2 million commercial deliveries.', sources: ['ziplineTwoMillion'] },
      { year: '2026', text: 'Meituan passes 1 million drone delivery orders.', sources: ['meituanMillion'] },
      { year: '2026', text: 'The final Part 108 rule goes to the White House for review.', sources: ['part108Review'] },
    ],
  },
  // sign-off
  bbd: {
    title: 'What BBD is building.',
    text: 'The flight model for the last mile, and small, low-cost aircraft to run it.',
    items: [
      'A delivery model that finds the door at addresses it has never seen',
      'Flight in wind, rain and at night, within the rules',
      'Small aircraft sized for food and everyday items',
      'First routes planned in Palo Alto',
    ],
    note: 'BBD delivery is in development. Routes open where the FAA allows them.',
  },
  related: ['models', 'hardware', 'why-america'],
  cta: {
    title: 'Bring drone delivery to your town.',
    text: 'Restaurants, stores and cities: tell us where you want to start.',
    primary: talk('delivery'),
    secondary: { label: 'See the model', href: '/models' },
  },
};

/* ------------------------------------------------------------------ */
/* Drako Drones                                                       */
/* ------------------------------------------------------------------ */

export const drako: Topic = {
  slug: 'drako',
  section: 'missions',
  card: { title: 'Drako Drones', text: 'Unarmed, low-cost target drones that fly like real threats, for counter-drone training and testing.', icon: 'target' },
  meta: {
    title: 'Drako Drones: Low-Cost Target Drones for Counter-Drone Training | BoxBox Drone',
    description:
      'Drako is BBD’s training and testing program for counter-drone teams: threat simulations and unarmed, low-cost target drones that fly like real threats, in swarms, so crews can practice shooting them down.',
  },
  // sign-off
  hero: {
    kicker: 'Drako Drones',
    title: 'Built to be shot down.',
    lead: 'Drako is our training and testing program for counter-drone teams: unarmed, low-cost target drones that fly like the real threat, in swarms, so crews can practice taking them out of the sky.',
    visual: { band: ['drako'] },
    caption: 'An illustration of a Drako training lane: waves of target drones cross the range, and hits are marked as they fall.',
    actions: { primary: talk('drako', 'Request Drako targets'), secondary: { label: 'See the cost gap', href: '#why-title' } },
  },
  need: {
    title: 'The threat is cheap. Practice has to be cheaper.',
    intro: 'Small drones are now part of every fight. Crews need realistic targets they can shoot down again and again.',
    stats: [
      { value: '$2M', label: 'Cost of the missiles the Pentagon says it can’t afford to fire at cheap drones', sources: ['armyDdp'] },
      { value: '$4.15B', label: 'Ceiling of the counter-drone contracts the Army awarded to 10 companies in September 2026', sources: ['armyCuas'] },
      { value: '90+ mph', label: 'Speed of the drones Marines now train against in their first counter-drone lanes', sources: ['marinesLanes'] },
    ],
  },
  why: {
    title: 'Fly like the threat. Cost like a target.',
    intro:
      'A good target behaves like the real thing and costs less than the round that stops it. The cheapest threats cost hundreds of dollars. Some of the answers cost millions.',
    chart: {
      kind: 'ladder',
      title: 'What a threat costs, and what it costs to stop one',
      caption: 'Price per unit on a log scale. Small attack drones cost hundreds to a few thousand dollars; an interceptor missile costs about $2 million.',
      axis: 'US dollars per unit',
      from: 2,
      to: 7,
      unit: '$',
      rows: [
        { label: 'FPV drone built in Ukraine', value: 400, display: '$400 to $700', tone: 'highlight' },
        { label: 'Pentagon’s target price per small drone', value: 2000, display: '$2,000', tone: 'signal' },
        { label: 'Pentagon’s price per small drone, first round', value: 5000, display: '$5,000', tone: 'highlight' },
        { label: 'Interceptor missile', value: 2000000, display: 'About $2 million', tone: 'other' },
      ],
      sources: ['fpvCost', 'bd30k', 'armyDdp'],
    },
    points: [
      {
        icon: 'target',
        title: 'Training is ramping up',
        text: 'The Marine Corps opened its first counter-drone training lanes in July 2026, and Army units ran anti-drone ranges near Fort Bragg in May.',
        sources: ['marinesLanes', 'braggRange'],
      },
      {
        icon: 'package',
        title: 'Targets have to be expendable',
        text: 'An Army solicitation asks for low-cost targeting drones that are easy to replace and can be lost again and again in training.',
        sources: ['targetSolicitation'],
      },
      {
        icon: 'swarm',
        title: 'The old targets aren’t swarms',
        text: 'Air defense units have trained for years against fixed-wing target drones like the Outlaw, a stand-in for incoming aircraft and missiles.',
        sources: ['outlaw'],
      },
    ],
  },
  // sign-off
  how: {
    title: 'How a Drako lane runs',
    intro: 'From a simulated threat to a scored engagement, then reset for the next crew.',
    steps: [
      { icon: 'map', title: 'Design the threat', text: 'Pick what to practice against: a fast dive, a slow loiter or a swarm wave. Rehearse it in simulation first.' },
      { icon: 'drone', title: 'Launch', text: 'Drako drones lift off from cases at the edge of the range.' },
      { icon: 'route', title: 'Fly the threat', text: 'The BBD model flies each target like the real thing: fast, low and hard to predict.' },
      { icon: 'chart', title: 'Score', text: 'Hits, misses and reaction times are logged for every pass.' },
      { icon: 'layers', title: 'Reset', text: 'Downed drones are swapped for new ones, and the rest fly back for the next crew.' },
    ],
  },
  stage: {
    title: 'Where it stands',
    level: 1,
    text: 'Counter-drone training is moving from classrooms to live ranges, and the services are asking for targets they can afford to lose.',
    milestones: [
      { year: '2025', text: 'The Pentagon stands up Joint Interagency Task Force 401 to lead counter-drone work.', sources: ['jiatf401'] },
      { year: '2026', text: 'Army and special operations units run anti-drone training and data collection near Fort Bragg.', sources: ['braggRange'] },
      { year: '2026', text: 'The Marine Corps opens its first counter-drone training lanes, with drones flying over 90 mph.', sources: ['marinesLanes'] },
      { year: '2026', text: 'The Army awards counter-drone contracts with a $4.15 billion ceiling.', sources: ['armyCuas'] },
    ],
  },
  // sign-off
  bbd: {
    title: 'What Drako is.',
    text: 'A program, not just a drone: threat simulations, low-cost target airframes, the BBD model that flies them like real threats, and range software that scores every engagement.',
    items: [
      'Unarmed target drones, built to be shot down and replaced cheaply',
      'Threat simulations to design and rehearse each lane before it flies',
      'Threat-realistic flight: dives, weaves, loiters and swarm waves',
      'One operator flies one target or a whole swarm',
      'Scoring and replay for every lane, for training crews and testing counter-drone systems',
    ],
    note: 'Drako is in development. We work with ranges and units under the rules that govern them.',
  },
  related: ['models', 'hardware', 'why-america'],
  cta: {
    title: 'Put Drako on your range.',
    text: 'Training units, ranges and counter-drone test teams: tell us what you need to train against.',
    primary: talk('drako', 'Request Drako targets'),
    secondary: { label: 'How the model flies', href: '/models' },
  },
};

/* ------------------------------------------------------------------ */
/* Drone shows                                                        */
/* ------------------------------------------------------------------ */

export const shows: Topic = {
  slug: 'shows',
  section: 'missions',
  card: { title: 'Drone shows', text: 'Design, simulate and fly light shows with a model built for formation flight.', icon: 'sparkle' },
  meta: {
    title: 'Drone Show Software | BoxBox Drone',
    description:
      'The BBD show suite: design a drone light show, simulate every path, and fly it with a model trained to hold formation in real wind.',
  },
  hero: {
    kicker: 'Drone shows',
    title: 'Shows that fly themselves.',
    lead: 'A software suite to design, simulate and fly drone light shows, with a model trained to hold tight formation in real wind.',
    visual: { band: ['shows'] },
    caption: 'An illustration of a drone show: drones rise from a launch grid and form a tall redwood in the night sky.',
    actions: { primary: talk('shows', 'Plan a show'), secondary: { label: 'See the suite', href: '#how-it-works' } },
  },
  need: {
    title: 'The biggest shows fly in China.',
    intro:
      'China holds the records for the largest drone shows. America’s largest was flown with the US partner of a show-drone maker from Shenzhen.',
    stats: [
      { value: '33,615', label: 'Drones in the largest drone display on record, flown in Sichuan, China, in May 2026', sources: ['sichuanShow'] },
      { value: '22,580', label: 'Drones flown at once from a single computer in Hefei, China, a world record', sources: ['ehangRecord'] },
      { value: '11,000', label: 'Drones in the largest show flown in America, in Texas in 2026, by the organizer’s count', sources: ['skyElements'] },
    ],
  },
  why: {
    title: 'Why shows need a flight model.',
    intro: 'A show is a formation that has to hold, in wind, for the length of a song. The bigger the show, the more that can go wrong.',
    chart: {
      kind: 'bars',
      title: 'The largest drone shows, by drones flown',
      caption: 'Record drone shows in 2025 and 2026. The Texas figure is the organizer’s count; Guinness confirmed a 10,183-drone formation that week.',
      unit: 'drones',
      rows: [
        { label: 'Sichuan, China, May 2026', value: 33615, display: '33,615', tone: 'other' },
        { label: 'Hefei, China, February 2026', value: 22580, display: '22,580', tone: 'other' },
        { label: 'Liuyang, China, October 2025', value: 15947, display: '15,947', tone: 'other' },
        { label: 'Blue Ridge, Texas, September 2026', value: 11000, display: '11,000', tone: 'highlight' },
      ],
      sources: ['sichuanShow', 'ehangRecord', 'skyElements', 'guinnessDragon'],
    },
    points: [
      {
        icon: 'sparkle',
        title: 'The records keep climbing',
        text: 'The most drones aloft at once was about 10,000 until late 2025. In 2026 a show in China flew 33,615.',
        sources: ['skyElements', 'sichuanShow'],
      },
      {
        icon: 'drone',
        title: 'Even record shows lose drones',
        text: 'About 25 drones failed to lift off at the 22,580-drone record in Hefei. A good show plans for spares.',
        sources: ['ehangRecord'],
      },
      {
        icon: 'wind',
        title: 'Wind moves the picture',
        text: 'Every gust pushes hundreds of drones at once. A model trained on real wind holds the shape where a fixed flight path drifts.',
      },
    ],
  },
  // sign-off
  how: {
    title: 'The BBD show suite',
    intro: 'Four tools, from the first sketch to the last landing.',
    steps: [
      { icon: 'sparkle', title: 'Design', text: 'Turn artwork, text and 3D models into flight paths, timed to music.' },
      { icon: 'layers', title: 'Simulate', text: 'Check every path for spacing, battery and wind before a single drone flies.' },
      { icon: 'drone', title: 'Fly', text: 'One operator, one console. The model holds formation and brings in spares if a drone drops out.' },
      { icon: 'chart', title: 'Replay', text: 'Every flight is logged, so the next show flies tighter.' },
    ],
  },
  stage: {
    title: 'Where it stands',
    level: 3,
    text: 'Drone shows are widespread, and the record keeps climbing. The race now is scale, safety and how tightly a swarm holds its shape.',
    milestones: [
      { year: '2025', text: 'Liuyang, China, flies 15,947 drones from one computer.', sources: ['ehangRecord'] },
      { year: '2026', text: 'EHang flies 22,580 drones from one computer in Hefei, China.', sources: ['ehangRecord'] },
      { year: '2026', text: 'A display in Sichuan, China, flies 33,615 drones at once.', sources: ['sichuanShow'] },
      { year: '2026', text: 'A team in Texas forms a 10,183-drone dragon, a Guinness record.', sources: ['guinnessDragon'] },
    ],
  },
  // sign-off
  bbd: {
    title: 'What BBD is building for shows.',
    text: 'Show software from the first sketch to the last landing, flown by our formation model on low-cost show drones.',
    items: [
      'Design tools that turn artwork, text and 3D models into flight paths',
      'A simulator that checks spacing, battery and wind before launch',
      'A formation model that holds shape in gusts and fills gaps from spares',
      'Fleet tools for launch, geofencing and safe landing',
    ],
    note: 'The BBD show suite is in development.',
  },
  related: ['models', 'hardware', 'why-america'],
  cta: {
    title: 'Plan a show with us.',
    text: 'Cities, teams, brands and events: tell us the date and the idea.',
    primary: talk('shows', 'Plan a show'),
    secondary: { label: 'See the model', href: '/models' },
  },
};
