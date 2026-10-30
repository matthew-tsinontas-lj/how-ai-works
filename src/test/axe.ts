import { configureAxe } from 'vitest-axe';

// jsdom has no layout, so colour contrast can't be measured here; check it in the browser.
export const axe = configureAxe({ rules: { 'color-contrast': { enabled: false } } });
