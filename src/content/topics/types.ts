/**
 * The shape of every product, technology and company page. Each page is data:
 * the layout in src/layouts/TopicPage.astro renders it in a fixed order.
 *
 * Copy rules (CLAUDE.md): sentence case, plain verbs, no dashes or arrows,
 * capability-level claims only. Every number cites a source by id.
 * Anything describing what BBD builds or offers needs team sign-off and
 * sits under a `// sign-off` marker.
 */
import type { IconName } from '../../components/icon-paths';
import type { FieldScene } from '../../scripts/field';

export type SceneName = 'delivery' | 'wam' | 'drako' | 'shows' | 'models' | 'america';

export type Section = 'products' | 'technology' | 'company';

/** A cited source. Pages number their sources in order of first use. */
export interface Source {
  title: string;
  publisher: string;
  date: string;
  url: string;
}

/** Something on a page that can carry citations. */
export interface Cited {
  sources?: string[];
}

export interface Stat extends Cited {
  value: string;
  label: string;
}

export interface Point extends Cited {
  icon: IconName;
  title: string;
  text: string;
}

export interface Step {
  icon: IconName;
  title: string;
  text: string;
}

export interface Milestone extends Cited {
  year: string;
  text: string;
}

/**
 * Signal (glacier) marks BBD's own model and flights. Highlight (ash) is the emphasis
 * color for everything else. Classical and context are the two grays.
 * The name 'quantum' is kept from the shared chart code; it means the signal color.
 */
export type Tone = 'quantum' | 'highlight' | 'classical' | 'context';

export type Format = 'number' | 'year' | 'power' | 'percent';

export interface Axis {
  label: string;
  min: number;
  max: number;
  ticks: number[];
  log?: boolean;
  format?: Format;
  /** Text to show for each tick, when the format can't say it. */
  tickLabels?: string[];
}

interface ChartBase extends Cited {
  title: string;
  caption: string;
  /** Modeled or schematic rather than measured. Said in the caption and the table. */
  illustrative?: boolean;
}

export interface LineChart extends ChartBase {
  kind: 'line';
  x: Axis;
  y: Axis;
  series: { name: string; tone: Tone; points: [number, number][]; display?: (x: number, y: number) => string }[];
  /** Labelled dots. A note sits above its dot unless `side` is 'below'. */
  notes?: { x: number; y: number; text: string; align?: 'start' | 'end'; side?: 'above' | 'below' }[];
  /** How to name an x value in the tooltip and table. */
  xDisplay?: (x: number) => string;
}

export interface BarChart extends ChartBase {
  kind: 'bars';
  unit: string;
  rows: { label: string; value: number; display: string; tone: Tone }[];
}

/** Values on one log scale, from very large to very small. */
export interface LadderChart extends ChartBase {
  kind: 'ladder';
  axis: string;
  /** Exponents of ten for the ends of the scale. */
  from: number;
  to: number;
  unit: string;
  rows: { label: string; value: number; display: string; tone: Tone }[];
}

/** An icon array: how many out of a whole. */
export interface OddsChart extends ChartBase {
  kind: 'odds';
  noun: string;
  groups: { count: number; label: string; tone: Tone }[];
}

/** One whole, split into parts. */
export interface SegmentChart extends ChartBase {
  kind: 'segments';
  unit: string;
  total: string;
  parts: { label: string; value: number; display: string; tone: Tone }[];
}

/** Floating bars from a low value to a high one. */
export interface RangeChart extends ChartBase {
  kind: 'ranges';
  axis: Axis;
  rows: { label: string; low: number; high: number; display: string; tone: Tone }[];
  markers?: { value: number; label: string }[];
}

export type Chart = LineChart | BarChart | LadderChart | OddsChart | SegmentChart | RangeChart;

export interface Link {
  label: string;
  href: string;
}

export interface Topic {
  /** The route, without slashes at either end: 'defense' or 'defense/undersea'. */
  slug: string;
  section: Section;
  /** For sub-pages: the slug of the page above, for the breadcrumb. */
  parent?: string;
  /** How the page appears in menus and cards. */
  card: { title: string; text: string; icon: IconName };
  meta: { title: string; description: string };
  hero: {
    kicker: string;
    title: string;
    lead: string;
    /** A drawn scene, or the live field band used on the home page. */
    visual: { scene: SceneName } | { band: FieldScene[] };
    caption: string;
    actions: { primary: Link; secondary?: Link };
  };
  need: { title: string; intro: string; stats: Stat[] };
  /** Sub-pages, listed after the need on overview pages. */
  children?: { title: string; intro: string; slugs: string[] };
  why: { title: string; intro: string; chart?: Chart; points: Point[] };
  /** Numbered when the steps are a sequence; a plain grid when they are parts. */
  how: { title: string; intro: string; steps: Step[]; sequence?: boolean };
  stage?: {
    title: string;
    /** 0 Lab, 1 Field trials, 2 Early commercial, 3 Widespread */
    level: 0 | 1 | 2 | 3;
    text: string;
    milestones: Milestone[];
  };
  bbd: { title: string; text: string; items: string[]; note?: string };
  related: string[];
  cta: { title: string; text: string; primary: Link; secondary?: Link };
}
