# Yo‘l — O‘zbekiston sayohat atlasi

**Har bir yo‘l — yangi bir hikoya.** O‘zbekistonning qadimiy shaharlari, hunarmandchiligi va keng tabiatini o‘zbek tilida, interaktiv va nafis sayohat kundaligi orqali kashf eting.

> Dastlab bo‘sh turgan repozitoriyadan noldan yaratildi. Hech qanday framework, paket yoki API talab qilinmaydi.

## Ishga tushirish

Python 3 bilan:

```bash
python3 -m http.server 4173 --bind 0.0.0.0
```

So‘ng `http://localhost:4173` manzilini oching. Yoki `npm start` buyrug‘idan foydalaning. **O‘rnatish qadami yo‘q.**

Testlar:

```bash
npm test
```

> ES modullari, PWA va offline keshlash ishlashi uchun sahifani HTTP/HTTPS orqali oching; `file://` rejimida ayrim brauzer imkoniyatlari cheklangan bo‘lishi mumkin.

## Nimalar bor?

- **O‘zbekcha, to‘liq moslashuvchan interfeys** — kichik telefondan katta ekrangacha.
- **Kayfiyat bo‘yicha yo‘nalish tavsiyasi** — tarix, tabiat, hunar, sokinlik, sarguzasht yoki shahar ritmini tanlang.
- **8 ta tahrirlangan manzil** — Samarqand, Buxoro, Xiva, Toshkent, Chimyon, Farg‘ona vodiysi, Aydarko‘l va Orolbo‘yi.
- **Qidiruv va mavzu filtrlari** — o‘zbekcha tutuq belgisi/diakritikalaridagi farqlarga chidamli.
- **Bosiladigan sxematik xarita** — manzillarni tanib, yo‘nalishni ko‘ring.
- **Shaxsiy sayohat rejalagichi** — manzil qo‘shing yoki olib tashlang, tartibini o‘zgartiring, tavsiya etilgan kunlarni jamlang. Reja `localStorage`da saqlanadi.
- **Ulashiladigan safar havolasi** — tanlangan reja URL orqali qayta ochiladi; qurilmangiz qo‘llasa, native share oynasi ham ishlaydi.
- **Manzil hikoyalari va mahalliy maslahatlar** — tafsilotli dialog, klaviatura va ekran o‘qigichga mos boshqaruvlar.
- **Tungi ko‘rinish**, `⌘/Ctrl + K` tezkor qidiruvi va chop etishga mos safar rejasi.
- **PWA / offline** — ilova HTTP(S) orqali bir marta yuklangach, statik sahifa, dastur kodi va mahalliy rasmlar service worker keshi orqali internet bo‘lmaganda ham ochiladi.
- **Tashqi kutubxonalarsiz** — faqat brauzer API'lari va JavaScript ES modullari. Google Fonts kelmasa, tizim shriftlariga qaytadi.

## Tuzilishi

```text
index.html          sahifa semantikasi va PWA metamaʼlumotlari
styles.css          responsive dizayn, animatsiyalar, tungi/chop etish ko‘rinishlari
app.js              qidiruv, modal, rejalagich, xarita va ulashish
data.js             manzil maʼlumotlari va sof, test qilinadigan funksiyalar
service-worker.js   app shell va mahalliy rasm keshini boshqarish
manifest.webmanifest
assets/             mahalliy, loyiha uchun yaratilgan rasmlar va ikonka
tests/              Node.js built-in testlari
```

## Maʼlumot va rasmlar haqida

Sayohat davomiyligi — **har bir manzilda qolish uchun taxminiy tavsiya**, yo‘l vaqti yoki masofa emas. Xarita ataylab sxematik chizilgan, geografik yoki navigatsion xarita sifatida ishlatilmasligi kerak. Kirish tartibi, transport, ob-havo, mahalliy sharoit va xavfsizlik maʼlumotlarini safar oldidan tekshiring.

`assets/` ichidagi manzara va hunarmandchilik tasvirlari ushbu demo uchun AI yordamida yaratilgan. Manzil haqidagi matnlar sayohatga ilhom berish uchun yozilgan; mahalliy madaniyat va hudud tarixiga hurmat bilan yondashing.

## O‘zgartirish

Yangi manzil yoki kayfiyat tavsiyasini `data.js`ga qo‘shing. Yangi mahalliy rasm ishlatilsa, yo‘lini `service-worker.js` ichidagi `APP_SHELL` ro‘yxatiga ham kiriting; offline versiyaga yangilanish tarqatish uchun `CACHE_NAME` versiyasini oshiring.
