const SPLIT_PITCH = 60; // middle C: below it the left hand plays

// Assigns a hand and a finger for one note of a simultaneous group.
// chordRank is the note's position in that group, lowest first, starting at 0.
// Fingers stop at 5.
export function assignHandAndFinger(pitch, chordRank) {
  return {
    hand: pitch < SPLIT_PITCH ? 'L' : 'R',
    finger: Math.min(chordRank + 1, 5),
  };
}
