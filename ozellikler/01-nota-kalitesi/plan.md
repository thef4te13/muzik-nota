# 01: Okunabilir nota çıktısı: plan

Spec: [spec.md](spec.md). Anayasa: [../../anayasa.md](../../anayasa.md).

## Teknik bağlam

- **Dil ve araçlar:** Vanilla JavaScript (ES modülleri), Vite, Vitest. Mevcut proje ile aynı.
- **Mevcut bağımlılıklar:** `@spotify/basic-pitch` (transkripsiyon), VexFlow (nota), jsPDF ve svg2pdf.js (PDF), midi-writer-js (MIDI).
- **Yeni bağımlılık:** `@mediapipe/tasks-audio` (enstrüman tespiti için YAMNet tabanlı AudioClassifier). Model dosyası (`yamnet.tflite`, Apache-2.0) `public/models/` altında barındırılır.
- **Depolama:** Yok. Her şey tarayıcıda, bellekte.
- **Test:** Vitest (birim), tarayıcıda elle kontrol (görsel ve uçtan uca).
- **Hedef:** Modern tarayıcılar, telefon ve masaüstü.

## Anayasa kontrolü

- Gizlilik (1): Yeni model de tarayıcıda çalışır, ses dışarı çıkmaz. Uygun.
- Ücretsiz (2): MediaPipe ve YAMNet ücretsiz ve açık kaynak. Uygun.
- Dürüst sonuç (3): Enstrüman tespiti olasılık olarak gösterilir, kesin deyimler kullanılmaz. Uygun.
- Basitlik (4): Yeni bağımlılık tek (MediaPipe), yalnızca enstrüman tespiti için. Uygun. Melodi seçimi ve gürültü filtresi kendi küçük saf fonksiyonlarımız.
- Doğrulanabilirlik (5): Her görev başarısız testle başlar. Uygun.

## Dosya yapısı

- `src/transcribe/melody.js` (yeni): saf fonksiyonlar. `filterNotes(notes, options)` (şiddet, süre, aralık), `limitSimultaneous(notes, max)`, `melodyOnly(notes)`.
- `src/instruments/detect.js` (yeni): MediaPipe AudioClassifier'ı sarar. `detectInstruments(samples, sampleRate) -> [{label, share, confidence}]`. Saf olan kısım (eşikleme ve süre oranı) ayrı bir fonksiyon, test edilir.
- `src/instruments/ranges.js` (yeni): enstrüman aralıkları (FR-002). Mevcut `guitar.js`, `bass.js`, `violin.js` buradan okur. Mevcut tek tek sabitler korunur.
- `src/render/gaps.js` (yeni): `markGaps(measures, notes)`, algılanmayan boşlukları işaretler (P3).
- `src/render/quantize.js` (değişir): gerekirse `tie` davranışı düzeltilir (FR-012 ertelenmişti, bu planda değil).
- `src/transcribe/basicPitch.js` (değişir): birleştirme O(n²) düzeltmesi (FR-011) ertelenir. Bu plan P1-P4'e odaklanır.
- `src/ui/app.js` (değişir): "Melodi / Akorlar" seçici, enstrüman listesi, boşluk işaretleri.
- `public/models/yamnet.tflite` (yeni, ikili dosya): indirilip bir kez barındırılır.

## Veri modeli

- Nota: `{ start, end, pitch, velocity }` (değişmez).
- Enstrüman tespiti sonucu: `{ label, share, confidence }` dizisi.
- Ayarlar (çalışma zamanında): `maxSimultaneous` (varsayılan 4), `mode` (`melody` | `chords`), `minVelocity`, `minDurationMs` (60).

## Dış sözleşmeler

- `detectInstruments` yalnızca yerel `public/models/` dosyasını okur. Ağ isteği yok (anayasa 1).
- Model dosyası yoksa tespit sessizce atlanmaz: UI "Enstrüman tespiti yapılamadı" mesajı gösterir, transkripsiyon yine çalışır.

## Araştırma kararları

- **Neden YAMNet / MediaPipe:** AudioSet'te piyano, gitar, bas, keman, vokal sınıfları var. Ücretsiz, tarayıcıda çalışır. Alternatif: yalnızca perde aralığına bakan sezgisel yöntem; güvenilir değil, reddedildi.
- **Neden melodi seçimi kural tabanlı:** Basit ve test edilebilir. Makine öğrenmesiyle melodi ayrımı bu kapsamın dışında; SC-004 ile ölçülecek.
- **Neden sentetik F1 ölçütü:** Gerçek kayıtların doğru notaları bilinmiyor. Bilinen MIDI'den sentez, ölçülebilir tek yol.
- **Risk:** Model dosyasını indirmek için ağ erişimi gerekebilir. Erişim yoksa kullanıcıdan dosyayı almak gerekir.

## Görev sırası

Görev listesi: [gorevler.md](gorevler.md).
