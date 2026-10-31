# Müzik → Nota
Bir ses kaydını nota, PDF ve MIDI'ye çeviren masaüstü uygulaması. Analiz bilgisayarınızda yapılır; ses dosyası dışarı gönderilmez.

## Notes
English

Muzik Nota v0.1.0, the first public release.

Turns an audio recording into sheet music (PDF) and MIDI, with a melody or chord mode.
Shows which instruments appear in the file, with their share of time and confidence.
Violin and guitar tab/fingering hints, plus piano and vocal guides.
Turkish and English interface, detected from your system language.
Works offline; audio never leaves your computer.
Windows: standard installer with automatic updates (asks before downloading).
macOS (Intel and Apple Silicon): .dmg and .zip. Not yet tested on a Mac. The app is unsigned, so right-click → Open on first launch. Automatic updates are not available on macOS; download new versions from this page.

Known limits: transcription accuracy depends on the recording. Dense orchestral recordings give rough results. The Windows installer is unsigned, so Windows may show a warning.

Türkçe

Muzik Nota v0.1.0, ilk herkese açık sürüm.

Bir ses kaydını nota (PDF) ve MIDI’ye çevirir; melodi veya akor modu var.
Dosyada hangi enstrümanların bulunduğunu, süre oranı ve güvenle gösterir.
Keman ve gitar için tel/parmak önerileri, piyano ve vokal için yönlendirmeler.
Türkçe ve İngilizce arayüz; sistem diline göre seçilir.
İnternet gerekmez; ses dosyası bilgisayardan dışarı çıkmaz.
Windows: otomatik güncellemeli standart kurulum (indirmeden önce sorar).
macOS (Intel ve Apple Silicon): .dmg ve .zip. Mac’te henüz test edilmedi. Uygulama imzasız; ilk açılışta sağ tık → Aç yapın. macOS’ta otomatik güncelleme yok; yeni sürümleri bu sayfadan indirin.

## Kurulum

- **Windows:** Releases sayfasındaki `Muzik Nota Setup` dosyasını indirip çalıştırın. Kod imzalanmadığı için Windows "bilinmeyen yayıncı" uyarısı gösterebilir; "Yine de çalıştır" seçeneğini kullanın.
- **macOS:** Releases sayfasındaki `.dmg` (veya `.zip`) dosyasını indirin. Uygulama Apple ile imzalanmadığı için ilk açılışta uyarı çıkar: uygulamaya sağ tıklayıp **Aç** seçin. Otomatik güncelleme macOS'ta çalışmaz; yeni sürümleri Releases sayfasından elle indirin.

## Mac sürümü hakkında

**Mac sürümü henüz test edilmedi.** Derleme GitHub Actions'ın macOS makinesinde yapılır, ama uygulamanın Mac'te doğru açılıp çalıştığı henüz doğrulanmadı. Bir Mac'iniz varsa ve deneyebilirseniz, lütfen şunları bildirin:

1. Uygulama açıldı mı? Hangi macOS sürümünde ve hangi işlemci (Intel / Apple Silicon)?
2. Bir ses dosyası analizi tamamlandı mı? Nota, PDF ve MIDI indirilebildi mi?
3. Varsa hata mesajının ekran görüntüsü.

Sorunları [Issues](../../issues) sayfasında paylaşabilirsiniz.

## Geliştirme

```bash
npm install
npm run dev        # tarayıcıda çalıştırma
npm run desktop    # Electron ile çalıştırma
npm run dist:win   # Windows kurulum dosyası
npm run dist:mac   # macOS dosyaları (yalnızca Mac'te)
npm test
```

Lisans: MIT.
