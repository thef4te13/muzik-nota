# 01: Okunabilir nota çıktısı

## Sorun

Kullanıcının PDF'inde (8 sayfa) notalar okunamıyor. Çoğu ölçüde yüzlerce ledger çizgisi ve dikey çubuk var, birçok nota başı içi boş kutu gibi çiziliyor, bağlar üst üste biniyor. Bazı ölçüler neredeyse boş.

Olası nedenler (ekran görüntüsünden çıkarıldı, doğrulanmadı):
- Transkripsiyon, asıl notaların harmoniklerini de ayrı nota olarak algılıyor, bunlar aynı anda akor yapılıyor.
- Perde aralığı enstrümanın dışına taşıyor, bu da ledger çizgilerini çoğaltıyor.
- Ritim kuantizasyonu, çok sayıda kısa notayı üst üste bindiriyor.

## Kullanıcı hikâyeleri

**P1 (MVP): Gürültüsüz akorlar.** Kullanıcı bir kayıt yükler ve okunabilir bir PDF alır: her anda en fazla 4 perde, enstrüman aralığı dışındaki perdeler yok.
- Kabul: Verilen 134 saniyelik test kaydı için PDF'te bir ölçüde en fazla 4 nota başı olur ve ledger çizgisi üç satırı geçmez.
- Kabul: Kayıt sessizken PDF "Nota bulunamadı" der, boş ölçülerle dolu bir sayfa üretmez.

**P2: Ana melodi modu.** Kullanıcı "Melodi" seçeneğini açarsa, her an için yalnızca en yüksek ve en güçlü perde yazılır.
- Kabul: Melodi modunda, aynı kayıt için bir ölçüde en fazla bir nota başı olur.

**P3: Algılanamayan bölümleri işaretle.** Notaların bulunmadığı uzun aralıklar PDF'te sessizce boş bırakılmaz, "algılanmadı" diye işaretlenir.
- Kabul: 4 saniyeden uzun boşlukta ölçünün üstünde "algılanmadı" yazısı çıkar.

## Diğer bilinen sorunlar (incelemede bulundu, ertelenmişti)

- FR-010: Büyük dosyalarda (100 MB üstü) tüm dosya tek seferde çözülüyor. Kısmi sonuç yok.
- FR-011: Nota birleştirme O(n²). Uzun kayıtlarda yavaşlatıyor.
- FR-012: Ölçü çizgisini geçen bağlar kopuk çiziliyor.
- FR-013: MIDI'de hız 0 olabilir, bazı oynatıcılarda nota kapanıyor.
- FR-014: Akorlar tempo tahminini bozuyor.
- FR-015: Sıfır uzunluklu WAV "çözülemedi" diyor, "nota bulunamadı" demeli.

Bu sorunlar P1-P3'ten sonra, öncelik sırasıyla ele alınır.

## İşlevsel gereksinimler

- FR-001: Her onset anında, eşzamanlı perde sayısı ayar değeriyle (varsayılan 4) sınırlanır. Sınırın dışındaki perdeler en düşük şiddetliler olarak atılır.
- FR-002: Perdeler seçilen enstrümanın aralığına göre filtrelenir. Gitar için MIDI 40-79, bas için 28-63, keman için 55-100, vokal için 48-84.
- FR-003: Şiddeti eşikten düşük ya da 60 ms'den kısa notalar atılır.
- FR-004: Melodi modu açıkken her onset için en yüksek perde tutulur.
- FR-005: Atılan ya da algılanmayan 4 saniyeden uzun aralıklar işaretlenir.

## Başarı ölçütleri

- SC-001: Test kaydında PDF'te her ölçüde en fazla 4 nota başı.
- SC-002: Melodi modunda her ölçüde en fazla 1 nota başı.
- SC-003: Tüm mevcut birim testleri geçer (şu an 49).
- SC-004 ve SC-005: Yukarıda, "Doğruluk ölçütü" bölümünde.

## Varsayımlar

- Test kayıtları tek enstrümanlı sentetik seslerdir. Gerçek kayıt davranışı farklı olabilir.
- Eşikler (şiddet, 4 perde, 60 ms) ilk tahmindir ve kullanıcı kaydıyla ayarlanır.

## Kullanıcı yanıtları (netleşen kararlar)

1. **Kayıt türü:** Tek enstrüman kayıtları. Ayrıca dosyadaki bütün sesler analiz edilip hangi enstrümanların bulunduğu gösterilir (P4).
2. **Çıktı sırası:** Önce ana melodi, sonra akor seçeneği. Akor modu P1'in kapsamında değil, ikinci aşamada.
3. **Doğruluk:** Kullanıcı, kendi kaydındaki notaların hepsinin doğru çıkmasını istiyor. Bu, AI transkripsiyonunda hatasız olarak garanti edilemez. Bu yüzden kabul ölçütü ölçülebilir hale getirildi (aşağıda).

## P4: Enstrüman tespiti (kullanıcı talebi)

Dosyanın tamamı analiz edilir ve bulunan enstrümanlar listelenir: her biri için süre oranı ve güven değeri.
- Kabul: Yalnızca piyano içeren bir kayıtta "Piyano" en üstte çıkar ve diğer enstrümanlar listede yer almaz ya da düşük güvenle görünür.
- Kabul: Gitar ve vokal içeren bir kayıtta iki enstrüman da listelenir, sürelerle birlikte.
- Enstrüman tespiti tarayıcıda yapılır (anayasa 1 ve 2). Önerilen yöntem: YAMNet (TF.js, AudioSet sınıfları, ücretsiz).

## Ek işlevsel gereksinimler

- FR-006: Dosya, YAMNet ile 0,96 saniyelik pencerelerle sınıflandırılır. Enstrüman sınıfları (Piano, Guitar, Bass guitar, Violin, Singing, Drum vb.) için pencere başına olasılıklar üretilir.
- FR-007: Bir enstrüman, olasılığı eşiğin (ilk tahmin: 0,3) üstünde olan pencerelerin oranı ile listelenir.
- FR-008: Tespit edilen enstrüman seçildiğinde nota aralığı ve tab/nota görünümü o enstrümana göre ayarlanır.

## Doğruluk ölçütü (ölçülebilir)

- SC-004: Sentetik kanıt: bilinen nota listesinden (MIDI) üretilen ses kaydında, melodi notalarının F1 skoru (perde ve başlangıç ±50 ms) en az 0,80 olur.
- SC-005: Kullanıcının kendi kaydı için "doğru" tanımı kullanıcının kendi değerlendirmesidir. Biz bunu sayısal olarak ölçemeyiz; kullanıcı kaydı ile sonuç PDF'i birlikte paylaşıldığında gözden geçirilir.
- Hepsinin doğru çıkması (yüzde 100) hedeflenmez; SC-004 ile ölçülebilir bir kalite alt sınırı tanımlanır.
