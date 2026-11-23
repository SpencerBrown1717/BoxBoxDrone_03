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
    `# ${site.name} (${site.legalName})`,
    '',
    `> ${site.name} builds AI models for drones. Its software is a world action model trained for every environment, specialized for last-mile delivery, Drako training drones, drone shows and test. Based in ${site.locality}, ${site.region}.`,
    '',
    '## What BBD makes',
    '',
    // sign-off
    '- Last-mile delivery drones that carry small orders from a local hub to the door. In development, starting in Palo Alto.',
    '- Drako: low-cost, unarmed training drones and range simulation software for counter-drone training and testing. For training and testing only. In development.',
    '- A drone show suite to design, simulate and fly drone light shows. In development.',
    '- A world action model, the software that flies every BBD drone, with a specialist model for each job.',
    '',
    '## Strategy',
    '',
    '- Drive drone hardware costs toward zero and win on software.',
    '- Train in simulation first, then fly low-cost hardware, then specialize and scale.',
    '',
    '## Home',
    '',
    `- [Home](${url('/')}): the whole story in one scroll`,
    '',
    section(hubs.products),
    '',
    section(hubs.technology),
    '',
    '## Company',
    '',
    `- [About](${url('/company')}): who we are and what we believe`,
    `- [Why now](${url('/why-now')}): America and the drone race`,
    `- [Contact](${url('/contact')}): talk to the team at ${site.email}`,
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
