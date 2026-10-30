import type { Tint, VisualOf } from '../../lib/lessonSchema';
import { tintClass } from './tints';
import s from './RowsVisual.module.css';

// Each distinct chip text gets the next colour, in order of first appearance.
const ROW_TINTS: Tint[] = ['blue', 'mint', 'peach', 'lilac'];

export function RowsVisual({ visual }: { visual: VisualOf<'rows'> }) {
  const distinct = [...new Set(visual.rows.flatMap((row) => row.chips))];
  const tintFor = (chip: string) => ROW_TINTS[distinct.indexOf(chip) % ROW_TINTS.length]!;

  return (
    <ul className={s.rows}>
      {visual.rows.map((row, i) => (
        <li key={i} className={s.row}>
          <span className={s.label}>{row.label}</span>
          <ul className={s.chips}>
            {row.chips.map((chip, j) => (
              <li key={j} className={`${s.chip} ${tintClass(tintFor(chip))}`}>
                {chip}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
