/**
 * Every source the topic pages cite. Each one was opened and checked before use
 * (November 2026). Pages refer to these by id and number them in order of first use.
 * Add the source here before you add the number to a page.
 */
import type { Source } from './types';

export const sources = {
  // Delivery
  capgemini: {
    title: 'The Last-Mile Delivery Challenge: last-mile delivery is 41% of total supply chain costs',
    publisher: 'Capgemini Research Institute',
    date: 'January 2019',
    url: 'https://www.capgemini.com/research/the-last-mile-delivery-challenge/',
  },
  wingWalmart: {
    title: 'Wing and Walmart expand drone delivery to 150 new stores coast to coast',
    publisher: 'Wing',
    date: 'January 11, 2026',
    url: 'https://wing.com/news/wing-walmart-expand-drone-delivery-coast-to-coast',
  },
  walmart270: {
    title: 'Walmart to expand drone delivery with Wing to 270 U.S. locations by the end of 2027',
    publisher: 'CBS News',
    date: 'January 2026',
    url: 'https://www.cbsnews.com/news/walmart-drone-delivery-service-wing-150-stores',
  },
  part108: {
    title: 'FAA reports 2.2 million UTM flights, but Part 108 still has no release date',
    publisher: 'UAV Coach',
    date: 'November 17, 2026',
    url: 'https://uavcoach.com/faa-utm-flights-part-108-update/',
  },
  eo14307: {
    title: 'Executive Order 14307: Unleashing American Drone Dominance',
    publisher: 'The White House',
    date: 'June 6, 2025',
    url: 'https://www.whitehouse.gov/presidential-actions/2025/06/unleashing-american-drone-dominance/',
  },

  // The United States and China
  fccCoveredList: {
    title: 'FCC updates Covered List to include foreign UAS and UAS critical components',
    publisher: 'Federal Communications Commission',
    date: 'December 22, 2025',
    url: 'https://docs.fcc.gov/public/attachments/DOC-416839A1.pdf',
  },
  a83: {
    title: 'FAA-funded research: DJI platforms are more than 96% of drones detected in US airspace',
    publisher: 'DroneXL',
    date: 'March 3, 2026',
    url: 'https://dronexl.co/2026/03/03/faa-research-dji-us-drone-platforms/',
  },
  ckgsb: {
    title: 'Facing uncertainty: DJI’s future amid US regulations',
    publisher: 'CKGSB Knowledge',
    date: 'January 26, 2026',
    url: 'https://english.ckgsb.edu.cn/knowledge/article/facing-uncertainty-djis-future-amid-us-regulations/',
  },
  armyMillion: {
    title: 'US Army to buy 1 million drones, in major acquisition ramp-up',
    publisher: 'Reuters',
    date: 'November 7, 2025',
    url: 'https://www.reuters.com/business/aerospace-defense/us-army-buy-1-million-drones-major-acquisition-ramp-up-2025-11-07/',
  },
  armyToday: {
    title: 'Army Secretary shares plans to procure 1 million drones; the Army buys about 50,000 a year today',
    publisher: 'ExecutiveGov',
    date: 'November 11, 2025',
    url: 'https://www.executivegov.com/articles/army-daniel-driscoll-drone-procurement',
  },

  // Counter-drone training
  braggRange: {
    title: 'Learning lessons from Ukraine: cost-effective solutions to counter drone operations',
    publisher: 'U.S. Army',
    date: 'May 17, 2026',
    url: 'https://www.army.mil/article/292485',
  },
  indiantownGap: {
    title: 'Fort Indiantown Gap expands UAS and counter-UAS training',
    publisher: 'U.S. Army',
    date: 'June 2026',
    url: 'https://www.army.mil/article-amp/293914/fort_indiantown_gap_expands_uas_counter_uas_training',
  },
  realisticTraining: {
    title: 'The Army needs more realistic drone training, and more versatile drones',
    publisher: 'Defense One',
    date: 'March 2026',
    url: 'https://www.defenseone.com/defense-systems/2026/03/army-needs-more-realistic-drone-training-more-versatile-drones/412389',
  },

  // Shows
  guinnessGroup: {
    title: 'Most remote controlled multirotors/drones airborne simultaneously: 33,615, Sichuan, China',
    publisher: 'Guinness World Records',
    date: 'May 20, 2026',
    url: 'https://www.guinnessworldrecords.com/world-records/373319-most-unmanned-aerial-vehicles-uavs-airborne-simultaneously-5-kg-or-less',
  },
  guinnessSingle: {
    title: 'Most multirotor/drones airborne simultaneously from a single computer (outdoors): 22,580, Hefei, China',
    publisher: 'Guinness World Records',
    date: 'February 3, 2026',
    url: 'https://www.guinnessworldrecords.com/world-records/657119-most-multirotor-drones-airborne-simultaneously-from-a-single-computer-outdoors',
  },
  skyElements: {
    title: 'Sky Elements and Damoda America set two records over Texas, including a 10,183-drone dragon',
    publisher: 'DroneXL',
    date: 'October 26, 2026',
    url: 'https://dronexl.co/2026/10/26/sky-elements-damoda-dragon-10183-drones-guinness-records/',
  },

  // Autonomy research
  swift: {
    title: 'Champion-level drone racing using deep reinforcement learning (Swift)',
    publisher: 'Kaufmann et al., Nature 620, 982 to 987',
    date: 'August 2023',
    url: 'https://doi.org/10.1038/s41586-023-06419-4',
  },
  worldvln: {
    title: 'WorldVLN: Autoregressive World Action Model for Aerial Vision-Language Navigation',
    publisher: 'Zhao et al., arXiv',
    date: 'May 2026',
    url: 'https://arxiv.org/pdf/2605.15964',
  },
  a2rl: {
    title: 'A2RL Drone Championship: World FPV Champion beats TII Racing’s AI drone 5 to 4 in a best-of-nine final',
    publisher: 'DroneDJ',
    date: 'January 27, 2026',
    url: 'https://dronedj.com/2026/01/27/a2rl-human-vs-drone-championship/',
  },
} satisfies Record<string, Source>;

export type SourceId = keyof typeof sources;
