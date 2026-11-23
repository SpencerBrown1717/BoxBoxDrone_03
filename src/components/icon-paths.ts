/** Paths for the BBD line icons (24 x 24, 1.5 px strokes), in the Katmai icon style. */
export type IconName =
  | 'drone'
  | 'package'
  | 'house'
  | 'target'
  | 'swarm'
  | 'sparkle'
  | 'rain'
  | 'wind'
  | 'flag'
  | 'eye'
  | 'brain'
  | 'globe'
  | 'battery'
  | 'factory'
  | 'message'
  | 'layers'
  | 'spin'
  | 'route'
  | 'chevron'
  | 'chart'
  | 'chip'
  | 'shield'
  | 'map'
  | 'clock'
  | 'key'
  | 'partners'
  | 'press'
  | 'mail';

const spark =
  '<path d="M12 3.5c.6 3.9 2.6 5.9 6.5 6.5-3.9.6-5.9 2.6-6.5 6.5-.6-3.9-2.6-5.9-6.5-6.5 3.9-.6 5.9-2.6 6.5-6.5Z"/><path d="M18.5 15.5c.3 1.6 1.1 2.4 2.5 2.7-1.4.3-2.2 1.1-2.5 2.8-.3-1.7-1.1-2.5-2.5-2.8 1.4-.3 2.2-1.1 2.5-2.7Z"/>';

export const iconPaths: Record<IconName, string> = {
  drone:
    '<circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="18" r="3"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="m8.2 8.2 1.3 1.3M15.8 8.2l-1.3 1.3M8.2 15.8l1.3-1.3M15.8 15.8l-1.3-1.3"/>',
  package: '<path d="M3.5 7.5 12 3.5l8.5 4v9L12 20.5l-8.5-4Z"/><path d="M3.5 7.5 12 11.5l8.5-4"/><path d="M12 11.5v9"/><path d="m7.8 5.5 8.5 4v3"/>',
  house: '<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5v10h13v-10"/><path d="M10 19.5v-5h4v5"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  swarm:
    '<circle cx="5" cy="8" r="1.4"/><circle cx="10" cy="5" r="1.4"/><circle cx="15" cy="8" r="1.4"/><circle cx="19.5" cy="5.5" r="1.4"/><circle cx="7.5" cy="13" r="1.4"/><circle cx="12.5" cy="12" r="1.4"/><circle cx="17.5" cy="13.5" r="1.4"/><circle cx="10" cy="18.5" r="1.4"/><circle cx="15" cy="18" r="1.4"/>',
  sparkle: spark,
  rain: '<path d="M7 14.5a4.5 4.5 0 0 1 .7-8.9A5.5 5.5 0 0 1 18 7.5a3.5 3.5 0 0 1-.5 7"/><path d="m8.5 17-1 2.5M12.5 17l-1 2.5M16.5 17l-1 2.5"/>',
  wind: '<path d="M3 9h11a2.5 2.5 0 1 0-2.5-2.5"/><path d="M3 13h15a2.5 2.5 0 1 1-2.5 2.5"/><path d="M3 17h6"/>',
  flag: '<path d="M5 21V3.5"/><path d="M5 4h13l-2.5 4.5L18 13H5"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
  brain:
    '<circle cx="5" cy="7" r="1.6"/><circle cx="5" cy="17" r="1.6"/><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/><circle cx="19" cy="12" r="1.6"/><path d="m6.5 6.6 3.9-1.2M6.3 8l4.4 3.1M6.3 16l4.4-3.1M6.5 17.4l3.9 1.2M13.2 6.2l4.7 4.6M13.6 12h3.8M13.2 17.8l4.7-4.6"/>',
  globe:
    '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.4 2.3 3.6 5.1 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.1-3.6-8.5S9.6 5.8 12 3.5Z"/>',
  battery: '<rect x="2.5" y="7.5" width="17" height="9" rx="1.5"/><path d="M21.5 10.5v3"/><path d="M6 10.5v3M9.5 10.5v3M13 10.5v3"/>',
  factory: '<path d="M3 20.5h18"/><path d="M4 20.5V10l5 3V10l5 3V10l5 3v7.5"/><path d="M16.5 7.5V4h2v6"/>',
  message:
    '<path d="M4 5.5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-9l-4.5 3.5v-3.5H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z"/><path d="M7.5 10h9"/><path d="M7.5 13h6"/>',
  layers:
    '<path d="M2.5 9.5c3-3.5 6-5 9.5-5s6.5 1.5 9.5 5"/><path d="M2.5 13.5c3-3 6-4.3 9.5-4.3s6.5 1.3 9.5 4.3"/><path d="M5.5 17.2c2-1.8 4.2-2.7 6.5-2.7s4.5.9 6.5 2.7c-2 1.6-4.2 2.3-6.5 2.3s-4.5-.7-6.5-2.3Z"/>',
  spin: '<circle cx="12" cy="12" r="2.2"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(-28 12 12)"/><path d="M12 9.8V2.5"/><path d="m9.8 4.6 2.2-2.1 2.2 2.1"/>',
  route:
    '<circle cx="5" cy="17.5" r="2"/><circle cx="19" cy="6.5" r="2"/><path d="M7 17.5h7.5a3 3 0 0 0 0-6h-5a3 3 0 0 1 0-6H17" stroke-dasharray="2 2.5"/>',
  chevron: '<path d="m6 9.5 6 6 6-6"/>',
  chart: '<path d="M3.5 20.5h17"/><path d="M3.5 20.5V3.5"/><path d="m6.5 15.5 4-4.5 3.5 3 5.5-6.5"/><path d="M15.5 7.5h4v4"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="9.5" y="9.5" width="5" height="5" rx=".5"/><path d="M9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5"/>',
  shield: '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8 7.5 9.5 4.3-1.5 7.5-4.9 7.5-9.5V6Z"/>',
  map: '<path d="M3.5 6.5 9 4l6 2.5L20.5 4v13.5L15 20l-6-2.5-5.5 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>',
  key: '<circle cx="8" cy="15.5" r="4"/><path d="m11 12.5 8.5-8.5"/><path d="m16.5 7 2.5 2.5"/><path d="m14.5 9 2 2"/>',
  partners: '<circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/>',
  press: '<rect x="3" y="4.5" width="18" height="15" rx="1.5"/><path d="M6.5 8.5h11"/><path d="M6.5 12h5"/><path d="M6.5 15.5h5"/><path d="M14 12h3.5v3.5H14Z"/>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="1.5"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
};
