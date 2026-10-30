import type { Accent } from '../../lib/lessonSchema';
import s from './AccentCard.module.css';

interface AccentCardProps {
  label: string;
  text: string;
  accent: Accent;
  compact?: boolean;
}

export function AccentCard({ label, text, accent, compact }: AccentCardProps) {
  return (
    <div className={`${s.card} ${s[accent]} ${compact ? s.compact : ''}`}>
      <span className={s.label}>{label}</span>
      <span className={s.text}>{text}</span>
    </div>
  );
}
