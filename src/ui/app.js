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
import { renderNotation } from '../render/notation.js';
import { tabText } from '../render/tab.js';
import { createLatestRun } from './runGuard.js';

const THEME_KEY = 'muzik-nota-theme';
// Notes starting closer together than this are treated as one chord.
const CHORD_WINDOW_SECONDS = 0.03;
const SAMPLE_RATE = 22050;

const ui = {};
const latest = createLatestRun();
let notes = null;
let bpm = null;
let themes = [];

export function startApp() {
  document.getElementById('app').innerHTML = `
    <h1>Müzik → Nota</h1>
    <section class="panel">
      <label>Ses dosyası
        <input id="file" type="file" accept="audio/*" />
      </label>
      <label>Enstrüman
        <select id="instrument">
          <option value="guitar">Gitar (tab)</option>
          <option value="bass">Bas gitar (tab)</option>
          <option value="violin">Keman (tel, pozisyon, parmak)</option>
          <option value="piano">Piyano (el ve parmak)</option>
          <option value="vocal">Vokal (nota adları)</option>
        </select>
      </label>
      <label>Tema
        <select id="theme"></select>
      </label>
      <progress id="progress" value="0" max="1" hidden></progress>
      <div id="status" class="status" role="status"></div>
      <div id="error" class="error" role="alert"></div>
      <button id="midi" disabled>MIDI indir</button>
    </section>
    <section class="results">
      <div id="notation" class="notation"></div>
      <div id="guidance"></div>
    </section>`;

  ui.file = document.getElementById('file');
  ui.instrument = document.getElementById('instrument');
  ui.theme = document.getElementById('theme');
  ui.progress = document.getElementById('progress');
  ui.status = document.getElementById('status');
  ui.error = document.getElementById('error');
  ui.midi = document.getElementById('midi');
  ui.notation = document.getElementById('notation');
  ui.guidance = document.getElementById('guidance');

  ui.file.addEventListener('change', () => analyze(ui.file.files[0]));
  ui.instrument.addEventListener('change', () => notes && show());
  ui.theme.addEventListener('change', () => selectTheme(Number(ui.theme.value)));
  ui.midi.addEventListener('click', downloadMidi);

  loadThemes();
}

async function loadThemes() {
  try {
    const files = await (await fetch('./themes/index.json')).json();
    const loaded = await Promise.all(files.map(f => fetch(`./themes/${f}`).then(r => r.json())));
    themes = loaded.filter(t => validateTheme(t).length === 0);
    ui.theme.innerHTML = themes.map((t, i) => `<option value="${i}">${t.name}</option>`).join('');
    const saved = readSavedTheme();
    const index = themes.findIndex(t => t.name === saved);
    selectTheme(index >= 0 ? index : 0);
  } catch {
    ui.error.textContent = 'Temalar yüklenemedi; varsayılan görünüm kullanılıyor.';
  }
}

function selectTheme(index) {
  const theme = themes[index];
  if (!theme) return;
  ui.theme.value = String(index);
  applyTheme(theme, document.documentElement);
  try {
    localStorage.setItem(THEME_KEY, theme.name);
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

async function analyze(file) {
  ui.error.textContent = '';
  notes = null;
  ui.midi.disabled = true;
  if (!file) return;

  const run = latest.begin();
  const current = () => latest.isCurrent(run);
  const warning = largeFileWarning(file.size);

  try {
    ui.status.textContent = warning ?? 'Ses çözülüyor…';
    setProgress(true);
    const samples = await decodeToMono22050(await file.arrayBuffer());
    if (!current()) return;

    ui.status.textContent = 'Notalar çıkarılıyor…';
    const found = await transcribe(samples, SAMPLE_RATE, fraction => {
      if (current()) ui.progress.value = fraction;
    });
    if (!current()) return;

    if (found.length === 0) {
      ui.status.textContent = 'Nota bulunamadı. Kayıtta belirgin bir ses olmayabilir.';
      ui.notation.innerHTML = '';
      ui.guidance.innerHTML = '';
      return;
    }
    notes = found;
    bpm = estimateTempo([...new Set(notes.map(n => n.start))].sort((a, b) => a - b));
    ui.midi.disabled = false;
    const summary = `${notes.length} nota bulundu${bpm ? `, tempo yaklaşık ${Math.round(bpm)} BPM` : ''}.`;
    ui.status.textContent = warning ? `${warning} ${summary}` : summary;
    show();
  } catch (err) {
    if (!current()) return;
    ui.status.textContent = '';
    ui.error.textContent = describeError(err);
  } finally {
    if (current()) setProgress(false);
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
  if (err instanceof RangeError) {
    return 'Dosya işlenemeyecek kadar büyük. Daha kısa bir kayıt deneyin.';
  }
  if (err instanceof DOMException || /decode/i.test(text)) {
    return 'Bu dosya çözülemedi. MP3, WAV, OGG veya M4A deneyin.';
  }
  if (/fetch|load|model/i.test(text)) {
    return 'Transkripsiyon modeli yüklenemedi. Bağlantınızı kontrol edip yeniden deneyin.';
  }
  return 'Beklenmeyen bir hata oluştu.';
}

function show() {
  renderNotation(ui.notation, notes);
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
    const spot = assignViolin(note.pitch);
    if (spot === null) return `<li>${noteName(note.pitch)}: keman aralığının dışında</li>`;
    const where = spot.fret === 0 ? 'açık tel' : `${spot.position}. pozisyon, ${spot.finger}. parmak`;
    return `<li>${noteName(note.pitch)}: ${spot.stringName} teli, ${where}</li>`;
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
    items.push(`<li>${noteName(note.pitch)}: ${hand === 'L' ? 'sol' : 'sağ'} el, parmak ${finger}</li>`);
  }
  return `<ul class="guidance">${items.join('')}</ul>`;
}

function vocalList(all) {
  const items = all.map((note, i) => {
    const step = i === 0 ? '' : `, önceki notaya ${intervalSemitones(all[i - 1].pitch, note.pitch)} yarım ton`;
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
