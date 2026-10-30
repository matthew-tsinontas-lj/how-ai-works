import type { VisualOf } from '../../lib/lessonSchema';
import { AccentCard } from './AccentCard';
import s from './CompareVisual.module.css';

export function CompareVisual({ visual }: { visual: VisualOf<'compare'> }) {
  return (
    <>
      <p className={s.question}>
        <strong>Question:</strong> {visual.question}
      </p>
      <ul className={s.cards}>
        {visual.cards.map((card, i) => (
          <li key={i}>
            <AccentCard {...card} compact />
          </li>
        ))}
      </ul>
    </>
  );
}
