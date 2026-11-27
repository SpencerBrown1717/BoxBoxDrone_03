/**
 * llms.txt: a plain-text guide to the site for AI search tools.
 * The page lists come from the same content as the menus, so they stay current.
 */
import type { APIRoute } from 'astro';
import { site } from '../config/site';
import { cardFor, hubs } from '../content/topics';

const url = (href: string) => new URL(href, site.url).href;

const section = (hub: (typeof hubs)[keyof typeof hubs]) => {
  const slugs = [...new Set(hub.groups.flatMap((group) => group.slugs))];
  const lines = slugs.map((slug) => {
    const card = cardFor(slug);
    return `- [${card.title}](${url(card.href)}): ${card.text}`;
  });
  return [`## ${hub.label}`, '', `- [${hub.label}](${url(hub.href)}): ${hub.lead}`, ...lines].join('\n');
};

export const GET: APIRoute = () => {
  const body = [
    `# ${site.name} (${site.short})`,
    '',
    `> ${site.name} builds AI models for drones: a world action model trained for every environment and specialized for last-mile delivery, Drako training targets and drone shows, flying low-cost hardware. Based in ${site.locality}, ${site.region}.`,
    '',
    '## What BBD makes',
    '',
    // sign-off
    '- The BBD world action model: it predicts how the world responds to each possible move and flies the best one. Pre-trained across cities, suburbs, farms, coasts, mountains, deserts and snow, by day and night, in wind and rain, and specialized by mission. In development.',
    '- Delivery: the flight model for last-mile drone delivery to doorsteps it has never seen. In development; first routes planned in Palo Alto.',
    '- Drako Drones: a training program of unarmed, low-cost target drones that fly like real threats, in swarms, for counter-drone training and testing. In development.',
    '- Drone shows: a software suite to design, simulate and fly drone light shows. In development.',
    '- Hardware: simple, low-cost aircraft built so the value lives in the model. In development.',
    '',
    '## Why',
    '',
    '- The US fell behind China in drones. BBD thinks software is how America catches up: drive hardware cost toward zero, then fly every drone better than anyone else.',
    '',
    '## Home',
    '',
    `- [Home](${url('/')}): the full story in one scroll`,
    '',
    section(hubs.missions),
    '',
    section(hubs.technology),
    '',
    '## Company',
    '',
    `- [Why America](${url('/why-america')}): the drone gap, in sourced numbers`,
    `- [Newsroom](${url('/news')}): three sourced stories a week on autonomy, missions and the drone industry`,
    `- [About](${url('/company')}): who we are and where we are going`,
    `- [Contact](${url('/contact')}): ${site.email}`,
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
