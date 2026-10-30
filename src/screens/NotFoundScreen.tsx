import { Link } from 'react-router';
import { useDocumentTitle, useFocusOnChange } from '../lib/hooks';
import { paths } from '../lib/paths';
import s from './CenteredCard.module.css';

interface NotFoundScreenProps {
  eyebrow?: string;
  title?: string;
  message?: string;
}

export function NotFoundScreen({
  eyebrow = 'Page not found',
  title = 'We couldn’t find that page',
  message = 'The link may be out of date. All the lessons are on the home page.',
}: NotFoundScreenProps) {
  const headingRef = useFocusOnChange<HTMLHeadingElement>(title);
  useDocumentTitle(title);

  return (
    <div className={s.wrap}>
      <section className={s.card}>
        <p className="eyebrow">{eyebrow}</p>
        <h1 ref={headingRef} tabIndex={-1} className={s.title}>
          {title}
        </h1>
        <p className={s.message}>{message}</p>
        <div className={s.actions}>
          <Link to={paths.home()} className="btn btn-primary">
            Back to all lessons
          </Link>
        </div>
      </section>
    </div>
  );
}
