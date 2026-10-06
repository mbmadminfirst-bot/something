# Masalalar tahlili — raqamli tahririyat uslubidagi PDF generator

Bu repozitoriya **masala shartlarini tahririyat (editorial) uslubida tushuntiruvchi PDF hujjat** yasaydi:
shart → kirish/chiqish → cheklovlar → namunalar → tahlil → vizual yechim → qadamlar → kod → murakkablik.

Hujjat `pdfkit` ustida yozilgan kichik layout dvigateli (`tools/kit.mjs`) bilan sahifalanadi:
ustunli toʻrlangan matn, callout bloklari, jadvallar, diagrammalar (kataklar, matritsa, oqim, ustunlar, graf)
va sintaksis rangli C++ kod bloki.

## Tez boshlash

```bash
npm install
npm run build          # -> Masalalar-tahlili.pdf
node tools/build.mjs --out boshqa-nom.pdf
npm run qc             # PDF sahifalarini /tmp/qc/*.png ga rasm qilib chiqaradi
```

## Tuzilma

| Fayl | Vazifasi |
| --- | --- |
| `tools/kit.mjs` | Layout dvigateli: matn, sarlavhalar, callout, jadval, diagramma, kod bloki, muqova, kolontitullar |
| `tools/build.mjs` | Hujjat tuzilishi (qismlar tartibi) va sahifalarga boʻlish |
| `tools/render-pages.mjs` | Nazorat uchun PDF sahifalarini PNG ga chiqaradi |
| `content/site.mjs` | Muqova, sarlavha, muallif, ogohlantirish bloki |
| `content/problems.mjs` | **Masalalar matni va tahlili** — asosiy tahrir qilinadigan fayl |
| `assets/fonts/` | Serif (Source Serif 4), sans (Inter), mono va matematik belgilar (DejaVu) |

## Bitta masala qanday tavsiflanadi

```js
{
  id: 'A', title: '…', titleEn: '…', tag: 'O(n) · Kadane',
  story: ['…'],                       // masala sharti (paragraflar)
  input: ['…'], output: ['…'],        // format tavsiflari
  limits: ['…'],                      // cheklovlar roʻyxati
  samples: [{ in: '…', out: '…', note: '…' }],
  analysis: ['…'],                    // shartni tushunish
  glossary: [['Atama', 'Maʼnosi']],   // lugʻat jadvali
  edges: ['…'],                       // chegaraviy holatlar
  ideaIntro: ['…'],
  diagrams: [{ title: '…', spec: { type: 'cells', values: [...], highlight: [...] } }],
  ideaBlocks: [{ kind: 'idea', title: '…', blocks: ['…', { list: ['…'] }] }],
  walkthrough: { table: {...}, diagrams: [...] },
  code: '…C++…', codeNotes: ['…'],
  complexity: [['Bosqich', 'O(n)', 'O(1)']],
  conclusion: ['…'], takeaway: '…',
}
```

Matn ichida ishlaydigan markup: `**qalin**`, `*kursiv*`, `` `kod` ``, `$formula$` (LaTeX uslubidagi
sodda formulalar avtomatik matnga oʻgiriladi: `\le` → ≤, `10^5` → 10⁵, `dp_{i-1}` → dpᵢ₋₁).

## Diagramma turlari

- `cells` — bir qatorli massiv, ajratilgan kataklar, koʻrsatkichlar va izohlar;
- `steps` — qadam-baqadam massiv holatlari;
- `matrix` — jadval/matritsa (masalan, barcha boʻlaklar);
- `flow` — vertikal yoki gorizontal oqim (algoritm bosqichlari);
- `bars` — taqqoslash ustunlari;
- `nodes` — tugun va qirrali graf sxemasi.

> Eslatma: `content/problems.mjs` dagi hozirgi 4 masala — **namuna/sh ablon** mazmun.
> Haqiqiy masala shartlari bilan almashtirilsa, hujjat shu uslubda qayta chiqadi.
