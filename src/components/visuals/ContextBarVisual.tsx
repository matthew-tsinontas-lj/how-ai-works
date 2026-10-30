import { useId } from 'react';
import type { VisualOf } from '../../lib/lessonSchema';
import { tintClass } from './tints';
import s from './ContextBarVisual.module.css';

export function ContextBarVisual({ visual }: { visual: VisualOf<'context-bar'> }) {
  const labelId = useId();

  return (
    <div className={s.bar}>
      {visual.outside.length > 0 && (
        <ul className={`${s.list} ${s.outside}`} aria-label="Outside the context window">
          {visual.outside.map((segment, i) => (
            <li key={i} className={`${s.segment} ${s.dropped}`}>
              {segment.label}
            </li>
          ))}
        </ul>
      )}
      <div className={s.window}>
        <span id={labelId} className={s.windowLabel}>
          Context window
        </span>
        <ul className={`${s.list} ${s.segments}`} aria-labelledby={labelId}>
          {visual.inside.map((segment, i) => (
            <li
              key={i}
              className={`${s.segment} ${segment.fill === 'empty' ? s.empty : tintClass(segment.fill)}`}
              style={{ flexGrow: segment.size }}
            >
              {segment.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
