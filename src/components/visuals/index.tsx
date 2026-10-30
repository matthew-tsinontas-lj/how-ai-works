import type { ComponentType } from 'react';
import type { Visual, VisualKind, VisualOf } from '../../lib/lessonSchema';
import { CompareVisual } from './CompareVisual';
import { ContextBarVisual } from './ContextBarVisual';
import { PointsVisual } from './PointsVisual';
import { RowsVisual } from './RowsVisual';
import { StackVisual } from './StackVisual';
import { TokensVisual } from './TokensVisual';
import { TryItVisual } from './TryItVisual';
import s from './VisualPanel.module.css';

// One component per visual kind. TypeScript flags any kind left out.
const visuals: { [K in VisualKind]: ComponentType<{ visual: VisualOf<K> }> } = {
  tokens: TokensVisual,
  'try-it': TryItVisual,
  'context-bar': ContextBarVisual,
  rows: RowsVisual,
  stack: StackVisual,
  compare: CompareVisual,
  points: PointsVisual,
};

export function VisualPanel({ visual }: { visual: Visual }) {
  const Component = visuals[visual.kind] as ComponentType<{ visual: Visual }>;
  return (
    <figure className={s.panel}>
      <Component visual={visual} />
      <figcaption className={s.caption}>{visual.caption}</figcaption>
    </figure>
  );
}
