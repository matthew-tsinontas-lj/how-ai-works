# How AI Works

Short lessons on how AI works: a few slides, then a quick quiz. Built from the `Main.dc.html` design prototype.

React + Vite + TypeScript, routed with React Router (hash URLs, so it runs on any static host). Lesson files are checked with Zod. Progress is saved in the browser's localStorage.

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies (Node 20.19+) |
| `npm run dev` | Start the dev server |
| `npm test` | Run the tests in watch mode (`npx vitest run` for a single run) |
| `npm run lint` | ESLint, including accessibility rules |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the built app |
| `npm run schema` | Regenerate `content/lesson.schema.json` after changing `src/lib/lessonSchema.ts` |

## Adding a lesson

Add a JSON file to `content/lessons/`. No code changes are needed: the app picks up every file in that folder.

1. Copy an existing lesson, e.g. `01-tokens.json`, and give it a new `id` (used in the URL and for saved progress) and `number` (sets the order on the home page).
2. Keep the `"$schema": "../lesson.schema.json"` line. Your editor will then autocomplete fields and flag mistakes.
3. Use `"status": "draft"` (with no slides or quiz) to show a "Coming soon" card.
4. Run `npm test`. It fails if any lesson file is invalid. In the dev server, invalid files are listed at the top of the home page.

Each slide has a `title`, a `body` (one string per paragraph) and a `visual`. Every visual has a `caption`, plus fields for its `kind`:

| `kind` | Fields |
|---|---|
| `tokens` | `tokens: [{ text, tokenId? }]`. A leading space in `text` is shown as `·` |
| `try-it` | `initialText`: an interactive tokeniser demo |
| `context-bar` | `inside: [{ label, size, fill }]`, `outside?: [{ label }]`. `fill` is `blue`, `peach`, `mint`, `lilac` or `empty` |
| `rows` | `rows: [{ label, chips: [string] }]`. Each distinct chip text gets its own colour |
| `stack` | `items: [{ label, text, accent }]`. `accent` is `blue`, `orange` or `green` |
| `compare` | `question`, `cards: [{ label, text, accent }]` |
| `points` | `items: [{ heading, text }]` |

Quiz questions have a `question`, 2 to 6 `options`, the zero-based index of the correct `answer`, and an `explanation` shown after answering.

To add a new visual kind, add it to `visualSchema` in `src/lib/lessonSchema.ts`, create a component in `src/components/visuals/`, and register it in `src/components/visuals/index.tsx`. TypeScript reports an error if any kind has no component.

## URLs

| Screen | URL |
|---|---|
| Home | `#/` |
| Slide | `#/lessons/:id/:slide`, e.g. `#/lessons/tokens/2` |
| Quiz | `#/lessons/:id/quiz` |
| Results | `#/lessons/:id/results`: the latest attempt, or the best saved score when opened from a link |

## Theming

All colours, fonts and radii are CSS variables in `src/styles/tokens.css`. To change the accent colour, change `--accent` (the prototype's alternatives are `#0F7B6C`, `#B4441E` and `#6B3FD4`).
