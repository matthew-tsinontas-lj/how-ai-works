import s from './SlideDots.module.css';

export function SlideDots({ total, current }: { total: number; current: number }) {
  return (
    <div className={s.dots} aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`${s.dot} ${i <= current ? s.seen : ''} ${i === current ? s.current : ''}`}
        />
      ))}
    </div>
  );
}
