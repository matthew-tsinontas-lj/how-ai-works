import type { VisualOf } from '../../lib/lessonSchema';
import { displayToken } from '../../lib/tokenise';
import { TokenChip } from './TokenChip';
import { tintAt } from './tints';
import s from './TokensVisual.module.css';

export function TokensVisual({ visual }: { visual: VisualOf<'tokens'> }) {
  return (
    <ol className={s.list} aria-label={`${visual.tokens.length} tokens`}>
      {visual.tokens.map((token, i) => (
        <li key={i}>
          <TokenChip tint={tintAt(i)} tokenId={token.tokenId}>
            {displayToken(token.text)}
          </TokenChip>
        </li>
      ))}
    </ol>
  );
}
