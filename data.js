export const FILTERS = [
  { id: "all", label: "Barchasi" },
  { id: "heritage", label: "Tarix va meʼmorlik" },
  { id: "craft", label: "Hunarmandchilik" },
  { id: "nature", label: "Tabiat" },
  { id: "city", label: "Shahar ritmi" },
];

export const DESTINATIONS = [
  {
    id: "samarkand",
    name: "Samarqand",
    region: "Samarqand viloyati",
    category: "heritage",
    categoryLabel: "Ipak yo‘li",
    image: "assets/registan.jpg",
    imageAlt: "Kechki ko‘k soatda Registon maydoni va moviy koshinlar",
    coordinates: { x: 57.4, y: 64.5 },
    duration: 2,
    season: "Bahor · kuz",
    mood: ["history", "slow"],
    cardNote: "Ko‘k gumbazlar ostidagi asrlar hikoyasi.",
    story: "Registon maydonidagi koshinlardan Shohi Zinda yo‘lagigacha — Samarqand shoshilmay tomosha qilishga arziydi. Kechki payt maydonning rangi o‘zgarishini kutib turing.",
    highlights: ["Registon maydoni", "Shohi Zinda majmuasi", "Siyob bozori"],
    localTip: "Siyob bozoriga ertalab boring: nonvoyxonalardagi yangi Samarqand nonining isi ham sayohatning bir qismi.",
    mapLabelSide: "bottom",
  },
  {
    id: "bukhara",
    name: "Buxoro",
    region: "Buxoro viloyati",
    category: "heritage",
    categoryLabel: "Qadimiy shahar",
    image: "assets/bukhara.jpg",
    imageAlt: "Buxorodagi tarixiy minoralar quyosh botishida",
    coordinates: { x: 45.4, y: 65.8 },
    duration: 2,
    season: "Bahor · kuz",
    mood: ["history", "slow"],
    cardNote: "Har ko‘cha ortida yana bir hovli, yana bir rivoyat.",
    story: "Buxoroning eski shahri piyoda kezishga yaralgan: Labi Hovuz atrofida bir piyola choy ichib, keyin tor ko‘chalar orasidan Po‘i Kalon tomonga yuring.",
    highlights: ["Po‘i Kalon majmuasi", "Ark qal’asi", "Labi Hovuz"],
    localTip: "Eski shaharda quyosh botishiga yaqin sayr qiling — g‘isht ranglari shu payt ayniqsa iliq ko‘rinadi.",
    mapLabelSide: "bottom",
  },
  {
    id: "khiva",
    name: "Xiva",
    region: "Xorazm viloyati",
    category: "heritage",
    categoryLabel: "Ochiq osmon ostidagi muzey",
    image: "assets/khiva.jpg",
    imageAlt: "Ichan qal’a ichidagi qum rang devorlar va moviy koshinlar",
    coordinates: { x: 27.5, y: 67.2 },
    duration: 2,
    season: "Bahor · kuz",
    mood: ["history", "slow"],
    cardNote: "Ichan qal’a ichida vaqt boshqa tezlikda oqadi.",
    story: "Xivaning loysuvoq devorlari, yog‘och eshiklari va moviy koshinlari Ichan qal’ani tirik tarix kitobiga aylantiradi. Eng sokin lahzalar — darvozalar ochilgan erta tongda.",
    highlights: ["Ichan qal’a", "Kalta Minor", "Tosh hovli saroyi"],
    localTip: "Shaharning manzarasini ko‘rish uchun balandroq minoralarga chiqish imkoniyatini va joriy kirish tartibini oldindan tekshiring.",
    mapLabelSide: "bottom",
  },
  {
    id: "tashkent",
    name: "Toshkent",
    region: "Toshkent shahri",
    category: "city",
    categoryLabel: "Shahar ritmi",
    image: "assets/tashkent.jpg",
    imageAlt: "Toshkentdagi tarixiy madrasa va zamonaviy shahar manzarasi",
    coordinates: { x: 75.6, y: 51.2 },
    duration: 1,
    season: "Yil bo‘yi",
    mood: ["city", "slow"],
    cardNote: "Bir bekatda tarix, keyingisida yangi shahar.",
    story: "Toshkentni metro bekatlari, Chorsu bozori va daraxtzor mahallalar orqali his qiling. Bu yerda eski shahar va zamonaviy hayot bir-biridan keskin ajralmaydi — yonma-yon yashaydi.",
    highlights: ["Chorsu bozori", "Toshkent metrosi", "Eski shahar"],
    localTip: "Metro bekatlarining bezaklarini ko‘rishga vaqt ajrating. Ayrim bekatlarda suratga olish qoidalari farq qilishi mumkin.",
    mapLabelSide: "top",
  },
  {
    id: "chimgan",
    name: "Chimyon",
    region: "Toshkent viloyati",
    category: "nature",
    categoryLabel: "Tog‘ havosi",
    image: "assets/chimgan.jpg",
    imageAlt: "Chimyon tog‘larining tonggi manzarasi va ko‘l bo‘yi so‘qmog‘i",
    coordinates: { x: 80.5, y: 49.5 },
    duration: 2,
    season: "Bahor · yoz · kuz",
    mood: ["nature", "adventure"],
    cardNote: "Shahar shovqinidan bir nafaslik uzoqlik.",
    story: "Toshkentdan uzoq ketmay turib tog‘ manzarasiga sho‘ng‘ish mumkin. Chimyon va Chorvoq atrofi piyoda sayr, manzara tomosha qilish va ochiq havoda hordiq uchun mashhur yo‘nalish.",
    highlights: ["Chimyon etaklari", "Chorvoq bo‘yi", "Tog‘ so‘qmoqlari"],
    localTip: "Tog‘ ob-havosi tez o‘zgaradi: qatlamlab kiyinib, yo‘lga chiqishdan avval mahalliy sharoitni tekshiring.",
    mapLabelSide: "right", 
  },
  {
    id: "fergana",
    name: "Farg‘ona vodiysi",
    region: "Farg‘ona vodiysi",
    category: "craft",
    categoryLabel: "Usta qo‘li bilan",
    image: "assets/fergana.jpg",
    imageAlt: "Rishton kuloli qo‘lda ko‘k naqsh solayotgan sopol idish",
    coordinates: { x: 85.2, y: 57.0 },
    duration: 2,
    season: "Bahor · kuz",
    mood: ["craft", "slow"],
    cardNote: "Naqsh, ipak va avloddan-avlodga o‘tgan mahorat.",
    story: "Farg‘ona vodiysida hunarmandchilik kundalik hayotning bir qismi. Rishton kulollari, Marg‘ilon atlaslari va Qo‘qonning tarixiy markazi — alohida-alohida kashf etishga arziydigan manzillar.",
    highlights: ["Rishton kulolchilik ustaxonalari", "Marg‘ilon atlaslari", "Qo‘qon tarixiy markazi"],
    localTip: "Ustaxonaga kirishdan oldin ruxsat so‘rang; tayyor buyum xarid qilishdan ko‘ra, uning qanday yaratilishini ko‘rishga vaqt ajrating.",
    mapLabelSide: "bottom",
  },
  {
    id: "aidarkol",
    name: "Aydarko‘l",
    region: "Jizzax · Navoiy viloyatlari",
    category: "nature",
    categoryLabel: "Sokin qirg‘oq",
    image: "assets/aidarkol.jpg",
    imageAlt: "Qizilqum chetidagi sokin Aydarko‘l qirg‘og‘i",
    coordinates: { x: 53.5, y: 55.1 },
    duration: 1,
    season: "Bahor · kuz",
    mood: ["nature", "adventure", "slow"],
    cardNote: "Sahro va suv uchrashgan jimjit manzara.",
    story: "Qizilqum bag‘ridagi Aydarko‘l manzarasi sahro haqidagi tasavvurni o‘zgartiradi. Bu yerga shoshilmasdan kelish, ufqni tomosha qilish va mahalliy mezbonlar bilan tanishish uchun vaqt qoldiring.",
    highlights: ["Aydarko‘l qirg‘og‘i", "Qizilqum manzaralari", "Cho‘l tunlari"],
    localTip: "Uzoq masofalar uchun transport va tunash joyini oldindan kelishib oling; qirg‘oqdagi sharoit mavsumga qarab o‘zgaradi.",
    mapLabelSide: "top",
  },
  {
    id: "aral",
    name: "Orolbo‘yi",
    region: "Qoraqalpog‘iston Respublikasi",
    category: "nature",
    categoryLabel: "Chekka ufqlar",
    image: "assets/aral.jpg",
    imageAlt: "Mo‘ynoq yaqinidagi sobiq dengiz tubida qolgan eski kema",
    coordinates: { x: 19.3, y: 45.0 },
    duration: 2,
    season: "Bahor · kuz",
    mood: ["adventure", "nature"],
    cardNote: "Sukut ham hikoya aytadigan ulkan makon.",
    story: "Mo‘ynoqdagi kemalar qabristoni va Nukusdagi Savitskiy muzeyi Orolbo‘yi haqida turli ovozlarda hikoya qiladi. Bu yo‘nalishning go‘zalligi bilan birga, hududning ekologik tarixiga hurmat bilan qarash muhim.",
    highlights: ["Mo‘ynoq kemalar qabristoni", "Savitskiy muzeyi", "Qoraqalpoq madaniyati"],
    localTip: "Mo‘ynoq va Nukus orasidagi yo‘l uzoq. Safarni mahalliy gid yoki ishonchli transport bilan rejalashtiring va hudud tarixiga ehtirom bilan yondashing.",
    mapLabelSide: "top",
  },
];

export const MOODS = [
  {
    id: "history",
    label: "Tarixga sho‘ng‘ish",
    icon: "✳",
    description: "Ko‘k koshinlar, qadimiy hovlilar va asrlar davomida aytilgan hikoyalar.",
    destinations: ["samarkand", "bukhara", "khiva"],
  },
  {
    id: "nature",
    label: "Tabiat qo‘ynida",
    icon: "⌁",
    description: "Tog‘ havosi, sahro ufqi va kunni sekinroq yashash uchun kenglik.",
    destinations: ["chimgan", "aidarkol", "aral"],
  },
  {
    id: "craft",
    label: "Ustalar izidan",
    icon: "✳",
    description: "Qo‘lda chizilgan naqshlar va avlodlar davomida sayqal topgan mahorat.",
    destinations: ["fergana", "bukhara", "khiva"],
  },
  {
    id: "slow",
    label: "Shoshilmay sayr",
    icon: "☼",
    description: "Choy, sokin ko‘chalar va rejaga sig‘may qolsa ham mayli bo‘lgan lahzalar.",
    destinations: ["bukhara", "khiva", "aidarkol"],
  },
  {
    id: "adventure",
    label: "Kutilmagan safar",
    icon: "↗",
    description: "Tanish yo‘ldan chetroqqa buriling — eng esda qoladigan manzillar kutmoqda.",
    destinations: ["aral", "chimgan", "aidarkol"],
  },
  {
    id: "city",
    label: "Shahar kayfiyati",
    icon: "⌂",
    description: "Bozor shovqini, metro bekatlari va yangi-yu eski shaharlar uchrashuvi.",
    destinations: ["tashkent", "fergana", "samarkand"],
  },
];

export function normalizeText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[ʻʼ‘’'`]/g, "")
    .toLocaleLowerCase("uz");
}

export function filterDestinations({ query = "", category = "all" } = {}, destinations = DESTINATIONS) {
  const normalizedQuery = normalizeText(query.trim());
  return destinations.filter((destination) => {
    const matchesCategory = category === "all" || destination.category === category;
    const searchable = normalizeText([
      destination.name,
      destination.region,
      destination.categoryLabel,
      destination.cardNote,
      ...destination.highlights,
    ].join(" "));
    return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
  });
}

export function resolveItinerary(ids = [], destinations = DESTINATIONS) {
  const byId = new Map(destinations.map((destination) => [destination.id, destination]));
  const seen = new Set();
  const stops = [];

  for (const id of ids) {
    const destination = byId.get(id);
    if (destination && !seen.has(id)) {
      seen.add(id);
      stops.push(destination);
    }
  }

  return {
    stops,
    days: stops.reduce((total, destination) => total + destination.duration, 0),
    count: stops.length,
  };
}

export function recommendedForMood(moodId, destinations = DESTINATIONS) {
  const mood = MOODS.find((entry) => entry.id === moodId) ?? MOODS[0];
  const byId = new Map(destinations.map((destination) => [destination.id, destination]));
  return mood.destinations.map((id) => byId.get(id)).filter(Boolean);
}
