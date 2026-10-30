import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { getProgress, recordResult } from './lib/progress';
import { routes } from './routes';
import { axe } from './test/axe';

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  const user = userEvent.setup();
  const { container } = render(<RouterProvider router={router} />);
  const location = () => router.state.location.pathname;
  return { user, location, container };
}

const heading = () => screen.getByRole('heading', { level: 1 });
// Card links include other lessons' titles ("Builds on: …"), so find a card by its own heading.
const card = (title: string) => screen.getByRole('heading', { name: title }).closest('a')!;

describe('home', () => {
  it('lists every lesson with its status and focuses the heading', async () => {
    const { container } = renderAt('/');
    expect(heading()).toHaveTextContent('Learn how AI actually works');
    expect(heading()).toHaveFocus();
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(16);
    expect(screen.getAllByText('Not started')).toHaveLength(16);
    expect(screen.getByText('0 of 16 lessons complete')).toBeInTheDocument();
    expect(await axe(container)).toHaveProperty('violations', []);
  });

  it('shows saved progress', () => {
    recordResult('tokens', 2, 3);
    renderAt('/');
    expect(screen.getByText('Completed · 2/3')).toBeInTheDocument();
    expect(card('Tokenisation')).toHaveTextContent('Revisit');
    expect(screen.getByText('1 of 16 lessons complete')).toBeInTheDocument();
  });

  it('shows each lesson’s level and what it builds on', () => {
    renderAt('/');
    const retrieval = card('Retrieval (RAG)');
    expect(retrieval).toHaveTextContent('Level: Some background');
    expect(retrieval).toHaveTextContent(
      'Builds on: The context window, Why AI gets things wrong, Embeddings: meaning as numbers',
    );
    expect(screen.getAllByText('Beginner')).toHaveLength(10);
    expect(screen.getAllByText('Some background')).toHaveLength(3);
    expect(screen.getAllByText('Technical')).toHaveLength(3);
  });

  it('opens a lesson from its card', async () => {
    const { user, location } = renderAt('/');
    await user.click(card('The context window'));
    expect(location()).toBe('/lessons/context/1');
  });
});

describe('slides', () => {
  it('moves between slides with the buttons and focuses each new slide', async () => {
    const { user, location, container } = renderAt('/lessons/context/1');
    expect(heading()).toHaveTextContent('Slide 1 of 4: The context window is the model’s working memory');
    expect(screen.queryByRole('link', { name: /Back$/ })).not.toBeInTheDocument();
    expect(await axe(container)).toHaveProperty('violations', []);

    await user.click(screen.getByRole('link', { name: /Next/ }));
    expect(location()).toBe('/lessons/context/2');
    expect(heading()).toHaveTextContent('It doesn’t remember — it rereads');
    expect(heading()).toHaveFocus();

    await user.click(screen.getByRole('link', { name: /Back$/ }));
    expect(location()).toBe('/lessons/context/1');
  });

  it('supports arrow keys, without starting the quiz', async () => {
    const { user, location } = renderAt('/lessons/persona/2');
    await user.keyboard('{ArrowLeft}');
    expect(location()).toBe('/lessons/persona/1');
    await user.keyboard('{ArrowLeft}');
    expect(location()).toBe('/lessons/persona/1');
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(location()).toBe('/lessons/persona/3');
    await user.keyboard('{ArrowRight}');
    expect(location()).toBe('/lessons/persona/3');
  });

  it('ignores arrow keys while typing in the try-it box', async () => {
    const { user, location } = renderAt('/lessons/tokens/3');
    await user.click(screen.getByLabelText('Type a sentence'));
    await user.keyboard('{ArrowLeft}{ArrowRight}');
    expect(location()).toBe('/lessons/tokens/3');
  });

  it('goes to the quiz from the last slide', async () => {
    const { user, location } = renderAt('/lessons/tokens/4');
    await user.click(screen.getByRole('link', { name: /Start the quiz/ }));
    expect(location()).toBe('/lessons/tokens/quiz');
  });
});

describe('lesson URLs', () => {
  it.each([
    ['/lessons/tokens', '/lessons/tokens/1'],
    ['/lessons/tokens/0', '/lessons/tokens/1'],
    ['/lessons/tokens/99', '/lessons/tokens/4'],
  ])('redirects %s to %s', async (from, to) => {
    const { location } = renderAt(from);
    await screen.findByRole('heading', { level: 1 });
    expect(location()).toBe(to);
  });

  it.each(['/lessons/nope/1', '/lessons/tokens/abc', '/nowhere'])('shows not found for %s', (path) => {
    renderAt(path);
    expect(heading()).toHaveTextContent('We couldn’t find that page');
  });
});

describe('quiz', () => {
  it('gives feedback per question, then saves and shows the score', async () => {
    const { user, location, container } = renderAt('/lessons/tokens/quiz');
    expect(heading()).toHaveTextContent('Question 1 of 3: What is a token?');

    // Wrong answer
    await user.click(screen.getByRole('button', { name: /Always exactly one word/ }));
    expect(screen.getByText('Not quite').parentElement).toHaveFocus();
    expect(screen.getByRole('button', { name: /Always exactly one word.*your answer, incorrect/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /A chunk of text.*correct answer/ })).toBeDisabled();
    expect(await axe(container)).toHaveProperty('violations', []);
    await user.click(screen.getByRole('button', { name: /Next question/ }));

    // Right answers, using only the keyboard
    expect(heading()).toHaveFocus();
    await user.tab();
    await user.keyboard('{Enter}');
    expect(screen.getByText('Correct')).toBeInTheDocument();
    await user.tab();
    await user.keyboard('{Enter}');
    await user.click(screen.getByRole('button', { name: /About 750/ }));
    await user.click(screen.getByRole('button', { name: /See my score/ }));

    expect(location()).toBe('/lessons/tokens/results');
    expect(heading()).toHaveTextContent('2 / 3 correct');
    expect(screen.getByText('Tokenisation · complete')).toBeInTheDocument();
    expect(screen.getByText(/Nearly there/)).toBeInTheDocument();
    expect(screen.getByText('1 of 16 lessons complete')).toBeInTheDocument();
    expect(getProgress().tokens).toMatchObject({ bestScore: 2, total: 3 });
    expect(await axe(container)).toHaveProperty('violations', []);
  });

  it('links back to the last slide', () => {
    renderAt('/lessons/tokens/quiz');
    expect(screen.getByRole('link', { name: /Back to slides/ })).toHaveAttribute('href', '/lessons/tokens/4');
  });
});

describe('results by link', () => {
  it('shows the best saved score', () => {
    recordResult('persona', 3, 3);
    renderAt('/lessons/persona/results');
    expect(heading()).toHaveTextContent('3 / 3 correct');
    expect(screen.getByText('Personas & system prompts · best score')).toBeInTheDocument();
    expect(screen.getByText(/Perfect score/)).toBeInTheDocument();
  });

  it('invites you to take the quiz when there is no score yet', () => {
    renderAt('/lessons/persona/results');
    expect(heading()).toHaveTextContent('No score yet');
    expect(screen.getByRole('link', { name: 'Take the quiz' })).toHaveAttribute('href', '/lessons/persona/quiz');
  });
});
