import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import type { Lesson } from './lib/lessonSchema';
import { routes } from './routes';

// Every real lesson is ready, so add a draft to check how drafts behave.
vi.mock('./lib/lessons', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./lib/lessons')>();
  const draft: Lesson = {
    id: 'draft-demo',
    number: '99',
    title: 'A draft lesson',
    blurb: 'Soon.',
    level: 'beginner',
    buildsOn: [],
    status: 'draft',
  };
  return {
    ...actual,
    lessons: [...actual.lessons, draft],
    getLesson: (id: string | undefined) => (id === draft.id ? draft : actual.getLesson(id)),
  };
});

function renderAt(path: string) {
  render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />);
}

describe('draft lessons', () => {
  it('show a coming soon card on the home page, without a link', () => {
    renderAt('/');
    expect(screen.getByText('Coming soon')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'A draft lesson' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /A draft lesson/ })).not.toBeInTheDocument();
  });

  it('show coming soon at their URL', () => {
    renderAt('/lessons/draft-demo/1');
    expect(screen.getByText('Coming soon')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('A draft lesson');
  });
});
