/**
 * Site-wide settings. Change these values, not the components.
 */
export const site = {
  name: 'BoxBox Drone',
  short: 'BBD',
  url: 'https://www.boxboxdrone.com',
  title: 'BoxBox Drone: AI Models for Drones',
  description:
    'BoxBox Drone (BBD) builds AI models for drones: a world action model trained for every environment, specialized for last-mile delivery, Drako training targets and drone shows. Based in Palo Alto.',
  mission: 'AI models for drones, on hardware that costs next to nothing.',
  locality: 'Palo Alto',
  region: 'California',
  country: 'US',

  /**
   * Where every contact button leads. Each topic gets its own subject line on /contact.
   * The inbox must exist before launch: hello@boxboxdrone.com.
   */
  email: 'hello@boxboxdrone.com',
  contactUrl: '/contact',
} as const;

/** A contact link for one topic, for example `contactHref('drako')`. */
export const contactHref = (topic?: string) => (topic ? `${site.contactUrl}?topic=${topic}` : site.contactUrl);
