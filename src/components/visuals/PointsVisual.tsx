import type { VisualOf } from '../../lib/lessonSchema';
import s from './PointsVisual.module.css';

export function PointsVisual({ visual }: { visual: VisualOf<'points'> }) {
  return (
    <ul className={s.points}>
      {visual.items.map((item, i) => (
        <li key={i} className={s.point}>
          <span className={s.heading}>{item.heading}</span>
          <span className={s.text}>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}
