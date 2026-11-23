import type { Link } from './types';
import { contactHref } from '../../config/site';

export const stageNames = ['Lab', 'Field trials', 'Early commercial', 'Widespread'] as const;

/** The contact link each page ends on. One topic per mission, so the email gets the right subject. */
export const talk = (topic: string, label = 'Talk to us'): Link => ({ label, href: contactHref(topic) });
