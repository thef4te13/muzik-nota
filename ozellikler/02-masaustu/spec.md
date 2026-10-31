# 02: Windows masaüstü uygulaması: spec

## Amaç

Müzik → Nota uygulamasını Windows'a standart bir kurulum dosyasıyla kurulabilir hale getirmek. Kullanıcı internete bağlı olmadan analiz yapabilmeli. Mac desteği bu spec'in kapsamında değil; aynı kod tabanıyla sonra eklenecek.

## Kullanıcı hikâyeleri

### P1: Kurulum ve çalıştırma (MVP)

Bir kullanıcı Windows bilgisayarında kurulum dosyasını çalıştırıp uygulamayı kurar, masaüstü kısayoluyla açar ve bir ses dosyasını analiz eder.

**Kabul senaryoları**
- Verilen: kurulum dosyası indirilmiş. Olduğunda: çalıştırılır. O zaman: standart kurulum sihirbazı açılır, uygulama Başlat menüsüne ve masaüstüne kısayol koyar.
- Verilen: uygulama kurulu, internet bağlantısı yok. Olduğunda: uygulama açılır ve bir ses dosyasını analiz eder. O zaman: tüm sonuçlar (nota, PDF, MIDI) normal üretilir.
- Verilen: uygulama açık. Olduğunda: kullanıcı kapatır. O zaman: pencere kapanır, arka planda işlem kalmaz.

### P2: Kendini güncelleme

Uygulama yeni bir sürüm yayınlandığında bunu fark eder, kullanıcıya bildirir ve onay alınca günceller.

**Kabul senaryoları**
- Verilen: daha yeni bir sürüm yayında. Olduğunda: uygulama açılır. O zaman: "Yeni sürüm var" bildirimi gösterilir.
- Verilen: kullanıcı güncellemeyi onaylar. Olduğunda: indirme yapılır, uygulama yeniden başlayınca yeni sürüm çalışır.
- Verilen: güncelleme sunucusuna ulaşılamıyor. Olduğunda: uygulama normal çalışır, hata kullanıcıya rahatsız edici bir pencere olarak gösterilmez.

## Uç durumlar

- Model dosyaları (Basic Pitch, YAMNet, MediaPipe WASM) kurulum paketinin içinde olmalı; dışarıdan indirme yapılmamalı.
- Kurulum yolu Türkçe karakter ya da boşluk içerebilir.
- Uygulama yönetici hakkı istememeli; kullanıcı klasörüne kurulabilmeli.
- Güncelleme sırasında analiz yapılıyorsa kullanıcıya önce analizin bitmesi beklenmeli.

## İşlevsel gereksinimler

- FR-001: Windows x64 için standart kurulum dosyası (NSIS) üretilir.
- FR-002: Uygulama tamamen yerelde çalışır; analiz sırasında dış sunucuya istek yapılmaz.
- FR-003: Model dosyaları paketin içinde yer alır.
- FR-004: Kurulum kullanıcı klasörüne yapılır, yönetici hakkı istenmez.
- FR-005: Başlat menüsü ve masaüstü kısayolu oluşturulur.
- FR-006: Uygulama otomatik güncelleme denetimi yapar ve güncellemeyi kullanıcı onayıyla uygular.
- FR-007: Güncelleme kaynağı bir GitHub yayını (release) olur. Yayın yapılana kadar güncelleme denetimi sessizce atlanır.
- FR-008: Dosya analizi dışında bir özellik (mikrofon, stem ayrıştırma) bu sürümde yoktur.

## Başarı ölçütleri

- SC-001: Kurulum dosyası temiz bir Windows makinesinde kurulur ve uygulama açılır (elle kontrol).
- SC-002: Kurulu uygulama internet kapalıyken bir ses dosyasını analiz eder.
- SC-003: Mevcut 71 test ve build geçmeye devam eder.
- SC-004: Güncelleme denetimi, bir yayın varken yeni sürümü bulur (sahte bir yayınla yerelde denenir).

## Varsayımlar

- Elektron (Electron) kullanılır; mevcut web kodu değişmeden paketlenir.
- Kod imzalama (code signing) bu sürümde yok. Kurulum dosyası imzasız olacağı için Windows SmartScreen uyarısı çıkabilir. İmza sertifikası ayrıca alınmalı.
- Güncelleme yalnızca herkese açık bir GitHub deposunda yayın yapıldığında çalışır; repo yayını ayrı bir onay gerektirir.
- Mac desteği ve mikrofonla gerçek zamanlı kayıt sonraki spec'lerde ele alınır.
