import { useEffect } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router';
import { SlideDots } from '../components/SlideDots';
import { VisualPanel } from '../components/visuals';
import { isTypingTarget, useDocumentTitle, useFocusOnChange } from '../lib/hooks';
import type { ReadyLesson } from '../lib/lessonSchema';
import { paths } from '../lib/paths';
import { useLesson } from './LessonLayout';
import { NotFoundScreen } from './NotFoundScreen';
import s from './SlidesScreen.module.css';

export function SlidesScreen() {
  const lesson = useLesson();
  const { slide = '' } = useParams();
  const total = lesson.slides.length;

  if (!/^\d+$/.test(slide)) return <NotFoundScreen />;
  const number = Number(slide);
  if (number < 1 || number > total) {
    return <Navigate to={paths.slide(lesson.id, Math.min(Math.max(number, 1), total))} replace />;
  }
  return <SlideView lesson={lesson} index={number - 1} />;
}

function SlideView({ lesson, index }: { lesson: ReadyLesson; index: number }) {
  const navigate = useNavigate();
  const slide = lesson.slides[index]!;
  const total = lesson.slides.length;
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const prevPath = paths.slide(lesson.id, index);
  const nextPath = isLast ? paths.quiz(lesson.id) : paths.slide(lesson.id, index + 2);

  const headingRef = useFocusOnChange<HTMLHeadingElement>(index);
  useDocumentTitle(`${lesson.title} · ${index + 1} of ${total}`);

  // Left/right arrows move between slides (but never start the quiz by accident).
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (isTypingTarget(event.target)) return;
      if (event.key === 'ArrowLeft' && !isFirst) navigate(prevPath);
      if (event.key === 'ArrowRight' && !isLast) navigate(nextPath);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate, isFirst, isLast, prevPath, nextPath]);

  return (
    <div className="page">
      <div className="topbar">
        <Link to={paths.home()} className="back-link">
          <span aria-hidden="true">←</span> All lessons
        </Link>
        <div className={s.progress}>
          <span className="meta">
            {lesson.title} · {index + 1} of {total}
          </span>
          <SlideDots total={total} current={index} />
        </div>
      </div>

      <section className={s.slide} aria-labelledby="slide-title">
        <div className={s.copy}>
          <p className="eyebrow">{lesson.title}</p>
          <h1 id="slide-title" ref={headingRef} tabIndex={-1} className={s.title}>
            <span className="sr-only">
              Slide {index + 1} of {total}:{' '}
            </span>
            {slide.title}
          </h1>
          {slide.body.map((paragraph, i) => (
            <p key={i} className={s.body}>
              {paragraph}
            </p>
          ))}
        </div>
        <VisualPanel key={index} visual={slide.visual} />
      </section>

      <nav className={s.nav} aria-label="Slides">
        {!isFirst && (
          <Link to={prevPath} className="btn btn-secondary">
            <span aria-hidden="true">←&nbsp;</span>Back
          </Link>
        )}
        <Link to={nextPath} className={`btn btn-primary ${s.next}`}>
          {isLast ? 'Start the quiz' : 'Next'}
          <span aria-hidden="true">&nbsp;→</span>
        </Link>
      </nav>
    </div>
  );
}
