// content/problems.mjs — NAMUNA tarkib (shablon).
// Haqiqiy 4 ta masala shartlari bilan almashtiriladi (rasm yuklangach).
import { C } from '../tools/kit.mjs';

export const problems = [
  /* ==================================================================== A === */
  {
    id: 'A',
    title: 'Eng katta yigʻindi',
    titleEn: 'Maximum Subarray Sum',
    tag: 'O(n) · Kadane',
    subtitle: 'Massivdagi ketma-ket keluvchi boʻlaklarning eng katta yigʻindisini toping.',
    chips: [{ text: 'Boshlovchi', kind: 'meta' }, { text: 'Dinamik programmalash', kind: 'tag' }, { text: '1 soniya', kind: 'ok' }],
    stats: [
      { label: 'Vaqt chegarasi', value: '1.0 s' },
      { label: 'Xotira', value: '256 MB' },
      { label: 'Kirish', value: 'stdin' },
      { label: 'Chiqish', value: 'stdout' },
    ],
    story: [
      'Sizga uzunligi $n$ boʻlgan $a_1, a_2, \\dots, a_n$ butun sonlar massivi berilgan. Massivda kamida bitta elementdan iborat boʻlgan **ketma-ket** (uzluksiz) boʻlakning yigʻindisini hisobga olamiz.',
      'Shunday boʻlakni tanlangki, uning elementlari yigʻindisi **maksimal** boʻlsin. Javob sifatida faqat shu maksimal yigʻindining oʻzini chiqaring.',
    ],
    storyExtra: [
      'Boʻlak uzluksiz boʻlishi shart: elementlarni tashlab ketish yoki joyini almashtirish mumkin emas. Boʻlak uzunligi $1$ dan $n$ gacha boʻlishi mumkin.',
    ],
    input: [
      'Birinchi qatorda bitta butun son — $n$ ($1 \\le n \\le 2 \\cdot 10^5$).',
      'Ikkinchi qatorda $n$ ta butun son — $a_i$ ($-10^9 \\le a_i \\le 10^9$).',
    ],
    output: ['Bitta butun son — maksimal boʻlak yigʻindisi.'],
    limits: [
      '$1 \\le n \\le 2 \\cdot 10^5$',
      '$-10^9 \\le a_i \\le 10^9$ — yigʻindi 64-bitli butun songa sigʻadi',
      'Vaqt chegarasi $1$ s, xotira $256$ MB',
    ],
    samples: [
      {
        in: '5\n2 -1 3 -2 4',
        out: '6',
        note: 'Eng yaxshi boʻlak: $[3, -2, 4]$ — indekslari $3..5$, yigʻindisi $3 + (-2) + 4 = 6$.',
      },
      {
        in: '4\n-5 -2 -8 -1',
        out: '-1',
        note: 'Barcha sonlar manfiy. Boʻlak boʻsh boʻlmasligi kerak, shuning uchun javob eng katta sonning oʻzi: $-1$.',
      },
    ],
    analysis: [
      'Masalaning eng muhim sharti — boʻlak **uzluksiz** boʻlishi. Agar uzluksizlik talabi boʻlmasa, javob oddiygina barcha musbat sonlar yigʻindisi boʻlardi. Lekin bu yerda manfiy sonlar ham boʻlak ichida qolib ketishi mumkin.',
      'Ikkinchi nozik joy: boʻlak boʻsh boʻlishi mumkin emas (uzunligi kamida $1$). Shuning uchun massivda faqat manfiy sonlar boʻlsa, javob $0$ emas, balki eng katta elementdir.',
    ],
    glossary: [
      ['Ketma-ket boʻlak', 'Indekslari $l \\le r$ boʻlgan $a_l, a_{l+1}, \\dots, a_r$ elementlar toʻplami.'],
      ['Yigʻindi', '$\\sum_{i=l}^{r} a_i$ — boʻlak elementlarining algebraik yigʻindisi.'],
      ['O(n) yechim', 'Har bir elementga oʻrtacha bir marta murojaat qiladigan yechim.'],
    ],
    edges: [
      '$n = 1$: javob $a_1$ ning oʻzi.',
      'Barcha elementlar manfiy: javob $0$ emas, eng katta element.',
      'Yigʻindi $2 \\cdot 10^5 \\times 10^9 = 2 \\cdot 10^{14}$ gacha yetadi — `int` yetmaydi, `long long` kerak.',
      'Javob nol boʻlishi ham mumkin (masalan, $[-1, 0, -1]$ uchun $0$).',
    ],
    ideaIntro: [
      'Massivni chapdan oʻngga bir marta oʻtamiz va har bir pozitsiyada bitta savolga javob beramiz: *$i$-element bilan tugaydigan eng katta yigʻindi qanday?* Bu qiymatni $dp_i$ deb belgilaymiz.',
    ],
    diagrams: [
      {
        title: 'Gʻoyaning koʻrinishi: $dp_i$ qanday hisoblanadi',
        spec: {
          type: 'cells',
          values: ['2', '-1', '3', '-2', '4'],
          highlight: [{ i: 2, fill: C.hotSoft, stroke: C.hot, textColor: C.hot, label: 'i-element' }],
          pointers: [{ i: 2, text: '$dp_i = \\max(a_i,\\; dp_{i-1} + a_i) = \\max(3,\\; 1 + 3) = 4$', color: C.hot }],
          caption: 'Har bir element uchun oldingi holat bilan yangi boshlash solishtiriladi.',
        },
      },
      {
        title: 'Uzluksiz boʻlaklar daraxti (n = 4)',
        spec: {
          type: 'matrix',
          colLabels: ['l = 1', 'l = 2', 'l = 3', 'l = 4'],
          rowLabels: ['r = 1', 'r = 2', 'r = 3', 'r = 4'],
          rows: [
            ['2', '—', '—', '—'],
            ['1', '-1', '—', '—'],
            ['4', '2', '3', '—'],
            ['2', '0', '1', '-2'],
          ],
          highlight: [{ r: 2, c: 0, fill: C.greenSoft, stroke: C.green, textColor: C.green }, { r: 3, c: 0 }, { r: 3, c: 1 }],
        },
        caption: 'Barcha $O(n^2)$ boʻlaklarni sanab chiqish mumkin, lekin $n = 2 \\cdot 10^5$ da bu juda sekin.',
      },
      {
        title: 'Solishtirish: boʻlaklar soni va vaqt',
        spec: {
          type: 'bars',
          labels: ['O(n²) sanash', 'O(n log n)', 'O(n) Kadane'],
          values: [100, 62, 41],
          highlight: [2],
          caption: 'Ustun balandligi — ish hajmining nisbiy oʻlchovi (mantiqiy taqqoslash uchun shartli).',
        },
      },
    ],
    ideaBlocks: [
      {
        kind: 'idea',
        title: 'Rekurent formula',
        blocks: [
          'Har bir $i$ uchun: $dp_i = \\max(a_i,\\; dp_{i-1} + a_i)$, javob esa $\\max_i dp_i$.',
          { list: ['$a_i$ ni tanlash — boʻlakni shu yerdan **yangi boshlash**;', '$dp_{i-1} + a_i$ — boʻlakni **davom ettirish**.'] },
        ],
      },
      {
        kind: 'proof',
        title: 'Nega bu toʻgʻri ishlaydi',
        blocks: [
          '$i$-element bilan tugaydigan har qanday optimal boʻlak yo $a_i$ ning oʻzidan, yo $i-1$ bilan tugaydigan qandaydir boʻlakka $a_i$ ni qoʻshishdan hosil boʻladi. Ikkinchi holda eng yaxshisi $dp_{i-1}$ boʻladi — bu induksiya bilan isbotlanadi.',
        ],
      },
    ],
    walkthrough: {
      intro: ['Quyidagi jadvalda har bir qadamdagi $dp$ qiymati va joriy javob koʻrsatilgan.'],
      table: {
        headers: ['i', 'a[i]', 'dp[i] = max(a[i], dp[i-1]+a[i])', 'javob'],
        widths: [40, 60, 280, 157],
        rows: [
          ['1', '2', 'max(2, — ) = 2', '2'],
          ['2', '-1', 'max(-1, 2-1) = 1', '2'],
          ['3', '3', 'max(3, 1+3) = 4', '4'],
          ['4', '-2', 'max(-2, 4-2) = 2', '4'],
          ['5', '4', 'max(4, 2+4) = 6', '**6**'],
        ],
      },
      diagrams: [
        {
          title: 'Qadamlar ketma-ketligi',
          spec: {
            type: 'steps',
            labelW: 92,
            steps: [
              { title: 'dp ni boshlash', values: ['2', '·', '·', '·', '·'], highlight: [{ i: 0 }], note: '$dp_1 = a_1 = 2$, javob $= 2$' },
              { title: 'i = 2', values: ['2', '1', '·', '·', '·'], highlight: [{ i: 1 }], note: 'davom ettirish foydali ($2 + (-1) = 1 > -1$)' },
              { title: 'i = 3', values: ['2', '1', '4', '·', '·'], highlight: [{ i: 2 }], note: '$1 + 3 = 4$, yangi maksimum' },
              { title: 'i = 4', values: ['2', '1', '4', '2', '·'], highlight: [{ i: 3 }], note: 'manfiy, lekin boʻlakni uzmaslik kerak' },
              { title: 'i = 5', values: ['2', '1', '4', '2', '6'], highlight: [{ i: 4 }], note: 'javob yangilanadi: $6$' },
            ],
          },
        },
      ],
    },
    codeIntro: ['Kod bir marta chapdan oʻngga oʻtadi va faqat bitta oʻzgaruvchini saqlaydi.'],
    code: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;
    long long cur = 0, best = LLONG_MIN;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        // yangi boʻlak boshlash yoki eskisini davom ettirish
        cur = max(x, cur + x);
        best = max(best, cur);
    }
    cout << best << "\\n";
    return 0;
}`,
    codeNotes: [
      '`LLONG_MIN` — barcha sonlar manfiy boʻlgan holatni toʻgʻri qamrab oladi.',
      '`long long` majburiy: yigʻindi $2 \\cdot 10^{14}$ gacha yetadi.',
    ],
    complexity: [
      ['Massivni oʻqish va hisoblash', '$O(n)$', '$O(1)$'],
      ['Umumiy', '$O(n)$', '$O(1)$'],
    ],
    conclusion: [
      'Kadane algoritmi — dinamik programmalashning eng ixcham namunalaridan biri: holat soni bitta, oʻtish esa $O(1)$. $2 \\cdot 10^5$ element uchun bu yechim vaqt chegarasidan bir necha marta tez ishlaydi.',
    ],
    takeaway: '«Eng katta uzluksiz boʻlak» koʻrsangiz — $dp_i$ = $i$ bilan tugaydigan eng katta yigʻindi, deb oʻylang.',
  },

  /* ==================================================================== B === */
  {
    id: 'B',
    title: 'Sonni topish',
    titleEn: 'Guess the Number',
    tag: 'O(log n) · binar qidiruv',
    subtitle: 'Har bir soʻrov «kattami / kichikmi / tengmi» javobini beradi — sonni $\\le 60$ soʻrovda toping.',
    chips: [{ text: 'Interaktiv', kind: 'warn' }, { text: 'Binar qidiruv', kind: 'tag' }],
    story: [
      'Yashirin $x$ butun soni $[1, 10^9]$ oraliqda joylashgan. Siz soʻrov sifatida bitta $q$ butun sonni yuborishingiz mumkin va hakam javoban $<$, $>$ yoki $=$ belgisini qaytaradi.',
      'Sonni topgach, uning oʻzini chiqaring. Soʻrovlar soni cheklangan.',
    ],
    input: ['Hakam sizning soʻrovingizga nisbatan taqqoslash natijasini beradi.'],
    output: ['Son topilganda uni yuborish kerak.'],
    limits: ['$1 \\le x \\le 10^9$', 'Soʻrovlar soni $\\le 60$'],
    samples: [{ in: '? 500000000', out: '<', note: 'Yashirin son $5 \\cdot 10^8$ dan kichik.' }],
    analysis: [
      '$10^9$ ta nomzod bor. Har bir soʻrovda biz nomzodlar toʻplamini **ikkiga** boʻlamiz: son oʻrtadan kichik boʻlsa — oʻng yarim, katta boʻlsa — chap yarim.',
    ],
    ideaIntro: ['Binar qidiruv klassik koʻrinishda: oraliqni doim ikkiga boʻlamiz.'],
    diagrams: [
      {
        title: 'Oraliqning qisqarishi',
        spec: {
          type: 'flow',
          dir: 'row',
          boxes: [
            { label: '10⁹ nomzod', sub: '1-soʻrov' },
            { label: '5·10⁸', sub: '2-soʻrov' },
            { label: '2.5·10⁸', sub: '3-soʻrov' },
            { label: '1 nomzod', sub: '≈ 30-soʻrov' },
          ],
        },
      },
    ],
    ideaBlocks: [
      { kind: 'note', title: 'Nega 30 ta soʻrov yetadi', blocks: ['$\\log_2 10^9 \\approx 29.9$, yaʼni $30$ soʻrovda oraliq bitta songa qadar qisqaradi. $60$ soʻrov — ikki barobar zaxira.'] },
    ],
    walkthrough: {
      intro: ['`lo` va `hi` chegaralari orasida qidiriladi. Har qadamda oraliq oʻrtasi tekshiriladi va yarmi tashlab yuboriladi. Quyida $x = 6$ uchun qidiruv:'],
      table: {
        headers: ['Qadam', 'lo', 'hi', 'mid', 'javob', 'yangi oraliq'],
        widths: [52, 70, 70, 90, 80, 175],
        rows: [
          ['1', '1', '100', '50', '<', '1 … 49'],
          ['2', '1', '49', '25', '<', '1 … 24'],
          ['…', '…', '…', '…', '…', 'har qadamda ikki marta kichrayadi'],
          ['30', '6', '6', '6', '**=**', 'topildi'],
        ],
      },
      diagrams: [{
        title: 'Nomzodlar soni qanday kamayadi',
        spec: {
          type: 'bars',
          labels: ['10⁹', '5·10⁸', '2.5·10⁸', '1'],
          values: [100, 50, 25, 1],
          highlight: [3],
          caption: 'Har bir soʻrovdan keyin nomzodlar soni ikki marta kamayadi — $\log_2 n$ qadam.',
        },
      }],
    },
    code: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int lo = 1, hi = 1000000000;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        cout << "? " << mid << endl;
        char ans;
        cin >> ans;
        if (ans == '=') return 0;
        if (ans == '<') hi = mid - 1;
        else lo = mid + 1;
    }
    return 0;
}`,
    complexity: [['Binar qidiruv', '$O(\\log n)$', '$O(1)$']],
    conclusion: ['Interaktiv masalalarda muhim shart — har bir soʻrovdan keyin `endl` (yoki `flush`) yuborish, aks holda dastur «osilib» qoladi.'],
    takeaway: 'Har bir soʻrov nomzodlar sonini kamida ikki marta kamaytirsa, $\\log_2 n$ soʻrov yetadi.',
  },

  /* ==================================================================== C === */
  {
    id: 'C',
    title: 'Oraliq yigʻindilari',
    titleEn: 'Range Sum Queries',
    tag: 'O(n + q) · prefiks',
    subtitle: '$q$ ta «$l$ dan $r$ gacha yigʻindi» soʻroviga tez javob bering.',
    chips: [{ text: 'Prefiks yigʻindi', kind: 'tag' }, { text: '$q \\le 2\\cdot10^5$', kind: 'meta' }],
    stats: [
      { label: 'n', value: '≤ 2·10⁵' },
      { label: 'q', value: '≤ 2·10⁵' },
      { label: 'Naive', value: 'O(n·q)' },
      { label: 'Yechim', value: 'O(n + q)' },
    ],
    story: [
      '$n$ ta butun son va $q$ ta soʻrov beriladi. Har bir soʻrov uchun $\\sum_{i=l}^{r} a_i$ ni hisoblang.',
    ],
    input: ['Birinchi qator: $n$ va $q$.', 'Ikkinchi qator: $n$ ta son.', 'Keyingi $q$ qatorda: $l$ va $r$.'],
    output: ['Har bir soʻrov uchun bitta qator — oraliq yigʻindisi.'],
    limits: ['$1 \\le n, q \\le 2 \\cdot 10^5$', '$|a_i| \\le 10^9$'],
    samples: [{ in: '5 2\n1 2 3 4 5\n2 4\n1 5', out: '9\n15', note: '$a_2 + a_3 + a_4 = 2 + 3 + 4 = 9$.' }],
    analysis: ['Har bir soʻrovda oraliqni toʻgʻridan-toʻgʻri yigʻish $O(n)$, $q$ ta soʻrov uchun $O(nq)$ — eng yomon holatda $4 \\cdot 10^{10}$ amal.'],
    ideaIntro: ['$pref_k = a_1 + \\dots + a_k$ prefiks massivini bir marta hisoblaymiz; shunda javob bitta ayirish bilan topiladi.'],
    diagrams: [
      {
        title: 'Prefiks massivining maʼnosi',
        spec: {
          type: 'cells',
          values: ['1', '3', '6', '10', '15'],
          highlight: [{ i: 4, fill: C.greenSoft, stroke: C.green, textColor: C.green, label: 'pref[r]' }, { i: 0, fill: C.hotSoft, stroke: C.hot, textColor: C.hot, label: 'pref[l-1]' }],
          pointers: [{ i: 2, text: 'javob = pref[r] − pref[l−1]', color: C.accent }],
        },
      },
    ],
    ideaBlocks: [{ kind: 'idea', title: 'Kalit formula', blocks: ['$\\sum_{i=l}^{r} a_i = pref_r - pref_{l-1}$, bunda $pref_0 = 0$.'] }],
    code: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    vector<long long> pref(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        long long x;
        cin >> x;
        pref[i] = pref[i - 1] + x;
    }
    while (q--) {
        int l, r;
        cin >> l >> r;
        cout << pref[r] - pref[l - 1] << "\\n";
    }
    return 0;
}`,
    complexity: [['Prefiks hisoblash', '$O(n)$', '$O(n)$'], ['Bir soʻrov', '$O(1)$', '$O(1)$'], ['Umumiy', '$O(n + q)$', '$O(n)$']],
    conclusion: ['Prefiks texnikasi — statik massivda oraliq yigʻindisining eng tez usuli. Massiv oʻzgarsa, segment daraxti yoki Fenwick daraxti kerak boʻladi.'],
    takeaway: 'Qoʻshish ayirishga aylanadigan har qanday «oraliq» soʻrovida prefiksni eslang.',
  },

  /* ==================================================================== D === */
  {
    id: 'D',
    title: 'Labirintdagi eng qisqa yoʻl',
    titleEn: 'Shortest Path in a Grid',
    tag: 'O(n·m) · BFS',
    subtitle: 'Toʻsiqlar bor $n \\times m$ katakli maydonda eng qisqa yoʻl uzunligini toping.',
    chips: [{ text: 'Graf nazariyasi', kind: 'tag' }, { text: 'BFS', kind: 'ok' }],
    story: [
      '$n \\times m$ oʻlchamdagi maydon berilgan: `.` — boʻsh katak, `#` — toʻsiq, `S` — start, `F` — finish. Har qadamda yuqoriga, pastga, chapga yoki oʻngga qoʻshni katakka oʻtish mumkin.',
      'Startdan finishga boradigan eng qisqa yoʻl uzunligini toping (qadamlar soni). Yoʻl boʻlmasa $-1$ chiqaring.',
    ],
    input: ['Birinchi qatorda $n$ va $m$.', 'Keyingi $n$ qatorda uzunligi $m$ boʻlgan satrlar.'],
    output: ['Bitta butun son — qadamlar soni yoki $-1$.'],
    limits: ['$1 \\le n, m \\le 10^3$', 'Barcha qadamlar narxi $1$'],
    samples: [
      { in: '3 4\nS..#\n.#..\n...F', out: '5', note: 'BFS qatlamlari boʻyicha: startdan $5$ qadamda finishga yetiladi.' },
      { in: '1 4\nS#.F', out: '-1', note: 'Yoʻl toʻsilgan.' },
    ],
    analysis: ['Barcha qirralar narxi $1$ boʻlgani uchun eng qisqa yoʻlni **kenglik boʻyicha qidirish (BFS)** topadi. Dijkstra shart emas.'],
    ideaIntro: ['BFS kataklarni toʻlqin kabi qatlamlarga ajratadi: $k$-qatlamdagi kataklar startdan aynan $k$ qadam uzoqda.'],
    diagrams: [
      {
        title: 'BFS toʻlqini',
        spec: {
          type: 'flow',
          dir: 'col',
          boxes: [
            { label: 'S — start', sub: 'navbatga qoʻyiladi (qatlam 0)' },
            { label: 'Qoʻshnilar', sub: 'qatlam 1' },
            { label: 'Ularning qoʻshnilari', sub: 'qatlam 2' },
            { label: 'F — finish', sub: 'masofa yoziladi' },
          ],
        },
      },
      {
        title: 'Graf sifatida koʻrinishi',
        spec: {
          type: 'nodes',
          height: 150,
          nodes: [
            { id: 's', x: 0, y: 0.5, label: 'S', fill: C.greenSoft, stroke: C.green, color: C.green },
            { id: 'a', x: 0.33, y: 0, label: 'a' },
            { id: 'b', x: 0.33, y: 1, label: 'b' },
            { id: 'f', x: 0.66, y: 0.5, label: 'F', fill: C.hotSoft, stroke: C.hot, color: C.hot },
          ],
          edges: [
            { from: 's', to: 'a' }, { from: 's', to: 'b' },
            { from: 'a', to: 'f', label: 'dist = 2' }, { from: 'b', to: 'f', label: 'dist = 2' },
          ],
        },
      },
    ],
    ideaBlocks: [{ kind: 'warn', title: 'Diqqat', blocks: ['BFS ni faqat navbatdan chiqqan katak uchun belgilash kerak (yoki navbatga qoʻyishda darhol belgilash) — aks holda bir katak navbatga bir necha marta tushadi va yechim sekinlashadi.'] }],
    code: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (auto &row : g) cin >> row;
    pair<int,int> s{-1,-1}, f{-1,-1};
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++) {
            if (g[i][j] == 'S') s = {i, j};
            if (g[i][j] == 'F') f = {i, j};
        }
    vector<vector<int>> dist(n, vector<int>(m, -1));
    queue<pair<int,int>> q;
    dist[s.first][s.second] = 0;
    q.push(s);
    int dx[] = {1, -1, 0, 0}, dy[] = {0, 0, 1, -1};
    while (!q.empty()) {
        auto [x, y] = q.front();
        q.pop();
        for (int d = 0; d < 4; d++) {
            int nx = x + dx[d], ny = y + dy[d];
            if (nx < 0 || ny < 0 || nx >= n || ny >= m) continue;
            if (g[nx][ny] == '#' || dist[nx][ny] != -1) continue;
            dist[nx][ny] = dist[x][y] + 1;
            q.push({nx, ny});
        }
    }
    cout << dist[f.first][f.second] << "\\n";
    return 0;
}`,
    complexity: [['BFS', '$O(n \\cdot m)$', '$O(n \\cdot m)$']],
    conclusion: ['Har bir katak koʻpi bilan bir marta navbatga tushadi, har bir katakdan $4$ yoʻnalish tekshiriladi — umumiy ish hajmi $O(nm)$.'],
    takeaway: 'Narxi bir xil qirralar uchun eng qisqa yoʻl — har doim BFS.',
  },
];
