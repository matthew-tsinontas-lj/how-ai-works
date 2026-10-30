import { useSyncExternalStore } from 'react';
import { z } from 'zod';

export const STORAGE_KEY = 'how-ai-works:progress:v1';

const progressSchema = z.record(
  z.string(),
  z.object({
    bestScore: z.number().int().min(0),
    total: z.number().int().min(1),
    completedAt: z.string(),
  }),
);

export type Progress = z.infer<typeof progressSchema>;

// useSyncExternalStore needs a stable snapshot, so reads are cached until something changes.
let cache: Progress | null = null;
const listeners = new Set<() => void>();

function read(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = progressSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : {};
  } catch {
    // Storage blocked or corrupt: start fresh rather than break the app.
    return {};
  }
}

export function getProgress(): Progress {
  cache ??= read();
  return cache;
}

/** Saves a finished quiz, keeping the learner's best score. */
export function recordResult(lessonId: string, score: number, total: number, now = new Date()) {
  const current = getProgress();
  const bestScore = Math.max(current[lessonId]?.bestScore ?? 0, score);
  cache = { ...current, [lessonId]: { bestScore, total, completedAt: now.toISOString() } };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // Storage unavailable (e.g. private browsing): progress lasts for this session only.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep tabs in sync when progress changes elsewhere.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      cache = null;
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

export function useProgress() {
  return useSyncExternalStore(subscribe, getProgress);
}

/** Test helper: forget the cached snapshot so the next read hits storage. */
export function resetProgressCache() {
  cache = null;
}
