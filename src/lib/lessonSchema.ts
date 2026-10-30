import { z } from 'zod';

const text = z.string().trim().min(1);

/** Background tints for chips and context-window segments. */
export const TINTS = ['blue', 'peach', 'mint', 'lilac'] as const;
/** Top-border accents for stack and compare cards. */
export const ACCENTS = ['blue', 'orange', 'green'] as const;

const caption = text.describe('Small print shown under the visual.');

const tokensVisual = z.object({
  kind: z.literal('tokens'),
  caption,
  tokens: z
    .array(
      z.object({
        text: z.string().min(1).describe('Token text. A leading space is shown as ·'),
        tokenId: z.string().optional().describe('Optional number shown under the token.'),
      }),
    )
    .min(1),
});

const tryItVisual = z.object({
  kind: z.literal('try-it'),
  caption,
  initialText: z.string().default('').describe('Sentence pre-filled in the input.'),
});

const contextBarVisual = z.object({
  kind: z.literal('context-bar'),
  caption,
  inside: z
    .array(
      z.object({
        label: text,
        size: z.number().positive().describe('Relative width of the segment.'),
        fill: z.enum([...TINTS, 'empty']).describe('"empty" draws a dashed, unfilled segment.'),
      }),
    )
    .min(1),
  outside: z
    .array(z.object({ label: text }))
    .default([])
    .describe('Content that has fallen out of the window, drawn struck through.'),
});

const rowsVisual = z.object({
  kind: z.literal('rows'),
  caption,
  rows: z
    .array(
      z.object({
        label: text,
        chips: z.array(text).min(1).describe('Each distinct chip text gets its own colour.'),
      }),
    )
    .min(1),
});

const card = z.object({ label: text, text, accent: z.enum(ACCENTS) });

const stackVisual = z.object({
  kind: z.literal('stack'),
  caption,
  items: z.array(card).min(1),
});

const compareVisual = z.object({
  kind: z.literal('compare'),
  caption,
  question: text,
  cards: z.array(card).min(2),
});

const pointsVisual = z.object({
  kind: z.literal('points'),
  caption,
  items: z.array(z.object({ heading: text, text })).min(1),
});

export const visualSchema = z.discriminatedUnion('kind', [
  tokensVisual,
  tryItVisual,
  contextBarVisual,
  rowsVisual,
  stackVisual,
  compareVisual,
  pointsVisual,
]);

const slideSchema = z.object({
  title: text,
  body: z.array(text).min(1).describe('One entry per paragraph.'),
  visual: visualSchema,
});

const questionSchema = z
  .object({
    question: text,
    options: z.array(text).min(2).max(6),
    answer: z.number().int().min(0).describe('Zero-based index of the correct option.'),
    explanation: text.describe('Shown after the learner answers, right or wrong.'),
  })
  .refine((q) => q.answer < q.options.length, {
    message: 'answer must be the index of one of the options',
    path: ['answer'],
  });

const lessonBase = {
  $schema: z.string().optional(),
  id: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'id must be lowercase letters, numbers and hyphens')
    .describe('Used in the lesson URL, and as the key for saved progress.'),
  number: z.string().min(1).describe('Shown on the card, e.g. "01". Lessons are sorted by this.'),
  title: text,
  blurb: text,
};

const readyLesson = z.object({
  ...lessonBase,
  status: z.literal('ready'),
  slides: z.array(slideSchema).min(1),
  quiz: z.array(questionSchema).min(1),
});

const draftLesson = z.object({
  ...lessonBase,
  status: z.literal('draft').describe('Shown as "Coming soon"; needs no slides or quiz.'),
});

export const lessonSchema = z.discriminatedUnion('status', [readyLesson, draftLesson]);

export type Lesson = z.output<typeof lessonSchema>;
export type ReadyLesson = z.output<typeof readyLesson>;
export type Slide = z.output<typeof slideSchema>;
export type Question = z.output<typeof questionSchema>;
export type Visual = z.output<typeof visualSchema>;
export type VisualKind = Visual['kind'];
export type VisualOf<K extends VisualKind> = Extract<Visual, { kind: K }>;
export type Tint = (typeof TINTS)[number];
export type Accent = (typeof ACCENTS)[number];

/** JSON Schema for editor autocomplete in content/lessons/*.json. */
export function toJsonSchema() {
  return z.toJSONSchema(lessonSchema, { io: 'input', target: 'draft-07' });
}
