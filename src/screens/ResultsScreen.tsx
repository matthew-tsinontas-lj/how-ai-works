import { Link, useLocation } from 'react-router';
import { useDocumentTitle, useFocusOnChange } from '../lib/hooks';
import { paths } from '../lib/paths';
import { useProgress } from '../lib/progress';
import { useLesson } from './LessonLayout';
import type { ResultsState } from './QuizScreen';
import card from './CenteredCard.module.css';
import s from './ResultsScreen.module.css';

function messageFor(score: number, total: number) {
  if (score === total) return 'Perfect score — you’ve got this one.';
  if (score >= total - 1) return 'Nearly there. A quick look back at the slides will lock it in.';
  return 'Worth another pass through the slides — then try the quiz again.';
}

export function ResultsScreen() {
  const lesson = useLesson();
  const progress = useProgress();
  const state = useLocation().state as Partial<ResultsState> | null;
  const headingRef = useFocusOnChange<HTMLHeadingElement>(lesson.id);
  useDocumentTitle(`${lesson.title} results`);

  const total = lesson.quiz.length;
  // Straight from the quiz we show this attempt; arriving by link, the best saved score.
  const justFinished = typeof state?.score === 'number';
  const raw = justFinished ? state.score : progress[lesson.id]?.bestScore;
  const score = raw === undefined ? undefined : Math.min(raw, total);

  if (score === undefined) {
    return (
      <div className={card.wrap}>
        <section className={card.card}>
          <p className="eyebrow">{lesson.title}</p>
          <h1 ref={headingRef} tabIndex={-1} className={card.title}>
            No score yet
          </h1>
          <p className={card.message}>Take the quiz to see your result here.</p>
          <div className={card.actions}>
            <Link to={paths.slide(lesson.id, 1)} className="btn btn-secondary">
              Start the lesson
            </Link>
            <Link to={paths.quiz(lesson.id)} className="btn btn-primary">
              Take the quiz
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={card.wrap}>
      <section className={card.card}>
        <p className="eyebrow">
          {lesson.title} · {justFinished ? 'complete' : 'best score'}
        </p>
        <h1 ref={headingRef} tabIndex={-1} className={s.score}>
          {score}
          <span className={s.total}> / {total}</span>
          <span className="sr-only"> correct</span>
        </h1>
        <p className={card.message}>{messageFor(score, total)}</p>
        <div className={card.actions}>
          <Link to={paths.slide(lesson.id, 1)} className="btn btn-secondary">
            Review slides
          </Link>
          <Link to={paths.home()} className="btn btn-primary">
            Back to all lessons
          </Link>
        </div>
      </section>
    </div>
  );
}
