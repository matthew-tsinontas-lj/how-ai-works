import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { resetProgressCache } from '../lib/progress';

afterEach(() => {
  cleanup();
  localStorage.clear();
  resetProgressCache();
});

// jsdom doesn't implement scrolling; ScrollRestoration calls it.
window.scrollTo = () => {};
