# Lilyum Baskı Atölyesi

Okul atölyeleri ve 3D baskı ürünleri için statik web sitesi + admin paneli. Next.js (`output: "export"`) ile statik HTML üretir, veriler Firebase (Firestore + Auth + Storage) üzerinde tutulur, GitHub Pages'te barınır.

## Kurulum

1. Firebase projesi oluşturun (Firestore, Authentication → Email/Password, Storage açık olmalı).
2. `.env.example` dosyasını `.env` olarak kopyalayıp Firebase Console > Project settings > Web app config değerlerini girin.
3. Firestore'da `admins/{sizin-uid'niz}` dokümanı oluşturun (admin yetkisi bunun üzerinden kontrol edilir).
4. `firestore.rules` ve `storage.rules` içeriğini Firebase Console'daki ilgili kurallara yapıştırın.
5. (Opsiyonel) örnek atölye verisini yüklemek için Firebase Console'dan bir servis hesabı anahtarı indirip proje köküne `serviceAccountKey.json` olarak kaydedin, sonra:

```bash
npm install
npm run db:seed
```

6. Geliştirme sunucusu:

```bash
npm run dev
```

Site: http://localhost:3000
Admin: http://localhost:3000/admin (Firebase Authentication'da oluşturduğunuz e-posta/şifre ile giriş yapılır)

## Statik build ve deploy

```bash
npm run build
```

çıktısı `out/` klasörüne yazılır. `main` branch'e her push'ta `.github/workflows/deploy.yml` bunu otomatik build edip GitHub Pages'e yayınlar (repo Settings → Pages → Source: GitHub Actions olmalı, Firebase config değerleri repo Secrets'a eklenmeli).

## Ne yönetilir?

- Ürün ekleme / düzenleme / silme (görsel yükleme destekli, Firebase Storage)
- Atölye ekleme / düzenleme / yayınlama
- İletişim formu mesajları

Not: Ürün/atölye içerikleri build anında (statik export sırasında) Firestore'dan çekilir. Admin panelden yapılan bir değişikliğin canlı sitede görünmesi için ya "Değişiklikleri Yayınla" butonuyla GitHub Actions'ı elle tetiklemeniz, ya da otomatik zamanlanmış rebuild'i (6 saatte bir) beklemeniz gerekir.

## İletişim formu e-posta bildirimleri

Form mesajları Firestore'daki `contactMessages` koleksiyonuna kaydedilir. `functions/index.js` içindeki `notifyContactMessage` işlevi yeni kayıtları üç adrese Resend üzerinden e-posta olarak yollar. Siteyi GitHub Pages'e dağıtmak bu işlevi dağıtmaz; Firebase Functions ayrıca kurulmalıdır.

1. Firebase projesinde Blaze planını açın. Resend'de gönderen alan adınızı doğrulayın ve bir API anahtarı oluşturun.
2. Proje kökünde `firebase login` ve `firebase use <firebase-project-id>` komutlarıyla doğru projeyi seçin.
3. `cd functions && npm install` komutunu çalıştırın.
4. Proje kökünde `firebase functions:secrets:set RESEND_API_KEY` komutuyla API anahtarını kaydedin.
5. `firebase deploy --only functions:notifyContactMessage` komutunu çalıştırın. CLI `CONTACT_MAIL_FROM` değerini istediğinde doğrulanmış alan adını kullanan bir gönderici girin (ör. `Lilyum <bildirim@alanadiniz.com>`).
6. İletişim formundan bir deneme mesajı gönderip üç posta kutusunu kontrol edin. Gönderim hatalarını Firebase Console > Functions > Logs bölümünde inceleyin.

`RESEND_API_KEY` değerini GitHub Pages secrets veya `NEXT_PUBLIC_` değişkenlerine eklemeyin; yalnızca Firebase Functions secret olarak saklayın.
