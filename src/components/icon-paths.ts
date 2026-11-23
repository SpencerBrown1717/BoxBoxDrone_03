/** Paths for the BBD line icons (24 x 24, 1.5 px strokes). */
export type IconName =
  | 'submarine'
  | 'tunnel'
  | 'bunker'
  | 'wave'
  | 'factory'
  | 'message'
  | 'database'
  | 'derrick'
  | 'layers'
  | 'timelapse'
  | 'spin'
  | 'device'
  | 'terminal'
  | 'cap'
  | 'route'
  | 'rows'
  | 'filter'
  | 'spark'
  | 'partners'
  | 'key'
  | 'news'
  | 'chevron'
  | 'chart'
  | 'network'
  | 'circuit'
  | 'chip'
  | 'magnet'
  | 'gravity'
  | 'clock'
  | 'gyro'
  | 'antenna'
  | 'satellite'
  | 'compass'
  | 'flame'
  | 'atom'
  | 'laser'
  | 'shield'
  | 'coil'
  | 'cell'
  | 'detector'
  | 'lock'
  | 'photons'
  | 'map'
  | 'drone'
  | 'package'
  | 'home'
  | 'wind'
  | 'rain'
  | 'moon'
  | 'sparkle'
  | 'model'
  | 'flag'
  | 'tag'
  | 'sim';

export const iconPaths: Record<IconName, string> = {
  submarine:
    '<path d="M2.5 15.5h19"/><path d="M4 13.2c0-1.5 1.3-2.7 2.9-2.7h10.4a2.7 2.7 0 0 1 0 5.4H6.9C5.3 15.9 4 14.7 4 13.2Z"/><path d="M11.5 10.5V7.8h3l.6 2.7"/><path d="M13 7.8V5.5"/>',
  tunnel:
    '<path d="M2.5 6.5h19"/><path d="M6 6.5v11h12"/><path d="M8.5 6.5v8.5H18"/><path d="M18 14.9v2.6"/>',
  bunker:
    '<path d="M2.5 7h19"/><path d="M10.5 7v4"/><path d="M13.5 7v4"/><rect x="6" y="11" width="12" height="7.5" rx="1"/><path d="M6 14.5h12"/>',
  wave: '<path d="M2.5 12c1.4-5.5 2.6-5.5 4 0s2.4 4.6 3.6 0 2.1-3.7 3.2 0 1.9 2.8 2.8 0 1.6-2 2.4 0 1.3 1.3 1.9 0 .9-.6 1.1 0"/>',
  factory:
    '<path d="M3 20.5h18"/><path d="M4 20.5V10l5 3V10l5 3V10l5 3v7.5"/><path d="M16.5 7.5V4h2v6"/>',
  message:
    '<path d="M4 5.5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-9l-4.5 3.5v-3.5H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z"/><path d="M7.5 10h9"/><path d="M7.5 13h6"/>',
  database:
    '<ellipse cx="12" cy="5.5" rx="7.5" ry="2.5"/><path d="M4.5 5.5v13c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5v-13"/><path d="M4.5 12c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5"/>',
  derrick:
    '<path d="M2.5 20.5h19"/><path d="M8 20.5 11 4h2l3 16.5"/><path d="M9.6 11.5h4.8"/><path d="M8.8 16h6.4"/><path d="m9.6 11.5 5.6 4.5"/><path d="m14.4 11.5-5.6 4.5"/>',
  layers:
    '<path d="M2.5 9.5c3-3.5 6-5 9.5-5s6.5 1.5 9.5 5"/><path d="M2.5 13.5c3-3 6-4.3 9.5-4.3s6.5 1.3 9.5 4.3"/><path d="M5.5 17.2c2-1.8 4.2-2.7 6.5-2.7s4.5.9 6.5 2.7c-2 1.6-4.2 2.3-6.5 2.3s-4.5-.7-6.5-2.3Z"/>',
  timelapse:
    '<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4.5v3.8h-3.8"/><path d="M12 8v4.5l3 1.8"/>',
  spin: '<circle cx="12" cy="12" r="2.2"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(-28 12 12)"/><path d="M12 9.8V2.5"/><path d="m9.8 4.6 2.2-2.1 2.2 2.1"/>',
  device:
    '<rect x="3.5" y="7.5" width="17" height="11" rx="1.5"/><circle cx="9" cy="13" r="2.6"/><path d="M14 11.5h3.5"/><path d="M14 14.5h3.5"/><path d="M9 7.5V4.5"/>',
  terminal: '<rect x="3" y="4.5" width="18" height="15" rx="1.5"/><path d="m7 10 3 2.5L7 15"/><path d="M12.5 15h4.5"/>',
  cap: '<path d="m2.5 9.5 9.5-4.5 9.5 4.5-9.5 4.5Z"/><path d="M6.5 11.5v4.3c1.5 1.4 3.4 2.2 5.5 2.2s4-.8 5.5-2.2v-4.3"/><path d="M21.5 9.5v5"/>',
  route:
    '<circle cx="5" cy="17.5" r="2"/><circle cx="19" cy="6.5" r="2"/><path d="M7 17.5h7.5a3 3 0 0 0 0-6h-5a3 3 0 0 1 0-6H17" stroke-dasharray="2 2.5"/>',
  rows: '<path d="M3 6h4"/><path d="M9.5 6h2"/><path d="M14 6h7"/><path d="M3 10h7"/><path d="M12.5 10h3"/><path d="M18 10h3"/><path d="M3 14h2.5"/><path d="M8 14h6"/><path d="M16.5 14h4.5"/><path d="M3 18h5"/><path d="M10.5 18h8"/>',
  filter: '<path d="M3.5 5h17l-6.5 7.5V19l-4 1.5v-8Z"/>',
  spark:
    '<path d="M12 3.5c.6 3.9 2.6 5.9 6.5 6.5-3.9.6-5.9 2.6-6.5 6.5-.6-3.9-2.6-5.9-6.5-6.5 3.9-.6 5.9-2.6 6.5-6.5Z"/><path d="M18.5 15.5c.3 1.6 1.1 2.4 2.5 2.7-1.4.3-2.2 1.1-2.5 2.8-.3-1.7-1.1-2.5-2.5-2.8 1.4-.3 2.2-1.1 2.5-2.7Z"/>',
  partners: '<circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/>',
  key: '<circle cx="8" cy="15.5" r="4"/><path d="m11 12.5 8.5-8.5"/><path d="m16.5 7 2.5 2.5"/><path d="m14.5 9 2 2"/>',
  news: '<rect x="3" y="4.5" width="18" height="15" rx="1.5"/><path d="M6.5 8.5h11"/><path d="M6.5 12h5"/><path d="M6.5 15.5h5"/><path d="M14 12h3.5v3.5H14Z"/>',
  chevron: '<path d="m6 9.5 6 6 6-6"/>',
  chart:
    '<path d="M3.5 20.5h17"/><path d="M3.5 20.5V3.5"/><path d="m6.5 15.5 4-4.5 3.5 3 5.5-6.5"/><path d="M15.5 7.5h4v4"/>',
  network:
    '<circle cx="5.5" cy="17.5" r="2"/><circle cx="18.5" cy="17.5" r="2"/><circle cx="12" cy="5.5" r="2"/><path d="m6.6 15.7 4.3-8.4"/><path d="m17.4 15.7-4.3-8.4"/><path d="M7.5 17.5h9"/>',
  circuit:
    '<path d="M2.5 8h4.5"/><path d="M12 8h9.5"/><rect x="7" y="5" width="5" height="6" rx="1"/><path d="M2.5 16h11.5"/><path d="M19 16h2.5"/><circle cx="16.5" cy="16" r="2.5"/><path d="M16.5 8v10.5"/><path d="M14 16h5"/><circle cx="16.5" cy="8" r="1" fill="currentColor"/>',
  chip:
    '<rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="9.5" y="9.5" width="5" height="5" rx=".5"/><path d="M9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5"/>',
  magnet:
    '<path d="M6 3.5v8a6 6 0 0 0 12 0v-8"/><path d="M10 3.5v8a2 2 0 0 0 4 0v-8"/><path d="M6 7.5h4M14 7.5h4"/>',
  gravity:
    '<circle cx="12" cy="5.5" r="2.5"/><path d="M12 10v7.5"/><path d="m9 15 3 3 3-3"/><path d="M4.5 21h15"/>',
  clock:
    '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>',
  gyro:
    '<circle cx="12" cy="12" r="1.8"/><ellipse cx="12" cy="12" rx="9" ry="4"/><ellipse cx="12" cy="12" rx="4" ry="9"/>',
  antenna:
    '<path d="M12 21V11"/><path d="M8.5 21h7"/><circle cx="12" cy="9" r="1.5"/><path d="M8 5a6 6 0 0 0 0 8M16 5a6 6 0 0 1 0 8"/><path d="M5 2.5a9.5 9.5 0 0 0 0 13M19 2.5a9.5 9.5 0 0 1 0 13"/>',
  satellite:
    '<rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M3 9.5h4.5v5H3zM16.5 9.5H21v5h-4.5z"/><path d="M7.5 12h2M14.5 12h2"/><path d="M12 14.5V18"/><path d="M9.5 20.5h5"/>',
  compass:
    '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  flame:
    '<path d="M12 21c-3.6 0-6-2.4-6-5.6 0-3.3 2.6-5 3.6-8.4.9 1.6 1.4 2.7 1.4 4 1.1-.8 2-2.3 2-4.5 2.7 2 5 5.4 5 8.9 0 3.2-2.4 5.6-6 5.6Z"/>',
  atom:
    '<circle cx="12" cy="12" r="1.5"/><ellipse cx="12" cy="12" rx="9" ry="3.6"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)"/>',
  laser:
    '<rect x="2.5" y="9" width="9" height="6" rx="1"/><path d="M11.5 12h10"/><path d="M15 8.5 16.5 7M15 15.5l1.5 1.5"/>',
  shield:
    '<rect x="3.5" y="5" width="17" height="14" rx="3"/><rect x="7" y="8" width="10" height="8" rx="2"/>',
  coil:
    '<path d="M3 12h2.5"/><path d="M18.5 12H21"/><path d="M5.5 12c0-3 1.2-4.5 2-4.5s2 1.5 2 4.5 1.2 4.5 2 4.5 2-1.5 2-4.5 1.2-4.5 2-4.5 2 1.5 2 4.5"/>',
  cell:
    '<rect x="5" y="5" width="14" height="14" rx="2"/><circle cx="9.5" cy="10" r="1"/><circle cx="14.5" cy="12.5" r="1"/><circle cx="10" cy="15" r="1"/>',
  detector:
    '<path d="M3 12h6"/><path d="M9 7h6.5a3.5 3.5 0 0 1 3.5 3.5v3a3.5 3.5 0 0 1-3.5 3.5H9z"/><path d="M21.5 9v6"/>',
  lock:
    '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5v-3a4 4 0 0 1 8 0v3"/><path d="M12 14.5v2"/>',
  photons:
    '<circle cx="5.5" cy="12" r="2"/><circle cx="18.5" cy="12" r="2"/><path d="M7.5 11c2-3 7-3 9 0"/><path d="M7.5 13c2 3 7 3 9 0" stroke-dasharray="1.5 2"/>',
  map:
    '<path d="M3.5 6.5 9 4l6 2.5L20.5 4v13.5L15 20l-6-2.5-5.5 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
  drone:
    '<rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9.5 9.5 7 7M14.5 9.5 17 7M9.5 14.5 7 17M14.5 14.5 17 17"/><circle cx="5.5" cy="5.5" r="2.5"/><circle cx="18.5" cy="5.5" r="2.5"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  package:
    '<path d="m12 3 8 4v10l-8 4-8-4V7Z"/><path d="m4 7 8 4 8-4"/><path d="M12 11v10"/><path d="m8 5 8 4"/>',
  home:
    '<path d="M4 11 12 4.5 20 11"/><path d="M6 9.5v10h12v-10"/><path d="M10 19.5v-5h4v5"/>',
  wind:
    '<path d="M3 9h11.5a2.5 2.5 0 1 0-2.5-2.5"/><path d="M3 13h15.5a2.5 2.5 0 1 1-2.5 2.5"/><path d="M3 17h6"/>',
  rain:
    '<path d="M7 14.5a4 4 0 0 1-.4-8A5.5 5.5 0 0 1 17 7.5a3.5 3.5 0 0 1 .5 7Z"/><path d="m8.5 17.5-1 2.5M12.5 17.5l-1 2.5M16.5 17.5l-1 2.5"/>',
  moon:
    '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10Z"/>',
  sparkle:
    '<path d="M12 3.5 13.6 10.4 20.5 12 13.6 13.6 12 20.5 10.4 13.6 3.5 12 10.4 10.4Z"/><path d="M18.5 3.5v3M17 5h3"/>',
  model:
    '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="12" cy="19" r="2"/><path d="M10.6 6.4 6.4 10.6M13.4 6.4l4.2 4.2M6.4 13.4l4.2 4.2M17.6 13.4l-4.2 4.2"/><circle cx="12" cy="12" r="1.5"/>',
  flag:
    '<path d="M5.5 20.5v-16"/><path d="M5.5 4.5h11l-2.5 4 2.5 4h-11"/>',
  tag:
    '<path d="M3.5 12.5v-8h8l9 9-8 8Z"/><circle cx="8" cy="8.5" r="1.5"/>',
  sim:
    '<rect x="3" y="4" width="18" height="13" rx="1.5"/><path d="M8 21h8M12 17v4"/><path d="M3 10.5h18M9 4v13M15 4v13"/>',
};
