// Compares predicted notes with reference notes. A predicted note matches a reference
// when the pitch is equal and the start is within toleranceSeconds. Each note matches
// at most once.
export function scoreNotes(predicted, reference, toleranceSeconds = 0.05) {
  const used = new Set();
  let matched = 0;
  for (const ref of reference) {
    const index = predicted.findIndex(
      (p, i) =>
        !used.has(i) && p.pitch === ref.pitch && Math.abs(p.start - ref.start) <= toleranceSeconds,
    );
    if (index !== -1) {
      used.add(index);
      matched++;
    }
  }
  const precision = predicted.length ? matched / predicted.length : 0;
  const recall = reference.length ? matched / reference.length : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  return { matched, precision, recall, f1 };
}
