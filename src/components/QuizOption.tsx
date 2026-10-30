import s from './QuizOption.module.css';

export type OptionState = 'idle' | 'correct' | 'wrong' | 'dimmed';

interface QuizOptionProps {
  letter: string;
  text: string;
  state: OptionState;
  disabled: boolean;
  onPick: () => void;
}

export function QuizOption({ letter, text, state, disabled, onPick }: QuizOptionProps) {
  const stateClass = state === 'idle' ? '' : s[state];
  return (
    <button type="button" className={`${s.option} ${stateClass}`} disabled={disabled} onClick={onPick}>
      <span className={s.marker} aria-hidden="true">
        {letter}
      </span>
      <span className={s.text}>
        <span className="sr-only">{letter}. </span>
        {text}
        {state === 'correct' && <span className="sr-only"> (correct answer)</span>}
        {state === 'wrong' && <span className="sr-only"> (your answer, incorrect)</span>}
      </span>
      {state === 'correct' && (
        <span className={s.mark} aria-hidden="true">
          ✓
        </span>
      )}
      {state === 'wrong' && (
        <span className={s.mark} aria-hidden="true">
          ✗
        </span>
      )}
    </button>
  );
}
