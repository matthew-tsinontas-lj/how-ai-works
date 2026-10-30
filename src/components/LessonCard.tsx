import { Link } from 'react-router';
import type { Lesson, ReadyLesson } from '../lib/lessonSchema';
import { getLesson } from '../lib/lessons';
import { paths } from '../lib/paths';
import type { Progress } from '../lib/progress';
import { LevelTag } from './LevelTag';
import s from './LessonCard.module.css';

function Details({ lesson }: { lesson: Lesson }) {
  const prerequisites = lesson.buildsOn.flatMap((id) => getLesson(id)?.title ?? []);
  return (
    <div className={s.details}>
      <LevelTag level={lesson.level} />
      {prerequisites.length > 0 && <span className={s.buildsOn}>Builds on: {prerequisites.join(', ')}</span>}
    </div>
  );
}

interface LessonCardProps {
  lesson: ReadyLesson;
  result: Progress[string] | undefined;
}

export function LessonCard({ lesson, result }: LessonCardProps) {
  const total = lesson.quiz.length;
  return (
    <Link to={paths.slide(lesson.id, 1)} className={s.card}>
      <div className={s.top}>
        <span className={s.number}>{lesson.number}</span>
        <span className={`${s.status} ${result ? s.completed : ''}`}>
          {result ? `Completed · ${Math.min(result.bestScore, total)}/${total}` : 'Not started'}
        </span>
      </div>
      <h2 className={s.title}>{lesson.title}</h2>
      <p className={s.blurb}>{lesson.blurb}</p>
      <Details lesson={lesson} />
      <div className={s.bottom}>
        <span>
          {lesson.slides.length} slides · {total} questions
        </span>
        <span className={s.cta}>
          {result ? 'Revisit' : 'Start'} <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}

export function DraftCard({ lesson }: { lesson: Lesson }) {
  return (
    <div className={`${s.card} ${s.draft}`}>
      <div className={s.top}>
        <span className={s.number}>{lesson.number}</span>
        <span className={s.status}>Coming soon</span>
      </div>
      <h2 className={s.title}>{lesson.title}</h2>
      <p className={s.blurb}>{lesson.blurb}</p>
      <Details lesson={lesson} />
    </div>
  );
}
