import { DraftCard, LessonCard } from '../components/LessonCard';
import { useDocumentTitle, useFocusOnChange } from '../lib/hooks';
import { isReady, lessonErrors, lessons } from '../lib/lessons';
import { useProgress } from '../lib/progress';
import s from './HomeScreen.module.css';

export function HomeScreen() {
  const progress = useProgress();
  const headingRef = useFocusOnChange<HTMLHeadingElement>('home');
  useDocumentTitle();

  return (
    <div className={s.home}>
      <p className={`eyebrow ${s.eyebrow}`}>Short lessons · No jargon required</p>
      <h1 ref={headingRef} tabIndex={-1} className={s.title}>
        Learn how AI actually works
      </h1>
      <p className={s.intro}>
        Each lesson is a handful of slides followed by a quick quiz. Pick one to start — they work in any
        order.
      </p>

      {import.meta.env.DEV && lessonErrors.length > 0 && (
        <div role="alert" className={s.errors}>
          <strong>Some lesson files were skipped (only shown in development):</strong>
          {lessonErrors.map(({ file, message }) => (
            <pre key={file}>
              {file}
              {'\n'}
              {message}
            </pre>
          ))}
        </div>
      )}

      <ul className={s.grid}>
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            {isReady(lesson) ? (
              <LessonCard lesson={lesson} result={progress[lesson.id]} />
            ) : (
              <DraftCard lesson={lesson} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
