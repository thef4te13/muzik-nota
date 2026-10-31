import { t } from '../ui/i18n.js';
import { Renderer, Stave, StaveNote, Voice, Formatter, Accidental, Beam, StaveTie } from 'vexflow';
import { noteName } from '../instruments/vocal.js';
import { toVexKeys } from './notation.js';

export const PAGE_WIDTH = 800;
export const MEASURES_PER_SYSTEM = 4;
export const SYSTEMS_PER_PAGE = 6;
export const MEASURES_PER_PAGE = MEASURES_PER_SYSTEM * SYSTEMS_PER_PAGE;
const SYSTEM_HEIGHT = 120;
const TOP_MARGIN = 20;
const SIDE_MARGIN = 20;

// Splits measures into pages of SYSTEMS_PER_PAGE systems each.
export function paginate(measures) {
  const size = MEASURES_PER_SYSTEM * SYSTEMS_PER_PAGE;
  const pages = [];
  for (let i = 0; i < measures.length; i += size) pages.push(measures.slice(i, i + size));
  return pages;
}

// Height in SVG units needed to draw the given number of measures.
export function pageHeight(measureCount) {
  const systems = Math.max(1, Math.ceil(measureCount / MEASURES_PER_SYSTEM));
  return TOP_MARGIN + systems * SYSTEM_HEIGHT;
}

// Draws one page of measures as SVG into the container. Each measure is one 4/4 stave.
// gapIndexes holds the page-local indexes of measures that touch a silent gap.
export function drawPage(container, measures, gapIndexes = new Set()) {
  container.innerHTML = '';
  const renderer = new Renderer(container, Renderer.Backends.SVG);
  renderer.resize(PAGE_WIDTH, pageHeight(measures.length));
  const context = renderer.getContext();
  const measureWidth = (PAGE_WIDTH - 2 * SIDE_MARGIN) / MEASURES_PER_SYSTEM;

  measures.forEach((pieces, index) => {
    const system = Math.floor(index / MEASURES_PER_SYSTEM);
    const column = index % MEASURES_PER_SYSTEM;
    const stave = new Stave(
      SIDE_MARGIN + column * measureWidth,
      TOP_MARGIN + system * SYSTEM_HEIGHT,
      measureWidth,
    );
    if (column === 0) stave.addClef('treble');
    if (index === 0) stave.addTimeSignature('4/4');
    stave.setContext(context).draw();
    drawMeasure(context, stave, pieces);
    if (gapIndexes.has(index)) {
      context.fillText(t('gap'), stave.getX() + 8, stave.getY() - 8);
    }
  });
}

function drawMeasure(context, stave, pieces) {
  const notes = pieces.map(piece => {
    const keys = piece.rest ? ['b/4'] : piece.keys.map(pitch => toVexKeys({ pitch }));
    const note = new StaveNote({ keys, duration: piece.rest ? `${piece.duration}r` : piece.duration });
    if (!piece.rest) {
      piece.keys.forEach((pitch, i) => {
        if (noteName(pitch).includes('#')) note.addModifier(new Accidental('#'), i);
      });
    }
    return note;
  });

  const voice = new Voice({ numBeats: 4, beatValue: 4 }).setStrict(false);
  voice.addTickables(notes);

  const beamable = notes.filter((_, i) => !pieces[i].rest && ['8', '16'].includes(pieces[i].duration));
  const beams = Beam.generateBeams(beamable);

  const width = stave.getNoteEndX() - stave.getNoteStartX() - 10;
  new Formatter().joinVoices([voice]).format([voice], width);
  voice.draw(context, stave);
  beams.forEach(beam => beam.setContext(context).draw());

  pieces.forEach((piece, i) => {
    if (!piece.tie || i + 1 >= pieces.length) return;
    const indexes = piece.keys.map((_, k) => k);
    new StaveTie({
      firstNote: notes[i],
      lastNote: notes[i + 1],
      firstIndexes: indexes,
      lastIndexes: indexes,
    })
      .setContext(context)
      .draw();
  });
}
