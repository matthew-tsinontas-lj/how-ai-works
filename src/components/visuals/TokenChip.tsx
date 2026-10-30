import type { ReactNode } from 'react';
import type { Tint } from '../../lib/lessonSchema';
import { tintClass } from './tints';
import s from './TokenChip.module.css';

interface TokenChipProps {
  tint: Tint;
  size?: 'large' | 'small';
  tokenId?: string;
  children: ReactNode;
}

export function TokenChip({ tint, size = 'large', tokenId, children }: TokenChipProps) {
  return (
    <span className={`${s.chip} ${s[size]} ${tintClass(tint)}`}>
      <span>{children}</span>
      {tokenId && (
        <span className={s.sub}>
          <span className="sr-only">ID </span>
          {tokenId}
        </span>
      )}
    </span>
  );
}
