/**
 * Site-wide settings. Change these values, not the components.
 */
export const site = {
  /** The short name, used in page titles and the header. */
  name: 'BBD',
  /** The full name, said once in the footer and the company page. */
  legalName: 'BoxBox Drone',
  url: 'https://www.boxboxdrone.com',
  title: 'BBD: AI models for drones',
  description:
    'BBD builds AI models for drones: last-mile delivery drones, Drako training drones and drone show software, all flown by one world action model. Based in Palo Alto, California.',
  mission: 'AI models for drones.',
  locality: 'Palo Alto',
  region: 'California',
  country: 'US',

  /**
   * Where every "Talk to us" message goes.
   * Confirm this inbox exists before launch; change it here and every link follows.
   */
  email: 'hello@boxboxdrone.com',
} as const;

/** A mailto link with a subject line, for the contact topics. */
export const mailto = (subject?: string) =>
  subject ? `mailto:${site.email}?subject=${encodeURIComponent(subject)}` : `mailto:${site.email}`;
