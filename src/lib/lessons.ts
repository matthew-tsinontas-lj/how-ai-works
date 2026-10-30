import { z } from 'zod';
import { lessonSchema, type Lesson, type ReadyLesson } from './lessonSchema';

export interface LessonLoadError {
  file: string;
  message: string;
}

/** Validates raw lesson modules (keyed by file path) and sorts them by lesson number. */
export function loadLessons(modules: Record<string, unknown>) {
  const lessons: Lesson[] = [];
  const errors: LessonLoadError[] = [];
  const ids = new Set<string>();
  const files = new Map<string, string>();

  for (const [path, data] of Object.entries(modules)) {
    const file = path.split('/').pop() ?? path;
    const result = lessonSchema.safeParse(data);
    if (!result.success) {
      errors.push({ file, message: z.prettifyError(result.error) });
      continue;
    }
    if (ids.has(result.data.id)) {
      errors.push({ file, message: `Duplicate lesson id "${result.data.id}"` });
      continue;
    }
    ids.add(result.data.id);
    files.set(result.data.id, file);
    lessons.push(result.data);
  }

  // A bad buildsOn reference is reported but doesn't hide the lesson; the card just leaves it out.
  for (const lesson of lessons) {
    const unknown = lesson.buildsOn.filter((id) => id === lesson.id || !ids.has(id));
    if (unknown.length) {
      errors.push({
        file: files.get(lesson.id)!,
        message: `buildsOn refers to unknown lessons: ${unknown.map((id) => `"${id}"`).join(', ')}`,
      });
    }
  }

  lessons.sort((a, b) => a.number.localeCompare(b.number, undefined, { numeric: true }));
  return { lessons, errors };
}

export function isReady(lesson: Lesson): lesson is ReadyLesson {
  return lesson.status === 'ready';
}

// Every JSON file in content/lessons is picked up at build time.
const modules = import.meta.glob('../../content/lessons/*.json', { eager: true, import: 'default' });
const loaded = loadLessons(modules);

for (const { file, message } of loaded.errors) {
  console.error(`Skipped lesson ${file}:\n${message}`);
}

export const lessons = loaded.lessons;
export const lessonErrors = loaded.errors;
export const readyLessons = lessons.filter(isReady);

export function getLesson(id: string | undefined) {
  return lessons.find((lesson) => lesson.id === id);
}
