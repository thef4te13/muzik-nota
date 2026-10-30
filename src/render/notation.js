import { noteName } from '../instruments/vocal.js';

// VexFlow key for a note, e.g. MIDI 61 -> "c#/4".
export function toVexKeys(note) {
  const match = /^([A-G]#?)(-?\d+)$/.exec(noteName(note.pitch));
  return `${match[1].toLowerCase()}/${match[2]}`;
}
