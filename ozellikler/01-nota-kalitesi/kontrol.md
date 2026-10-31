# 01: Yakınsama kontrolü

| Kriter | Durum | Kanıt |
|---|---|---|
| SC-001: ölçü başına en fazla 4 nota başı | Birim testi var (prepareNotes). Kullanıcı PDF'i ile tarayıcıda elle kontrol edilmedi. | tests/melody.test.js |
| SC-002: melodi modunda ölçü başına en fazla 1 nota başı | Birim testi (melodyOnly, prepareNotes). | tests/melody.test.js |
| SC-003: tüm testler geçer | 70/70 | npx vitest run |
| SC-004: melodi F1 ≥ 0,80 (sentetik) | 0,917 (tek sesli sentetik, 200 nota) | scoreNotes, db3e37a |
| SC-005: kullanıcı kendi kaydını değerlendirir | Kullanıcının kararı; sayısal ölçülemez | — |
| FR-001 akor sınırı | Uygulandı | limitSimultaneous |
| FR-002 enstrüman aralığı | Uygulandı (filtre); gitar/bas/keman modülleri kendi sabitlerini koruyor | ranges.js |
| FR-003 şiddet ve süre eşiği | Uygulandı | filterNotes |
| FR-004 melodi modu | Uygulandı | melodyOnly |
| FR-005 algılanmayan boşluk işareti | Uygulandı, tarayıcıda kontrol edilmedi (gerçek boşluk yok) | gaps.js |
| FR-006/007 enstrüman süre oranı | Uygulandı, birim testi var | summarizeDetections |
| FR-008 seçilen enstrüman aralığı | Uygulandı | rangeFor |
| P4 gerçek enstrüman tespiti | Model yüklendi, pipeline çalıştı. Gerçek piyano/gitar kaydı yok, doğruluk ölçülmedi. | tarayıcı kontrolü |

## Açık kalanlar

- Gerçek enstrüman kaydıyla T019 kabul senaryoları (piyano → "Piyano"; piyano+gitar → iki enstrüman) yapılmadı. Bu kayıt olmadan doğrulanamaz.
- Kullanıcının kendi kaydıyla melodi ve akor sonucu gözden geçirilmedi.
- Ertelenen sorunlar (FR-010 büyük dosya, FR-011 O(n²), FR-012 bağlar, FR-013 MIDI hızı, FR-014 akor tempo, FR-015 boş WAV): ayrı bir spec önerisi olarak bırakıldı (T022).
