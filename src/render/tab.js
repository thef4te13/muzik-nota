// Row labels from the top (1st, thinnest string) to the bottom (6th string).
const LABELS = ['e', 'B', 'G', 'D', 'A', 'E'];

// Draws a guitar tab as text. Each note is one 3-character column. Notes with no
// guitar position appear as "?" on every row.
export function tabText(lines) {
  return LABELS.map((label, row) => {
    const cells = lines.map(({ position }) => {
      if (position === null) return '?--';
      if (position.string === row + 1) return `${position.fret}`.padEnd(2, '-') + '-';
      return '---';
    });
    return `${label}|${cells.join('')}`;
  }).join('\n');
}
