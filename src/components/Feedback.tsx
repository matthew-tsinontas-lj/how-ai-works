import type { Ref } from 'react';
import s from './Feedback.module.css';

interface FeedbackProps {
  correct: boolean;
  explanation: string;
  ref?: Ref<HTMLDivElement>;
}

export function Feedback({ correct, explanation, ref }: FeedbackProps) {
  return (
    <div ref={ref} tabIndex={-1} className={`${s.feedback} ${correct ? s.right : s.wrong}`}>
      <strong>{correct ? 'Correct' : 'Not quite'}</strong>
      <span className={s.explanation}>{explanation}</span>
    </div>
  );
}
