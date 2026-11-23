/**
 * Source numbering for a topic page: sources are numbered in the order the page
 * first cites them, reading top to bottom.
 */
import type { Topic } from '../content/topics/types';
import { sources, type SourceId } from '../content/topics/sources';

export type Refs = Map<string, number>;

export function buildRefs(topic: Topic): { refs: Refs; list: { n: number; id: SourceId; source: (typeof sources)[SourceId] }[] } {
  const order: string[] = [];
  const add = (ids?: string[]) => {
    for (const id of ids ?? []) {
      if (!(id in sources)) throw new Error(`Unknown source "${id}" on /${topic.slug}`);
      if (!order.includes(id)) order.push(id);
    }
  };
  topic.need.stats.forEach((stat) => add(stat.sources));
  add(topic.why.chart?.sources);
  topic.why.points.forEach((point) => add(point.sources));
  topic.stage?.milestones.forEach((milestone) => add(milestone.sources));

  const refs: Refs = new Map(order.map((id, i) => [id, i + 1]));
  const list = order.map((id, i) => ({ n: i + 1, id: id as SourceId, source: sources[id as SourceId] }));
  return { refs, list };
}
