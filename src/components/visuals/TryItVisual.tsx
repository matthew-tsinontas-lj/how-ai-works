import { useId, useMemo, useState } from 'react';
import type { VisualOf } from '../../lib/lessonSchema';
import { displayToken, tokenise } from '../../lib/tokenise';
import { TokenChip } from './TokenChip';
import { tintAt } from './tints';
import s from './TryItVisual.module.css';

export function TryItVisual({ visual }: { visual: VisualOf<'try-it'> }) {
  const inputId = useId();
  const [text, setText] = useState(visual.initialText);
  const tokens = useMemo(() => tokenise(text), [text]);

  return (
    <>
      <label htmlFor={inputId} className={s.label}>
        Type a sentence
      </label>
      <input
        id={inputId}
        type="text"
        className={s.input}
        value={text}
        onChange={(event) => setText(event.target.value)}
        autoComplete="off"
        spellCheck={false}
      />
      <ol className={s.chips} aria-label="Tokens">
        {tokens.map((token, i) => (
          <li key={i}>
            <TokenChip size="small" tint={tintAt(i)}>
              {displayToken(token)}
            </TokenChip>
          </li>
        ))}
      </ol>
      <p className={s.counts}>
        <span>
          <strong>{tokens.length}</strong> tokens
        </span>
        <span>
          <strong>{text.length}</strong> characters
        </span>
      </p>
    </>
  );
}
