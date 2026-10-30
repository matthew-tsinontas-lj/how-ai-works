import { Fragment } from 'react';
import { Outlet, useOutletContext, useParams } from 'react-router';
import type { ReadyLesson } from '../lib/lessonSchema';
import { getLesson, isReady } from '../lib/lessons';
import { NotFoundScreen } from './NotFoundScreen';

/** Resolves :lessonId and hands the lesson to the slides, quiz and results screens. */
export function LessonLayout() {
  const { lessonId } = useParams();
  const lesson = getLesson(lessonId);

  if (!lesson) return <NotFoundScreen />;
  if (!isReady(lesson)) {
    return (
      <NotFoundScreen
        eyebrow="Coming soon"
        title={lesson.title}
        message="This lesson isn’t ready yet. Try one of the others in the meantime."
      />
    );
  }
  // Keyed so quiz and slide state reset when switching lessons.
  return (
    <Fragment key={lesson.id}>
      <Outlet context={lesson} />
    </Fragment>
  );
}

export function useLesson() {
  return useOutletContext<ReadyLesson>();
}
