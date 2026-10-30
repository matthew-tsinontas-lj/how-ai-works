import { useEffect, useRef } from 'react';

/** Moves focus to the returned element whenever `key` changes, so screen changes are announced. */
export function useFocusOnChange<T extends HTMLElement>(key: unknown) {
  const ref = useRef<T>(null);
  useEffect(() => {
    ref.current?.focus();
  }, [key]);
  return ref;
}

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · How AI Works` : 'How AI Works';
  }, [title]);
}

export function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  );
}
