# Müzik → Nota

Bir ses kaydını nota, PDF ve MIDI'ye çeviren masaüstü uygulaması. Analiz bilgisayarınızda yapılır; ses dosyası dışarı gönderilmez.

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
