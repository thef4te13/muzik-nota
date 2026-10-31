# 01: Okunabilir nota çıktısı: görevler

Her görev bir test önce kırmızı görür, sonra yeşile döner. Her hikâye sonunda tarayıcıda kabul senaryosu kontrol edilir.

## Temel (hepsinden önce)

- [ ] T001 `src/transcribe/melody.js` iskeleti ve `filterNotes` için başarısız testler (tests/melody.test.js)
- [ ] T002 `filterNotes`: şiddet eşiği ve 60 ms kısa nota eleme (FR-003)
- [ ] T003 `limitSimultaneous`: her onset için en fazla N perde, en düşük şiddetliler atılır (FR-001)
- [ ] T004 `src/instruments/ranges.js`: gitar, bas, keman, vokal aralıkları (FR-002), mevcut modüllerin aralıklarını buraya bağla
- [ ] T005 `filterNotes` içine aralık filtresi ekle, enstrümana göre (FR-002)

## P1: Gürültüsüz akorlar (MVP)

- [ ] T006 [P1] Bütün şarkının PDF'i için uçtan uca birim testi: sentetik 4 perdeli akorlarda ölçü başına en fazla 4 nota başı (SC-001)
- [ ] T007 [P1] `app.js`: gürültü filtresini PDF üretiminden önce uygula, ayar değerleri varsayılanla (4, 0.3 şiddet, 60 ms)
- [ ] T008 [P1] Sessiz kayıt: "Nota bulunamadı" mesajı, boş ölçü sayfası üretme (kabul senaryosu)
- [ ] T009 [P1] Tarayıcıda kontrol: test kaydı (sentetik) ve kullanıcı PDF'i karşılaştırması, ledger çizgisi üç satırı geçmiyor

## P2: Melodi modu

- [ ] T010 [P2] `melodyOnly`: her onset için en yüksek perdeyi tut (FR-004), birim testi
- [ ] T011 [P2] `app.js`: "Melodi / Akorlar" seçici, varsayılan Melodi (SC-002)
- [ ] T012 [P2] Sentetik F1 ölçütü: bilinen MIDI'den sentez, melodi F1 ≥ 0.80 (SC-004). Test betiği `scripts/`, Vitest dışında.

## P3: Algılanmayan boşluklar

- [ ] T013 [P3] `src/render/gaps.js`: `markGaps` 4 saniyeden uzun boşlukları işaretler (FR-005), birim testi
- [ ] T014 [P3] Ölçü üstünde "algılanmadı" etiketi (VexFlow metni), tarayıcıda kontrol

## P4: Enstrüman tespiti (kullanıcı talebi)

- [ ] T015 [P4] `detect.js` saf kısmı: pencere olasılıklarından süre oranı ve eşikleme (FR-006, FR-007), birim testi
- [ ] T016 [P4] Model dosyasını indir ve `public/models/yamnet.tflite` olarak barındır (ağ erişimi gerekir, yoksa kullanıcıdan iste)
- [ ] T017 [P4] `detect.js` MediaPipe sarmalayıcı: `detectInstruments`, model yoksa anlaşılır hata
- [ ] T018 [P4] `app.js`: enstrüman listesi (süre oranı ve güven) ve seçilen enstrüman aralığını P1 filtresine bağla (FR-008)
- [ ] T019 [P4] Tarayıcıda kontrol: tek piyano kaydı → "Piyano" en üstte; piyano + gitar kaydı → iki enstrüman listede (kabul senaryoları)

## Son

- [ ] T020 Tüm testler (49 + yeni) geçer, build temiz (SC-003)
- [ ] T021 Yakınsama kontrolü: spec ↔ kod, eksik ya da fazlalar `kontrol.md`'ye, gerekirse yeni görev
- [ ] T022 Ertelenmiş sorunlar (FR-010 büyük dosya, FR-011 O(n²), FR-012 bağlar, FR-013 MIDI hızı, FR-014 akor tempo, FR-015 boş WAV) için ayrı bir spec önerisi
