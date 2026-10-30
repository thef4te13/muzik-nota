import { Renderer, Stave, StaveNote, Formatter } from 'vexflow';
import { noteName } from '../instruments/vocal.js';

// VexFlow key for a note, e.g. MIDI 61 -> "c#/4".
export function toVexKeys(note) {
  const match = /^([A-G]#?)(-?\d+)$/.exec(noteName(note.pitch));
  return `${match[1].toLowerCase()}/${match[2]}`;
}

// Long songs produce too many notes for one staff; the rest is left to the tab and MIDI.
const MAX_NOTATION_NOTES = 200;

// Draws the notes on one treble staff. Every note is a quarter note: the notation
// shows pitch, not rhythm. Replaces whatever the container held before.
export function renderNotation(container, notes) {
  container.innerHTML = '';
  if (notes.length === 0) return;
  const shown = notes.slice(0, MAX_NOTATION_NOTES);
  const width = Math.max(300, container.clientWidth || 600);
  const renderer = new Renderer(container, Renderer.Backends.SVG);
  renderer.resize(width, 160);
  const context = renderer.getContext();
  const stave = new Stave(10, 20, width - 20).addClef('treble');
  stave.setContext(context).draw();
  const staveNotes = shown.map(n => new StaveNote({ keys: [toVexKeys(n)], duration: 'q' }));
  Formatter.FormatAndDraw(context, stave, staveNotes);
}
