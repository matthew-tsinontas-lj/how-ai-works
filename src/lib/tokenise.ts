// A rough, rule-based stand-in for a real tokeniser, good enough to show how text
// breaks apart. Real tokenisers learn their splits from data.

const SUFFIXES = ['isation', 'ization', 'ation', 'ably', 'ing', 'ness', 'ment', 'tion', 'ful', 'ly', 'ed', 'er', 's'];

function splitWord(word: string): string[] {
  if (word.length <= 6) return [word];
  const lower = word.toLowerCase();
  for (const suffix of SUFFIXES) {
    if (lower.length - suffix.length >= 3 && lower.endsWith(suffix)) {
      const cut = word.length - suffix.length;
      return [...splitWord(word.slice(0, cut)), word.slice(cut)];
    }
  }
  const pieces: string[] = [];
  for (let i = 0; i < word.length; i += 5) pieces.push(word.slice(i, i + 5));
  return pieces;
}

/** Splits text into tokens. A token keeps its leading space as a single ' '. */
export function tokenise(text: string): string[] {
  const parts = text.match(/\s*[A-Za-z]+|\s*\d|\s*[^\sA-Za-z\d]|\s+$/g) ?? [];
  const tokens: string[] = [];
  for (const part of parts) {
    const [, space = '', word = ''] = /^(\s*)(.*)$/s.exec(part) ?? [];
    const lead = space ? ' ' : '';
    if (/^[A-Za-z]+$/.test(word)) {
      splitWord(word).forEach((piece, i) => tokens.push((i === 0 ? lead : '') + piece));
    } else if (word) {
      tokens.push(lead + word);
    }
  }
  return tokens;
}

/** Shows a token's leading space as a visible middle dot. */
export function displayToken(token: string) {
  return token.startsWith(' ') ? `·${token.slice(1)}` : token;
}
