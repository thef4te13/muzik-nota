import { applyTheme, validateTheme } from '../theme/theme.js';
import { decodeToMono22050, largeFileWarning } from '../audio/loader.js';
import { transcribe } from '../transcribe/basicPitch.js';
import { estimateTempo } from '../transcribe/tempo.js';
import { toTabLines } from '../instruments/guitar.js';
import { BASS_TUNING, BASS_LABELS, BASS_MAX_FRET } from '../instruments/bass.js';
import { assignViolin } from '../instruments/violin.js';
import { assignHandAndFinger } from '../instruments/piano.js';
import { noteName, intervalSemitones, tessituraWarning } from '../instruments/vocal.js';
import { exportMidi } from '../render/midi.js';
import { drawPage, paginate, MEASURES_PER_PAGE } from '../render/score.js';
import { findGaps, gapMeasures, localGapIndexes } from '../render/gaps.js';
import { toMeasures } from '../render/quantize.js';
import { buildScorePdf } from '../render/pdf.js';
import { tabText } from '../render/tab.js';
import { createLatestRun } from './runGuard.js';
import { prepareNotes } from '../transcribe/melody.js';
import { detectInstruments } from '../instruments/detect.js';
import { RANGES } from '../instruments/ranges.js';
import { t, loadLanguage, setLanguage, getLanguage } from './i18n.js';

const THEME_KEY = 'muzik-nota-theme';
// Notes starting closer together than this are treated as one chord.
const CHORD_WINDOW_SECONDS = 0.03;
const SAMPLE_RATE = 22050;

const ui = {};
const latest = createLatestRun();
let notes = null;
let rawNotes = null;
let bpm = null;
let themes = [];
let selectedFile = null;
// Messages are functions, so a language switch can translate them again.
let statusText = null;
let errorText = null;
let instruments = { kind: 'idle' };

export function startApp() {
  document.getElementById('app').innerHTML = `
    <h1 data-i18n="appTitle"></h1>
    <section class="panel">
      <label><span data-i18n="fileLabel"></span>
        <input id="file" type="file" accept="audio/*" />
      </label>
      <div class="controls">
        <label><span data-i18n="instrument"></span>
          <select id="instrument">
            <option value="guitar" data-i18n="inst.guitar"></option>
            <option value="bass" data-i18n="inst.bass"></option>
            <option value="violin" data-i18n="inst.violin"></option>
            <option value="piano" data-i18n="inst.piano"></option>
            <option value="vocal" data-i18n="inst.vocal"></option>
          </select>
        </label>
        <label><span data-i18n="mode"></span>
          <select id="mode">
            <option value="melody" selected data-i18n="mode.melody"></option>
            <option value="chords" data-i18n="mode.chords"></option>
          </select>
        </label>
        <label><span data-i18n="theme"></span>
          <select id="theme"></select>
        </label>
        <label><span data-i18n="language"></span>
          <select id="lang">
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
          </select>
        </label>
      </div>
      <button id="start" class="start" disabled data-i18n="start"></button>
      <progress id="progress" value="0" max="1" hidden></progress>
      <div id="status" class="status" role="status"></div>
      <div id="error" class="error" role="alert"></div>
      <div>
        <strong data-i18n="instrumentsTitle"></strong>
        <ul id="instruments" class="guidance"></ul>
      </div>
      <button id="midi" disabled data-i18n="midi"></button>
      <button id="pdf" disabled data-i18n="pdf"></button>
    </section>
    <section class="results">
      <div id="notation" class="notation"></div>
      <div id="guidance"></div>
    </section>`;

  ui.file = document.getElementById('file');
  ui.instrument = document.getElementById('instrument');
  ui.theme = document.getElementById('theme');
  ui.lang = document.getElementById('lang');
  ui.mode = document.getElementById('mode');
  ui.start = document.getElementById('start');
  ui.progress = document.getElementById('progress');
  ui.status = document.getElementById('status');
  ui.error = document.getElementById('error');
  ui.instrumentList = document.getElementById('instruments');
  ui.midi = document.getElementById('midi');
  ui.pdf = document.getElementById('pdf');
  ui.notation = document.getElementById('notation');
  ui.guidance = document.getElementById('guidance');

  ui.file.addEventListener('change', () => {
    selectedFile = ui.file.files[0] ?? null;
    ui.start.disabled = !selectedFile;
  });
  ui.start.addEventListener('click', () => selectedFile && analyze(selectedFile));
  ui.instrument.addEventListener('change', () => rawNotes && applyMode());
  ui.mode.addEventListener('change', () => rawNotes && applyMode());
  ui.theme.addEventListener('change', () => selectTheme(Number(ui.theme.value)));
  ui.lang.addEventListener('change', () => switchLanguage(ui.lang.value));
  ui.midi.addEventListener('click', downloadMidi);
  ui.pdf.addEventListener('click', downloadPdf);

  loadLanguage();
  ui.lang.value = getLanguage();
  applyStaticText();
  loadThemes();
}

// Translates everything that is fixed in the page, then the messages currently shown.
function applyStaticText() {
  document.documentElement.lang = getLanguage();
  document.title = t('appTitle');
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  renderThemeOptions();
  renderStatus();
  renderError();
  renderInstruments();
}

function switchLanguage(lang) {
  setLanguage(lang);
  applyStaticText();
  if (notes) show();
}

async function loadThemes() {
  try {
    const files = await (await fetch('./themes/index.json')).json();
    const loaded = await Promise.all(files.map(f => fetch(`./themes/${f}`).then(r => r.json())));
    themes = loaded.filter(th => validateTheme(th).length === 0);
    renderThemeOptions();
    const saved = readSavedTheme();
    const index = themes.findIndex(th => th.id === saved);
    selectTheme(index >= 0 ? index : 0);
  } catch {
    errorText = () => t('themesFailed');
    renderError();
  }
}

function renderThemeOptions() {
  const current = ui.theme.value;
  ui.theme.innerHTML = themes
    .map((th, i) => `<option value="${i}">${th.id ? t(`theme.${th.id}`) : th.name}</option>`)
    .join('');
  if (current) ui.theme.value = current;
}

function selectTheme(index) {
  const theme = themes[index];
  if (!theme) return;
  ui.theme.value = String(index);
  applyTheme(theme, document.documentElement);
  try {
    localStorage.setItem(THEME_KEY, theme.id);
  } catch {
    // Storage may be blocked; the theme still applies for this visit.
  }
}

function readSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

function setStatus(message) {
  statusText = message;
  renderStatus();
}

function renderStatus() {
  ui.status.textContent = statusText ? statusText() : '';
}

function setError(message) {
  errorText = message;
  renderError();
}

function renderError() {
  ui.error.textContent = errorText ? errorText() : '';
}

async function analyze(file) {
  setError(null);
  notes = null;
  ui.midi.disabled = true;
  ui.pdf.disabled = true;
  ui.start.disabled = true;

  const run = latest.begin();
  const current = () => latest.isCurrent(run);
  const isLarge = largeFileWarning(file.size) !== null;

  try {
    setStatus(() => (isLarge ? `${t('largeFile')} ` : '') + t('decoding'));
    setProgress(true);
    const samples = await decodeToMono22050(await file.arrayBuffer());
    if (!current()) return;

    setStatus(() => t('transcribing'));
    const found = await transcribe(samples, SAMPLE_RATE, fraction => {
      if (current()) ui.progress.value = fraction;
    });
    if (!current()) return;

    rawNotes = found;
    const prepared = prepareNotes(found, { mode: ui.mode.value, range: rangeFor(ui.instrument.value) });
    if (prepared.length === 0) {
      setStatus(() => t('noNotes'));
      ui.notation.innerHTML = '';
      ui.guidance.innerHTML = '';
      return;
    }
    notes = prepared;
    instruments = { kind: 'scanning' };
    renderInstruments();
    detectInstruments(samples, SAMPLE_RATE)
      .then(result => {
        if (!current()) return;
        instruments = { kind: 'found', found: result };
        renderInstruments();
      })
      .catch(err => {
        console.error(err);
        if (!current()) return;
        instruments = { kind: 'failed' };
        renderInstruments();
      });
    bpm = estimateTempo([...new Set(notes.map(n => n.start))].sort((a, b) => a - b));
    ui.midi.disabled = false;
    ui.pdf.disabled = false;
    const count = notes.length;
    const tempoBpm = bpm ? Math.round(bpm) : null;
    setStatus(() => {
      const tempo = tempoBpm ? t('tempo', { bpm: tempoBpm }) : '';
      return (isLarge ? `${t('largeFile')} ` : '') + t('summary', { count, tempo });
    });
    show();
  } catch (err) {
    if (!current()) return;
    setStatus(null);
    setError(describeError(err));
  } finally {
    if (current()) {
      setProgress(false);
      ui.start.disabled = !selectedFile;
    }
  }
}

function setProgress(busy) {
  ui.progress.hidden = !busy;
  ui.progress.value = 0;
}

// Keeps the message generic for users; the original error stays in the console.
function describeError(err) {
  console.error(err);
  const text = String(err?.message ?? '');
  let key = 'errUnknown';
  if (err instanceof RangeError) {
    key = 'errLarge';
  } else if (err instanceof DOMException || /decode/i.test(text)) {
    key = 'errDecode';
  } else if (/fetch|load|model/i.test(text)) {
    key = 'errModel';
  }
  return () => t(key);
}

// The playable range of the chosen instrument view, or undefined when there is none.
function rangeFor(kind) {
  return RANGES[kind];
}

// Shows the instruments found in the file, or the current detection state.
function renderInstruments() {
  if (instruments.kind === 'found') {
    if (instruments.found.length === 0) {
      ui.instrumentList.innerHTML = `<li>${t('instrumentsNone')}</li>`;
      return;
    }
    ui.instrumentList.innerHTML = instruments.found
      .map(d => `<li>${t('instrumentLine', {
        label: d.label,
        share: Math.round(d.share * 100),
        confidence: Math.round(d.confidence * 100),
      })}</li>`)
      .join('');
    return;
  }
  const keys = { idle: 'instrumentsIdle', scanning: 'instrumentsScanning', failed: 'instrumentsFailed' };
  ui.instrumentList.innerHTML = `<li>${t(keys[instruments.kind])}</li>`;
}

// Re-applies the note mode to the last transcription, without transcribing again.
function applyMode() {
  notes = prepareNotes(rawNotes, { mode: ui.mode.value, range: rangeFor(ui.instrument.value) });
  if (notes.length === 0) {
    setStatus(() => t('modeEmpty'));
    ui.notation.innerHTML = '';
    ui.guidance.innerHTML = '';
    return;
  }
  show();
}

// Shows the whole song as paged notation: rhythm from the detected tempo, all notes.
function renderScoreView() {
  ui.notation.innerHTML = '';
  const measures = toMeasures(notes, bpm);
  const gaps = gapMeasures(findGaps(notes), bpm ?? 120, measures.length);
  paginate(measures).forEach((page, p) => {
    const div = document.createElement('div');
    div.className = 'page';
    ui.notation.appendChild(div);
    drawPage(div, page, localGapIndexes(gaps, p, MEASURES_PER_PAGE));
  });
}

async function downloadPdf() {
  ui.pdf.disabled = true;
  setStatus(() => t('pdfPreparing'));
  try {
    const measures = toMeasures(notes, bpm);
    const gaps = gapMeasures(findGaps(notes), bpm ?? 120, measures.length);
    const doc = await buildScorePdf(measures, t('pdfTitle'), gaps);
    doc.save('nota.pdf');
    setStatus(() => t('pdfDone'));
  } catch (err) {
    console.error(err);
    setError(() => t('pdfFailed'));
  } finally {
    ui.pdf.disabled = false;
  }
}

function show() {
  renderScoreView();
  const kind = ui.instrument.value;
  if (kind === 'guitar') {
    ui.guidance.innerHTML = `<pre class="tab">${tabText(toTabLines(notes))}</pre>`;
  } else if (kind === 'bass') {
    const lines = toTabLines(notes, BASS_TUNING, BASS_MAX_FRET);
    ui.guidance.innerHTML = `<pre class="tab">${tabText(lines, BASS_LABELS)}</pre>`;
  } else if (kind === 'violin') {
    ui.guidance.innerHTML = violinList(notes);
  } else if (kind === 'piano') {
    ui.guidance.innerHTML = pianoList(notes);
  } else {
    const warning = tessituraWarning(notes);
    const note = warning ? `<p class="status">${warning}</p>` : '';
    ui.guidance.innerHTML = note + vocalList(notes);
  }
}

function violinList(all) {
  const items = all.map(note => {
    const name = noteName(note.pitch);
    const spot = assignViolin(note.pitch);
    if (spot === null) return `<li>${t('violin.outOfRange', { note: name })}</li>`;
    const where = spot.fret === 0
      ? t('violin.open')
      : t('violin.where', {
        finger: t(`finger.${spot.finger}`),
        place: t(spot.position === 1 ? 'violin.near' : 'violin.higher'),
      });
    return `<li>${t('violin.line', { note: name, string: spot.stringName, where })}</li>`;
  });
  return `<ul class="guidance">${items.join('')}</ul>`;
}

function pianoList(all) {
  const items = [];
  let rank = 0;
  let lastStart = null;
  for (const note of all) {
    rank = lastStart !== null && note.start - lastStart < CHORD_WINDOW_SECONDS ? rank + 1 : 0;
    lastStart = note.start;
    const { hand, finger } = assignHandAndFinger(note.pitch, rank);
    items.push(`<li>${t('piano.line', {
      note: noteName(note.pitch),
      hand: t(`hand.${hand}`),
      finger: t(`pfinger.${finger}`),
    })}</li>`);
  }
  return `<ul class="guidance">${items.join('')}</ul>`;
}

function vocalList(all) {
  const items = all.map((note, i) => {
    const step = i === 0 ? '' : t('vocal.step', { n: intervalSemitones(all[i - 1].pitch, note.pitch) });
    return `<li>${noteName(note.pitch)}${step}</li>`;
  });
  return `<ul class="guidance">${items.join('')}</ul>`;
}

function downloadMidi() {
  const bytes = exportMidi(notes, bpm);
  const url = URL.createObjectURL(new Blob([bytes], { type: 'audio/midi' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'nota.mid';
  link.click();
  URL.revokeObjectURL(url);
}
