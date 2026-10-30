import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { toJsonSchema } from './lessonSchema';
import { lessonErrors, lessons, loadLessons } from './lessons';

const draft = { id: 'draft-one', number: '09', title: 'Draft', blurb: 'Soon.', status: 'draft' };
const ready = {
  id: 'ready-one',
  number: '10',
  title: 'Ready',
  blurb: 'Now.',
  status: 'ready',
  slides: [{ title: 'Slide', body: ['Text'], visual: { kind: 'try-it', caption: 'Demo' } }],
  quiz: [{ question: 'Q?', options: ['A', 'B'], answer: 1, explanation: 'Because.' }],
};

describe('lesson content', () => {
  it('loads every file in content/lessons without errors', () => {
    expect(lessonErrors).toEqual([]);
    expect(lessons.map((lesson) => lesson.id)).toEqual([
      'tokens',
      'context',
      'persona',
      'predict',
      'temperature',
      'hallucination',
      'training',
      'prompting',
      'your-data',
      'bias',
      'embeddings',
      'retrieval',
      'tools-and-agents',
      'attention',
      'evaluation',
      'choosing-an-approach',
    ]);
  });

  it('lesson.schema.json is up to date (run `npm run schema` to regenerate)', () => {
    const schemaFile = resolve(process.cwd(), 'content/lesson.schema.json');
    const expected = `${JSON.stringify(toJsonSchema(), null, 2)}\n`;
    if (process.env.UPDATE_SCHEMA) writeFileSync(schemaFile, expected);
    expect(readFileSync(schemaFile, 'utf8')).toBe(expected);
  });
});

describe('loadLessons', () => {
  it('accepts drafts without slides and applies defaults', () => {
    const { lessons, errors } = loadLessons({ 'a/draft.json': draft, 'a/ready.json': ready });
    expect(errors).toEqual([]);
    expect(lessons[1]).toMatchObject({ slides: [{ visual: { initialText: '' } }] });
    expect(lessons[0]).toMatchObject({ level: 'beginner', buildsOn: [] });
  });

  it('rejects an unknown level', () => {
    expect(loadLessons({ 'bad.json': { ...draft, level: 'expert' } }).errors).toHaveLength(1);
  });

  it('reports buildsOn references to missing lessons, but keeps the lesson', () => {
    const { lessons, errors } = loadLessons({
      'draft.json': draft,
      'ready.json': { ...ready, buildsOn: ['draft-one', 'nope', 'ready-one'] },
    });
    expect(lessons).toHaveLength(2);
    expect(errors).toEqual([
      { file: 'ready.json', message: 'buildsOn refers to unknown lessons: "nope", "ready-one"' },
    ]);
  });

  it('sorts by lesson number, numerically', () => {
    const { lessons } = loadLessons({
      'a.json': { ...draft, id: 'b', number: '10' },
      'b.json': { ...draft, id: 'a', number: '9' },
    });
    expect(lessons.map((lesson) => lesson.number)).toEqual(['9', '10']);
  });

  it('rejects an answer index that is out of range', () => {
    const bad = { ...ready, quiz: [{ ...ready.quiz[0], answer: 5 }] };
    const { lessons, errors } = loadLessons({ 'content/bad.json': bad });
    expect(lessons).toEqual([]);
    expect(errors[0]).toMatchObject({ file: 'bad.json' });
    expect(errors[0]!.message).toMatch(/answer must be the index/);
  });

  it('rejects an unknown visual kind', () => {
    const bad = { ...ready, slides: [{ ...ready.slides[0], visual: { kind: 'chart', caption: 'x' } }] };
    expect(loadLessons({ 'bad.json': bad }).errors).toHaveLength(1);
  });

  it('rejects a ready lesson with no quiz', () => {
    expect(loadLessons({ 'bad.json': { ...ready, quiz: [] } }).errors).toHaveLength(1);
  });

  it('rejects duplicate ids, keeping the first', () => {
    const { lessons, errors } = loadLessons({ 'one.json': draft, 'two.json': draft });
    expect(lessons).toHaveLength(1);
    expect(errors).toEqual([{ file: 'two.json', message: 'Duplicate lesson id "draft-one"' }]);
  });
});
