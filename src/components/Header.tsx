import { Link } from 'react-router';
import { readyLessons } from '../lib/lessons';
import { paths } from '../lib/paths';
import { useProgress } from '../lib/progress';
import s from './Header.module.css';

export function Header() {
  const progress = useProgress();
  const completed = readyLessons.filter((lesson) => progress[lesson.id]).length;
  const percent = readyLessons.length ? Math.round((completed / readyLessons.length) * 100) : 0;

  return (
    <header className={s.header}>
      <div className={s.inner}>
        <Link to={paths.home()} className={s.home}>
          <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="8" className={s.logoMark} />
            <rect x="7" y="10" width="7" height="12" rx="2" fill="#FFFFFF" />
            <rect x="16" y="10" width="9" height="5" rx="2" fill="#FFFFFF" opacity=".75" />
            <rect x="16" y="17" width="5" height="5" rx="2" fill="#FFFFFF" opacity=".55" />
          </svg>
          <span className={s.name}>How AI Works</span>
        </Link>
        <div className={s.progress}>
          <span>
            {completed} of {readyLessons.length} lessons complete
          </span>
          <div className={s.track} aria-hidden="true">
            <div className={s.fill} style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>
    </header>
  );
}
