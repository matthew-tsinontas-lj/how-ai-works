import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Feedback } from '../components/Feedback';
import { QuizOption, type OptionState } from '../components/QuizOption';
import { useDocumentTitle, useFocusOnChange } from '../lib/hooks';
import { paths } from '../lib/paths';
import { recordResult } from '../lib/progress';
import { useLesson } from './LessonLayout';
import s from './QuizScreen.module.css';

const LETTERS = 'ABCDEF';

export interface ResultsState {
  score: number;
}

export function QuizScreen() {
  const lesson = useLesson();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const total = lesson.quiz.length;
  const question = lesson.quiz[index]!;
  const answered = picked !== null;
  const isLast = index === total - 1;

  const headingRef = useFocusOnChange<HTMLHeadingElement>(index);
  const feedbackRef = useRef<HTMLDivElement>(null);
  useDocumentTitle(`${lesson.title} quiz · ${index + 1} of ${total}`);

  // Answer buttons become disabled once picked, so move focus to the feedback.
  useEffect(() => {
    if (answered) feedbackRef.current?.focus();
  }, [answered]);

  function pick(option: number) {
    if (answered) return;
    setPicked(option);
    if (option === question.answer) setScore(score + 1);
  }

  function next() {
    if (!isLast) {
      setIndex(index + 1);
      setPicked(null);
      return;
    }
    recordResult(lesson.id, score, total);
    navigate(paths.results(lesson.id), { state: { score } satisfies ResultsState });
  }

  function optionState(option: number): OptionState {
    if (!answered) return 'idle';
    if (option === question.answer) return 'correct';
    if (option === picked) return 'wrong';
    return 'dimmed';
  }

  return (
    <div className={`page ${s.quiz}`}>
      <div className="topbar">
        <Link to={paths.slide(lesson.id, lesson.slides.length)} className="back-link">
          <span aria-hidden="true">←</span> Back to slides
        </Link>
        <span className="meta">
          {lesson.title} quiz · Question {index + 1} of {total}
        </span>
      </div>

      <section className={s.card} aria-labelledby="question">
        <h1 id="question" ref={headingRef} tabIndex={-1} className={s.question}>
          <span className="sr-only">
            Question {index + 1} of {total}:{' '}
          </span>
          {question.question}
        </h1>
        <ul className={s.options}>
          {question.options.map((text, i) => (
            <li key={i}>
              <QuizOption
                letter={LETTERS[i]!}
                text={text}
                state={optionState(i)}
                disabled={answered}
                onPick={() => pick(i)}
              />
            </li>
          ))}
        </ul>
        {answered && (
          <>
            <Feedback ref={feedbackRef} correct={picked === question.answer} explanation={question.explanation} />
            <div className={s.actions}>
              <button type="button" className="btn btn-primary" onClick={next}>
                {isLast ? 'See my score' : 'Next question'}
                <span aria-hidden="true">&nbsp;→</span>
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
