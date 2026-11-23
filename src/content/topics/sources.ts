/**
 * Every source the mission and technology pages cite, read before use.
 * Pages refer to these by id and number them in order of first use.
 * Titles are as published, with dashes swapped for commas or colons. Where a page
 * has no clear headline, its title here describes it.
 */
import type { Source } from './types';

export const sources = {
  // The drone industrial base
  droneGirl: {
    title: 'DJI still dominates the 2025 drone market, and new data proves it',
    publisher: 'The Drone Girl',
    date: 'November 6, 2025',
    url: 'https://www.thedronegirl.com/2025/11/06/2025-drone-market-dji/',
  },
  bloombergUa: {
    title: 'Ukraine has become "drone superpower" and produces 4 million UAVs per year: Bloomberg',
    publisher: 'Ukrainska Pravda, reporting Bloomberg',
    date: 'November 12, 2025',
    url: 'https://www.pravda.com.ua/eng/news/2025/11/12/8006961',
  },

  // US policy
  eo14307: {
    title: 'Executive Order 14307: Unleashing American Drone Dominance',
    publisher: 'The White House',
    date: 'June 6, 2025',
    url: 'https://www.whitehouse.gov/presidential-actions/2025/06/unleashing-american-drone-dominance/',
  },
  fccCovered: {
    title: 'Fact sheet: FCC updates Covered List to include foreign UAS and UAS critical components',
    publisher: 'Federal Communications Commission',
    date: 'December 22, 2025',
    url: 'https://docs.fcc.gov/public/attachments/DOC-416839A1.pdf',
  },
  wsgrFcc: {
    title: 'FCC restricts authorization of foreign-made drones and critical components',
    publisher: 'Wilson Sonsini',
    date: 'January 5, 2026',
    url: 'https://www.wsgr.com/print/v2/content/49062874/FCC-Restricts-Authorization-of-Foreign-Made-Drones-and-Critical-Components.pdf',
  },
  fccJuly: {
    title: 'Fact sheet: FCC takes action to secure the drone supply chain',
    publisher: 'Federal Communications Commission',
    date: 'July 21, 2026',
    url: 'https://docs.fcc.gov/public/attachments/DOC-423277A1.pdf',
  },
  flyingGauntlet: {
    title: '25 manufacturers to compete in Pentagon’s $150M Drone Dominance Gauntlet',
    publisher: 'Flying',
    date: 'February 2026',
    url: 'https://www.flyingmag.com/25-manufacturers-pentagon-150m-drone-dominance/',
  },
  twzDdp: {
    title: 'Pentagon launches $1B program to rapidly buy hundreds of thousands of kamikaze drones',
    publisher: 'The War Zone',
    date: 'December 2025',
    url: 'https://www.twz.com/air/pentagon-launches-1b-program-to-rapidly-buy-hundreds-of-thousands-of-kamikaze-drones',
  },
  armyDdp: {
    title: 'War Department asks industry to make more than 300K drones, quickly, cheaply',
    publisher: 'U.S. Army',
    date: 'December 2025',
    url: 'https://www.army.mil/article/289322/war_department_asks_industry_to_make_more_than_300k_drones_quickly_cheaply',
  },
  bd30k: {
    title: 'Drone Dominance: Pentagon to order 30,000 one-way drones in next few days',
    publisher: 'Breaking Defense',
    date: 'March 2026',
    url: 'https://breakingdefense.com/2026/03/drone-dominance-pentagon-to-order-30000-one-way-drones-in-next-few-days/',
  },

  // Delivery
  ziplineTwoMillion: {
    title: 'Zipline surpasses 2 million deliveries with expansion to Houston and Phoenix',
    publisher: 'DroneLife',
    date: 'January 21, 2026',
    url: 'https://dronelife.com/2026/01/21/zipline-surpasses-2-million-deliveries-with-expansion-to-houston-and-phoenix/',
  },
  robotReport: {
    title: 'Zipline raises over $600M in funding, surpasses 2M commercial drone deliveries',
    publisher: 'The Robot Report',
    date: 'January 22, 2026',
    url: 'https://www.therobotreport.com/zipline-raises-over-600m-in-funding-surpasses-2m-commercial-drone-deliveries/',
  },
  meituanMillion: {
    title: '美团无人机低空物流配送服务累计完成订单超 100 万单 (Meituan drone delivery passes 1 million orders)',
    publisher: 'IT Home, via 10jqka',
    date: 'July 22, 2026',
    url: 'https://stock.10jqka.com.cn/20260722/c678354843.shtml',
  },
  yicaiNightRain: {
    title: 'Meituan’s drone delivery infrastructure goes into commercial service',
    publisher: 'Yicai Global',
    date: 'May 22, 2026',
    url: 'https://www.yicaiglobal.com/news/meituan-puts-drone-delivery-infrastructure-into-commercial-use',
  },
  yicaiShanghai: {
    title: 'Shanghai becomes Meituan’s second city with low-altitude drone delivery network',
    publisher: 'Yicai Global',
    date: 'September 14, 2026',
    url: 'https://www.yicaiglobal.com/news/meituan-launches-its-second-drone-delivery-network-in-china-at-shanghai-west-bund',
  },
  fortuneDelivery: {
    title: 'Amazon, Uber, DoorDash, and Walmart are taking the delivery wars to the skies',
    publisher: 'Fortune',
    date: 'August 21, 2026',
    url: 'https://fortune.com/2026/08/21/amazon-uber-doordash-walmart-drone-delivery-wars/',
  },
  part108Proposed: {
    title: 'FAA proposes comprehensive BVLOS UAS regulatory framework: key features and implications',
    publisher: 'DLA Piper',
    date: 'August 7, 2025',
    url: 'https://www.dlapiper.com/en-us/insights/publications/2025/08/faa-proposes-comprehensive-bvlos-uas-regulatory-framework',
  },
  part108Review: {
    title: 'FAA reports 2.2 million UTM flights, but Part 108 still has no release date',
    publisher: 'UAV Coach',
    date: 'November 17, 2026',
    url: 'https://uavcoach.com/faa-utm-flights-part-108-update/',
  },

  // Counter-drone training
  marinesLanes: {
    title: 'Marines train to shoot down combat drones with standard weapons',
    publisher: 'Military Times',
    date: 'August 13, 2026',
    url: 'https://www.militarytimes.com/industry/techwatch/2026/08/13/marines-train-to-shoot-down-combat-drones-with-standard-weapons/',
  },
  braggRange: {
    title: 'Learning lessons from Ukraine: cost-effective solutions to counter drone operations',
    publisher: 'U.S. Army',
    date: 'May 17, 2026',
    url: 'https://www.army.mil/article/292485/learning_lessons_from_ukraine_cost_effective_solutions_to_counter_drone_operations',
  },
  armyCuas: {
    title: 'Army awards more than $4 billion in counter-drone contracts, putting Pentagon’s new drone marketplace to the test',
    publisher: 'Defense One',
    date: 'September 2026',
    url: 'https://defenseone.com/business/2026/09/army-awards-more-4-billion-counterdrone-contracts-putting-pentagons-new-drone-marketplace-test/416327',
  },
  jiatf401: {
    title: '1-year-old JIATF 401 awards $7 billion counter-drone contract',
    publisher: 'AFCEA Signal',
    date: '2026',
    url: 'https://www.afcea.org/signal-media/defense-operations/1-year-old-jiatf-401-awards-7-billion-counter-drone-contract',
  },
  targetSolicitation: {
    title: 'Targeting drones: Army solicitation for low-cost, expendable targeting drones (W911S226U2895)',
    publisher: 'Department of the Army, listed by GovDash',
    date: '2026',
    url: 'https://discover.govdash.com/solicitations/019d2aa6-1fea-7052-a07d-d3bdd7f3eea8--targeting-drones',
  },
  outlaw: {
    title: 'U.S. Army awards $133 million contract for Outlaw drone systems',
    publisher: 'Defence Blog',
    date: 'August 2026',
    url: 'https://defence-blog.com/u-s-army-awards-133-million-contract-for-outlaw-drone-systems/',
  },
  avLaser: {
    title: 'U.S. Army awards AeroVironment $500M contract for layered counter-drone defense systems',
    publisher: 'Army Recognition',
    date: 'July 2026',
    url: 'https://armyrecognition.com/news/army-news/2026/u-s-army-awards-aerovironment-500m-contract-for-layered-counter-drone-defense-systems',
  },
  fpvCost: {
    title: 'Why are $400 Ukrainian drones beating $100,000 American Switchblades?',
    publisher: 'DroneXL',
    date: 'October 23, 2025',
    url: 'https://dronexl.co/2025/10/23/ukrainian-drones-beating-us-switchblades',
  },

  // Drone shows
  sichuanShow: {
    title: 'World’s largest drone cluster lights up Sichuan sky with 33,615 units',
    publisher: 'CGTN',
    date: 'May 25, 2026',
    url: 'https://news.cgtn.com/news/2026-05-25/World-s-largest-drone-cluster-lights-up-Sichuan-sky-with-33-615-units-1Nrli2Ruj2o/share_amp.html',
  },
  ehangRecord: {
    title: 'EHang flies 22,580 drones from one computer for a Guinness World Record',
    publisher: 'DroneXL',
    date: 'June 4, 2026',
    url: 'https://dronexl.co/2026/06/04/ehang-22580-drones-guinness-record/',
  },
  skyElements: {
    title: 'Sky Elements and Damoda fly a 10,183-drone dragon for two Guinness records',
    publisher: 'DroneXL',
    date: 'October 26, 2026',
    url: 'https://dronexl.co/2026/10/26/sky-elements-damoda-dragon-10183-drones-guinness-records/',
  },
  guinnessDragon: {
    title: 'Largest aerial display of a mythical creature formed by multirotors/drones',
    publisher: 'Guinness World Records',
    date: 'September 28, 2026',
    url: 'https://www.guinnessworldrecords.com/world-records/781401-largest-aerial-display-of-a-mythical-creature-formed-by-multirotors-drones',
  },

  // World action models and autonomy research
  worldvln: {
    title: 'WorldVLN: autoregressive world action model for aerial vision-language navigation',
    publisher: 'Zhao et al., Tsinghua University and others, arXiv',
    date: 'May 2026',
    url: 'https://arxiv.org/pdf/2605.15964',
  },
  aeroact: {
    title: 'AeroAct: action-centered world-action models for language-conditioned quadrotor flight',
    publisher: 'Zhang et al., arXiv',
    date: 'July 2026',
    url: 'https://arxiv.org/abs/2607.14997',
  },
  dronewam: {
    title: 'DroneWAM: efficient world action model for drone visual navigation',
    publisher: 'Yao et al., Hohai University and others, arXiv',
    date: 'September 27, 2026',
    url: 'https://arxiv.org/pdf/2609.33148',
  },
  swift: {
    title: 'Champion-level drone racing using deep reinforcement learning',
    publisher: 'Kaufmann et al., Nature',
    date: 'August 30, 2023',
    url: 'https://www.nature.com/articles/s41586-023-06419-4',
  },
} satisfies Record<string, Source>;

export type SourceId = keyof typeof sources;
