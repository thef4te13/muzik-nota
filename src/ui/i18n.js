// Interface texts in Turkish and English. Missing keys fall back to English, then to the key itself.
const STRINGS = {
  tr: {
    appTitle: 'Müzik → Nota',
    fileLabel: 'Ses dosyası',
    instrument: 'Enstrüman',
    'inst.guitar': 'Gitar (tab)',
    'inst.bass': 'Bas gitar (tab)',
    'inst.violin': 'Keman (tel, pozisyon, parmak)',
    'inst.piano': 'Piyano (el ve parmak)',
    'inst.vocal': 'Vokal (nota adları)',
    mode: 'Nota modu',
    'mode.melody': 'Melodi (tek hat)',
    'mode.chords': 'Akorlar',
    theme: 'Tema',
    'theme.space': 'Uzay',
    'theme.light': 'Açık',
    'theme.dark': 'Koyu',
    'theme.reading': 'Okuma',
    language: 'Dil',
    start: 'Başlat',
    midi: 'MIDI indir',
    pdf: 'Notayı PDF indir',
    instrumentsTitle: 'Bulunan enstrümanlar',
    instrumentsIdle: 'Analiz bittiğinde bulunan enstrümanlar burada listelenir.',
    instrumentsScanning: 'Enstrümanlar taranıyor…',
    instrumentsNone: 'Bilinen bir enstrüman bulunamadı.',
    instrumentsFailed: 'Enstrüman tespiti yapılamadı (model dosyası erişilemedi olabilir).',
    instrumentLine: '{label}: süre oranı %{share}, güven %{confidence}',
    pickFile: 'Önce bir ses dosyası seçin.',
    decoding: 'Ses çözülüyor…',
    transcribing: 'Notalar çıkarılıyor…',
    noNotes: 'Nota bulunamadı. Kayıtta belirgin bir ses olmayabilir.',
    summary: '{count} nota bulundu{tempo}.',
    tempo: ', tempo yaklaşık {bpm} BPM',
    modeEmpty: 'Bu modda gösterilecek nota yok.',
    pdfPreparing: 'PDF hazırlanıyor…',
    pdfDone: 'PDF indirildi.',
    pdfFailed: 'PDF oluşturulamadı.',
    themesFailed: 'Temalar yüklenemedi; varsayılan görünüm kullanılıyor.',
    errLarge: 'Dosya işlenemeyecek kadar büyük. Daha kısa bir kayıt deneyin.',
    errDecode: 'Bu dosya çözülemedi. MP3, WAV, OGG veya M4A deneyin.',
    errModel: 'Transkripsiyon modeli yüklenemedi. Bağlantınızı kontrol edip yeniden deneyin.',
    errUnknown: 'Beklenmeyen bir hata oluştu.',
    largeFile: 'Dosya çok büyük; işlem uzun sürebilir ve telefonda bellek yetmeyebilir.',
    'violin.outOfRange': '{note}: keman aralığının dışında',
    'violin.open': 'açık tel',
    'violin.where': '{finger} parmağı, {place}',
    'violin.near': 'ilk pozisyonda',
    'violin.higher': 'daha yukarıda',
    'violin.line': '{note}: {string} teli, {where}',
    'piano.line': '{note}: {hand} el, {finger} parmağı',
    'finger.1': 'işaret',
    'finger.2': 'orta',
    'finger.3': 'yüzük',
    'finger.4': 'serçe',
    'pfinger.1': 'başparmak',
    'pfinger.2': 'işaret',
    'pfinger.3': 'orta',
    'pfinger.4': 'yüzük',
    'pfinger.5': 'serçe',
    'hand.L': 'sol',
    'hand.R': 'sağ',
    'vocal.step': ', önceki notaya {n} yarım ton',
    'vocal.high': 'Bazı notalar tipik vokal aralığının üstünde (en yüksek: {note}).',
    gap: 'algılanmadı',
    pdfTitle: 'Nota',
  },
  en: {
    appTitle: 'Music → Notes',
    fileLabel: 'Audio file',
    instrument: 'Instrument',
    'inst.guitar': 'Guitar (tab)',
    'inst.bass': 'Bass guitar (tab)',
    'inst.violin': 'Violin (string, position, finger)',
    'inst.piano': 'Piano (hand and finger)',
    'inst.vocal': 'Vocal (note names)',
    mode: 'Notation mode',
    'mode.melody': 'Melody (single line)',
    'mode.chords': 'Chords',
    theme: 'Theme',
    'theme.space': 'Space',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.reading': 'Reading',
    language: 'Language',
    start: 'Start',
    midi: 'Download MIDI',
    pdf: 'Download PDF score',
    instrumentsTitle: 'Instruments found',
    instrumentsIdle: 'Detected instruments will be listed here after analysis.',
    instrumentsScanning: 'Scanning for instruments…',
    instrumentsNone: 'No known instrument found.',
    instrumentsFailed: 'Instrument detection failed (the model file may be unavailable).',
    instrumentLine: '{label}: time share {share}%, confidence {confidence}%',
    pickFile: 'Choose an audio file first.',
    decoding: 'Decoding audio…',
    transcribing: 'Extracting notes…',
    noNotes: 'No notes found. The recording may have no clear sound.',
    summary: '{count} notes found{tempo}.',
    tempo: ', tempo about {bpm} BPM',
    modeEmpty: 'No notes to show in this mode.',
    pdfPreparing: 'Preparing PDF…',
    pdfDone: 'PDF downloaded.',
    pdfFailed: 'Could not create the PDF.',
    themesFailed: 'Themes could not be loaded; using the default look.',
    errLarge: 'The file is too large to process. Try a shorter recording.',
    errDecode: 'This file could not be decoded. Try MP3, WAV, OGG or M4A.',
    errModel: 'The transcription model could not be loaded. Check your connection and try again.',
    errUnknown: 'An unexpected error occurred.',
    largeFile: 'The file is very large; processing may take a long time and may run out of memory on phones.',
    'violin.outOfRange': '{note}: out of violin range',
    'violin.open': 'open string',
    'violin.where': '{finger} finger, {place}',
    'violin.near': 'in first position',
    'violin.higher': 'higher up',
    'violin.line': '{note}: {string} string, {where}',
    'piano.line': '{note}: {hand} hand, {finger} finger',
    'finger.1': 'index',
    'finger.2': 'middle',
    'finger.3': 'ring',
    'finger.4': 'pinky',
    'pfinger.1': 'thumb',
    'pfinger.2': 'index',
    'pfinger.3': 'middle',
    'pfinger.4': 'ring',
    'pfinger.5': 'pinky',
    'hand.L': 'left',
    'hand.R': 'right',
    'vocal.step': ', {n} semitones from the previous note',
    'vocal.high': 'Some notes are above the typical vocal range (highest: {note}).',
    gap: 'not detected',
    pdfTitle: 'Score',
  },
};

const LANG_KEY = 'muzik-nota-lang';
let current = 'tr';

// Picks Turkish for Turkish browsers and English for everything else.
export function detectLanguage(browserLanguage = globalThis.navigator?.language ?? '') {
  return String(browserLanguage).toLowerCase().startsWith('tr') ? 'tr' : 'en';
}

export function getLanguage() {
  return current;
}

export function setLanguage(lang) {
  current = lang === 'en' ? 'en' : 'tr';
  try {
    localStorage.setItem(LANG_KEY, current);
  } catch {
    // Storage may be blocked; the language still applies for this visit.
  }
}

export function loadLanguage() {
  let saved = null;
  try {
    saved = localStorage.getItem(LANG_KEY);
  } catch {
    // Storage may be blocked; fall back to the browser language.
  }
  setLanguage(saved ?? detectLanguage());
  return current;
}

// Translates a key and fills {placeholders} from params.
export function t(key, params = {}) {
  const text = STRINGS[current][key] ?? STRINGS.en[key] ?? key;
  return text.replace(/\{(\w+)\}/g, (_, name) => (params[name] ?? '').toString());
}
