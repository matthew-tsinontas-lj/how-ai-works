import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { readyLessons } from '../../lib/lessons';
import { axe } from '../../test/axe';
import { VisualPanel } from '.';

const allSlides = readyLessons.flatMap((lesson) =>
  lesson.slides.map((slide, i) => ({ name: `${lesson.id} slide ${i + 1} (${slide.visual.kind})`, slide })),
);

describe('VisualPanel', () => {
  it.each(allSlides)('renders $name accessibly', async ({ slide }) => {
    const { container } = render(<VisualPanel visual={slide.visual} />);
    expect(screen.getByText(slide.visual.caption)).toBeInTheDocument();
    expect(await axe(container)).toHaveProperty('violations', []);
  });
});

describe('TokensVisual', () => {
  it('shows leading spaces as dots, with optional token IDs', () => {
    render(
      <VisualPanel
        visual={{ kind: 'tokens', caption: 'c', tokens: [{ text: 'Un' }, { text: ' tea', tokenId: '15845' }] }}
      />,
    );
    const list = screen.getByRole('list', { name: '2 tokens' });
    expect(within(list).getAllByRole('listitem').map((item) => item.textContent)).toEqual(['Un', '·teaID 15845']);
  });
});

describe('TryItVisual', () => {
  it('re-tokenises as you type', async () => {
    const user = userEvent.setup();
    render(<VisualPanel visual={{ kind: 'try-it', caption: 'c', initialText: 'Hi' }} />);
    const input = screen.getByLabelText('Type a sentence');
    await user.type(input, ' there!');
    expect(within(screen.getByRole('list', { name: 'Tokens' })).getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText(/tokens$/)).toHaveTextContent('3 tokens');
    expect(screen.getByText(/characters$/)).toHaveTextContent('9 characters');
  });
});

describe('ContextBarVisual', () => {
  it('labels what is inside and outside the window', () => {
    render(
      <VisualPanel
        visual={{
          kind: 'context-bar',
          caption: 'c',
          outside: [{ label: 'Old' }],
          inside: [{ label: 'New', size: 1, fill: 'blue' }],
        }}
      />,
    );
    expect(within(screen.getByRole('list', { name: 'Outside the context window' })).getByText('Old')).toBeInTheDocument();
    expect(within(screen.getByRole('list', { name: 'Context window' })).getByText('New')).toBeInTheDocument();
  });
});

describe('RowsVisual', () => {
  it('gives each distinct chip its own colour', () => {
    render(
      <VisualPanel
        visual={{ kind: 'rows', caption: 'c', rows: [{ label: 'One', chips: ['You', 'AI', 'You'] }] }}
      />,
    );
    const [you1, ai, you2] = within(screen.getByText('One').parentElement!).getAllByRole('listitem');
    expect(you1!.className).toBe(you2!.className);
    expect(you1!.className).not.toBe(ai!.className);
  });
});
