import { TINTS, type Tint } from '../../lib/lessonSchema';
import tints from './tints.module.css';

/** Cycles through the tint palette by position. */
export function tintAt(index: number): Tint {
  return TINTS[index % TINTS.length]!;
}

export function tintClass(tint: Tint) {
  return tints[tint];
}
