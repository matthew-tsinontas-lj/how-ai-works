import { describe, expect, it } from 'vitest';
import { displayToken, tokenise } from './tokenise';

describe('tokenise', () => {
  it('keeps short words whole and attaches leading spaces', () => {
    expect(tokenise('the tea is hot')).toEqual(['the', ' tea', ' is', ' hot']);
  });

  it('splits long words on known suffixes', () => {
    expect(tokenise('Unbelievably')).toEqual(['Unbel', 'iev', 'ably']);
    expect(tokenise('tokenisation')).toEqual(['token', 'isation']);
  });

  it('splits long words with no known suffix into chunks of five', () => {
    expect(tokenise('xyzxyzxyzxyz')).toEqual(['xyzxy', 'zxyzx', 'yz']);
  });

  it('makes each digit and punctuation mark its own token', () => {
    expect(tokenise('Hi, 42!')).toEqual(['Hi', ',', ' 4', '2', '!']);
  });

  it('handles empty and whitespace-only input', () => {
    expect(tokenise('')).toEqual([]);
    expect(tokenise('   ')).toEqual([]);
  });
});

describe('displayToken', () => {
  it('shows a leading space as a middle dot', () => {
    expect(displayToken(' tea')).toBe('·tea');
    expect(displayToken('tea')).toBe('tea');
  });
});
