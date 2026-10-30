import type { VisualOf } from '../../lib/lessonSchema';
import { AccentCard } from './AccentCard';
import s from './StackVisual.module.css';

export function StackVisual({ visual }: { visual: VisualOf<'stack'> }) {
  return (
    <ol className={s.stack}>
      {visual.items.map((item, i) => (
        <li key={i}>
          <AccentCard {...item} />
        </li>
      ))}
    </ol>
  );
}
