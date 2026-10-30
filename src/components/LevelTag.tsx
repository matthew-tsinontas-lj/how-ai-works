import { LEVELS, type Level } from '../lib/lessonSchema';
import s from './LevelTag.module.css';

export const LEVEL_LABELS: Record<Level, string> = {
  beginner: 'Beginner',
  intermediate: 'Some background',
  technical: 'Technical',
};

/** The level as text, with a 1–3 bar signal so it never relies on colour alone. */
export function LevelTag({ level }: { level: Level }) {
  const rank = LEVELS.indexOf(level) + 1;
  return (
    <span className={s.level}>
      <span className={s.bars} aria-hidden="true">
        {LEVELS.map((_, i) => (
          <span key={i} className={`${s.bar} ${i < rank ? s.on : ''}`} />
        ))}
      </span>
      <span>
        <span className="sr-only">Level: </span>
        {LEVEL_LABELS[level]}
      </span>
    </span>
  );
}
