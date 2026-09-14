export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  page: number;
  juz: number;
}

export const SURAH_METADATA_LIST: SurahMeta[] = [
  { number: 1, name: "الفاتحة", englishName: "Al-Fatihah", englishNameTranslation: "The Opening", numberOfAyahs: 7, revelationType: "Meccan", page: 1, juz: 1 },
  { number: 2, name: "البقرة", englishName: "Al-Baqarah", englishNameTranslation: "The Cow", numberOfAyahs: 286, revelationType: "Medinan", page: 2, juz: 1 },
  { number: 3, name: "آل عمران", englishName: "Ali 'Imran", englishNameTranslation: "Family of Imran", numberOfAyahs: 200, revelationType: "Medinan", page: 50, juz: 3 },
  { number: 4, name: "النساء", englishName: "An-Nisa", englishNameTranslation: "The Women", numberOfAyahs: 176, revelationType: "Medinan", page: 77, juz: 4 },
  { number: 5, name: "المائدة", englishName: "Al-Ma'idah", englishNameTranslation: "The Table Spread", numberOfAyahs: 120, revelationType: "Medinan", page: 106, juz: 6 },
  { number: 6, name: "الأنعام", englishName: "Al-An'am", englishNameTranslation: "The Cattle", numberOfAyahs: 165, revelationType: "Meccan", page: 128, juz: 7 },
  { number: 7, name: "الأعراف", englishName: "Al-A'raf", englishNameTranslation: "The Heights", numberOfAyahs: 206, revelationType: "Meccan", page: 151, juz: 8 },
  { number: 8, name: "الأنفال", englishName: "Al-Anfal", englishNameTranslation: "The Spoils of War", numberOfAyahs: 75, revelationType: "Medinan", page: 177, juz: 9 },
  { number: 9, name: "التوبة", englishName: "At-Tawbah", englishNameTranslation: "The Repentance", numberOfAyahs: 129, revelationType: "Medinan", page: 187, juz: 10 },
  { number: 10, name: "يونس", englishName: "Yunus", englishNameTranslation: "Jonah", numberOfAyahs: 109, revelationType: "Meccan", page: 208, juz: 11 },
  { number: 11, name: "هود", englishName: "Hud", englishNameTranslation: "Hud", numberOfAyahs: 123, revelationType: "Meccan", page: 221, juz: 11 },
  { number: 12, name: "يوسف", englishName: "Yusuf", englishNameTranslation: "Joseph", numberOfAyahs: 111, revelationType: "Meccan", page: 235, juz: 12 },
  { number: 13, name: "الرعد", englishName: "Ar-Ra'd", englishNameTranslation: "The Thunder", numberOfAyahs: 43, revelationType: "Medinan", page: 249, juz: 13 },
  { number: 14, name: "ابراهيم", englishName: "Ibrahim", englishNameTranslation: "Abraham", numberOfAyahs: 52, revelationType: "Meccan", page: 255, juz: 13 },
  { number: 15, name: "الحجر", englishName: "Al-Hijr", englishNameTranslation: "The Rocky Tract", numberOfAyahs: 99, revelationType: "Meccan", page: 262, juz: 14 },
  { number: 16, name: "النحل", englishName: "An-Nahl", englishNameTranslation: "The Bee", numberOfAyahs: 128, revelationType: "Meccan", page: 267, juz: 14 },
  { number: 17, name: "الإسراء", englishName: "Al-Isra", englishNameTranslation: "The Night Journey", numberOfAyahs: 111, revelationType: "Meccan", page: 282, juz: 15 },
  { number: 18, name: "الكهف", englishName: "Al-Kahf", englishNameTranslation: "The Cave", numberOfAyahs: 110, revelationType: "Meccan", page: 293, juz: 15 },
  { number: 19, name: "مريم", englishName: "Maryam", englishNameTranslation: "Mary", numberOfAyahs: 98, revelationType: "Meccan", page: 305, juz: 16 },
  { number: 20, name: "طه", englishName: "Ta-Ha", englishNameTranslation: "Ta-Ha", numberOfAyahs: 135, revelationType: "Meccan", page: 312, juz: 16 },
  { number: 21, name: "الأنبياء", englishName: "Al-Anbiya", englishNameTranslation: "The Prophets", numberOfAyahs: 112, revelationType: "Meccan", page: 322, juz: 17 },
  { number: 22, name: "الحج", englishName: "Al-Hajj", englishNameTranslation: "The Pilgrimage", numberOfAyahs: 78, revelationType: "Medinan", page: 332, juz: 17 },
  { number: 23, name: "المؤمنون", englishName: "Al-Mu'minun", englishNameTranslation: "The Believers", numberOfAyahs: 118, revelationType: "Meccan", page: 342, juz: 18 },
  { number: 24, name: "النور", englishName: "An-Nur", englishNameTranslation: "The Light", numberOfAyahs: 64, revelationType: "Medinan", page: 350, juz: 18 },
  { number: 25, name: "الفرقان", englishName: "Al-Furqan", englishNameTranslation: "The Criterion", numberOfAyahs: 77, revelationType: "Meccan", page: 359, juz: 18 },
  { number: 26, name: "الشعراء", englishName: "Ash-Shu'ara", englishNameTranslation: "The Poets", numberOfAyahs: 227, revelationType: "Meccan", page: 367, juz: 19 },
  { number: 27, name: "النمل", englishName: "An-Naml", englishNameTranslation: "The Ant", numberOfAyahs: 93, revelationType: "Meccan", page: 377, juz: 19 },
  { number: 28, name: "القصص", englishName: "Al-Qasas", englishNameTranslation: "The Stories", numberOfAyahs: 88, revelationType: "Meccan", page: 385, juz: 20 },
  { number: 29, name: "العنكبوت", englishName: "Al-'Ankabut", englishNameTranslation: "The Spider", numberOfAyahs: 69, revelationType: "Meccan", page: 396, juz: 20 },
  { number: 30, name: "الروم", englishName: "Ar-Rum", englishNameTranslation: "The Romans", numberOfAyahs: 60, revelationType: "Meccan", page: 404, juz: 21 },
  { number: 31, name: "لقمان", englishName: "Luqman", englishNameTranslation: "Luqman", numberOfAyahs: 34, revelationType: "Meccan", page: 411, juz: 21 },
  { number: 32, name: "السجدة", englishName: "As-Sajdah", englishNameTranslation: "The Prostration", numberOfAyahs: 30, revelationType: "Meccan", page: 415, juz: 21 },
  { number: 33, name: "الأحزاب", englishName: "Al-Ahzab", englishNameTranslation: "The Combined Forces", numberOfAyahs: 73, revelationType: "Medinan", page: 418, juz: 21 },
  { number: 34, name: "سبإ", englishName: "Saba", englishNameTranslation: "Sheba", numberOfAyahs: 54, revelationType: "Meccan", page: 428, juz: 22 },
  { number: 35, name: "فاطر", englishName: "Fatir", englishNameTranslation: "Originator", numberOfAyahs: 45, revelationType: "Meccan", page: 434, juz: 22 },
  { number: 36, name: "يس", englishName: "Ya-Sin", englishNameTranslation: "Ya Sin", numberOfAyahs: 83, revelationType: "Meccan", page: 440, juz: 22 },
  { number: 37, name: "الصافات", englishName: "As-Saffat", englishNameTranslation: "Those who set the Ranks", numberOfAyahs: 182, revelationType: "Meccan", page: 446, juz: 23 },
  { number: 38, name: "ص", englishName: "Sad", englishNameTranslation: "The Letter Sad", numberOfAyahs: 88, revelationType: "Meccan", page: 453, juz: 23 },
  { number: 39, name: "الزمر", englishName: "Az-Zumar", englishNameTranslation: "The Troops", numberOfAyahs: 75, revelationType: "Meccan", page: 458, juz: 23 },
  { number: 40, name: "غافر", englishName: "Ghafir", englishNameTranslation: "The Forgiver", numberOfAyahs: 85, revelationType: "Meccan", page: 467, juz: 24 },
  { number: 41, name: "فصلت", englishName: "Fussilat", englishNameTranslation: "Explained in Detail", numberOfAyahs: 54, revelationType: "Meccan", page: 477, juz: 24 },
  { number: 42, name: "الشورى", englishName: "Ash-Shuraa", englishNameTranslation: "The Consultation", numberOfAyahs: 53, revelationType: "Meccan", page: 483, juz: 25 },
  { number: 43, name: "الزخرف", englishName: "Az-Zukhruf", englishNameTranslation: "The Ornaments of Gold", numberOfAyahs: 89, revelationType: "Meccan", page: 489, juz: 25 },
  { number: 44, name: "الدخان", englishName: "Ad-Dukhan", englishNameTranslation: "The Smoke", numberOfAyahs: 59, revelationType: "Meccan", page: 496, juz: 25 },
  { number: 45, name: "الجاثية", englishName: "Al-Jathiyah", englishNameTranslation: "The Crouching", numberOfAyahs: 37, revelationType: "Meccan", page: 499, juz: 25 },
  { number: 46, name: "الأحقاف", englishName: "Al-Ahqaf", englishNameTranslation: "The Wind-Curved Sandhills", numberOfAyahs: 35, revelationType: "Meccan", page: 502, juz: 26 },
  { number: 47, name: "محمد", englishName: "Muhammad", englishNameTranslation: "Muhammad", numberOfAyahs: 38, revelationType: "Medinan", page: 507, juz: 26 },
  { number: 48, name: "الفتح", englishName: "Al-Fath", englishNameTranslation: "The Victory", numberOfAyahs: 29, revelationType: "Medinan", page: 511, juz: 26 },
  { number: 49, name: "الحجرات", englishName: "Al-Hujurat", englishNameTranslation: "The Rooms", numberOfAyahs: 18, revelationType: "Medinan", page: 515, juz: 26 },
  { number: 50, name: "ق", englishName: "Qaf", englishNameTranslation: "The Letter Qaf", numberOfAyahs: 45, revelationType: "Meccan", page: 518, juz: 26 },
  { number: 51, name: "الذاريات", englishName: "Adh-Dhariyat", englishNameTranslation: "The Winnowing Winds", numberOfAyahs: 60, revelationType: "Meccan", page: 520, juz: 26 },
  { number: 52, name: "الطور", englishName: "At-Tur", englishNameTranslation: "The Mount", numberOfAyahs: 49, revelationType: "Meccan", page: 523, juz: 27 },
  { number: 53, name: "النجم", englishName: "An-Najm", englishNameTranslation: "The Star", numberOfAyahs: 62, revelationType: "Meccan", page: 526, juz: 27 },
  { number: 54, name: "القمر", englishName: "Al-Qamar", englishNameTranslation: "The Moon", numberOfAyahs: 55, revelationType: "Meccan", page: 528, juz: 27 },
  { number: 55, name: "الرحمن", englishName: "Ar-Rahman", englishNameTranslation: "The Beneficent", numberOfAyahs: 78, revelationType: "Medinan", page: 531, juz: 27 },
  { number: 56, name: "الواقعة", englishName: "Al-Waqi'ah", englishNameTranslation: "The Inevitable", numberOfAyahs: 96, revelationType: "Meccan", page: 534, juz: 27 },
  { number: 57, name: "الحديد", englishName: "Al-Hadid", englishNameTranslation: "The Iron", numberOfAyahs: 29, revelationType: "Medinan", page: 537, juz: 27 },
  { number: 58, name: "المجادلة", englishName: "Al-Mujadila", englishNameTranslation: "The Pleading Woman", numberOfAyahs: 22, revelationType: "Medinan", page: 542, juz: 28 },
  { number: 59, name: "الحشر", englishName: "Al-Hashr", englishNameTranslation: "The Exile", numberOfAyahs: 24, revelationType: "Medinan", page: 545, juz: 28 },
  { number: 60, name: "الممتحنة", englishName: "Al-Mumtahanah", englishNameTranslation: "She that is to be examined", numberOfAyahs: 13, revelationType: "Medinan", page: 549, juz: 28 },
  { number: 61, name: "الصف", englishName: "As-Saf", englishNameTranslation: "The Ranks", numberOfAyahs: 14, revelationType: "Medinan", page: 551, juz: 28 },
  { number: 62, name: "الجمعة", englishName: "Al-Jumu'ah", englishNameTranslation: "The Congregation", numberOfAyahs: 11, revelationType: "Medinan", page: 553, juz: 28 },
  { number: 63, name: "المنافقون", englishName: "Al-Munafiqun", englishNameTranslation: "The Hypocrites", numberOfAyahs: 11, revelationType: "Medinan", page: 554, juz: 28 },
  { number: 64, name: "التغابن", englishName: "At-Taghabun", englishNameTranslation: "The Mutual Disillusion", numberOfAyahs: 18, revelationType: "Medinan", page: 556, juz: 28 },
  { number: 65, name: "الطلاق", englishName: "At-Talaq", englishNameTranslation: "The Divorce", numberOfAyahs: 12, revelationType: "Medinan", page: 558, juz: 28 },
  { number: 66, name: "التحريم", englishName: "At-Tahrim", englishNameTranslation: "The Prohibition", numberOfAyahs: 12, revelationType: "Medinan", page: 560, juz: 28 },
  { number: 67, name: "الملك", englishName: "Al-Mulk", englishNameTranslation: "The Sovereignty", numberOfAyahs: 30, revelationType: "Meccan", page: 562, juz: 29 },
  { number: 68, name: "القلم", englishName: "Al-Qalam", englishNameTranslation: "The Pen", numberOfAyahs: 52, revelationType: "Meccan", page: 564, juz: 29 },
  { number: 69, name: "الحاقة", englishName: "Al-Haqqah", englishNameTranslation: "The Inevitable Reality", numberOfAyahs: 52, revelationType: "Meccan", page: 566, juz: 29 },
  { number: 70, name: "المعارج", englishName: "Al-Ma'arij", englishNameTranslation: "The Ascending Stairways", numberOfAyahs: 44, revelationType: "Meccan", page: 568, juz: 29 },
  { number: 71, name: "نوح", englishName: "Nuh", englishNameTranslation: "Noah", numberOfAyahs: 28, revelationType: "Meccan", page: 570, juz: 29 },
  { number: 72, name: "الجن", englishName: "Al-Jinn", englishNameTranslation: "The Jinn", numberOfAyahs: 28, revelationType: "Meccan", page: 572, juz: 29 },
  { number: 73, name: "المزمل", englishName: "Al-Muzzammil", englishNameTranslation: "The Enshrouded One", numberOfAyahs: 20, revelationType: "Meccan", page: 574, juz: 29 },
  { number: 74, name: "المدثر", englishName: "Al-Muddaththir", englishNameTranslation: "The Cloaked One", numberOfAyahs: 56, revelationType: "Meccan", page: 575, juz: 29 },
  { number: 75, name: "القيامة", englishName: "Al-Qiyamah", englishNameTranslation: "The Resurrection", numberOfAyahs: 40, revelationType: "Meccan", page: 577, juz: 29 },
  { number: 76, name: "الانسان", englishName: "Al-Insan", englishNameTranslation: "Man", numberOfAyahs: 31, revelationType: "Medinan", page: 578, juz: 29 },
  { number: 77, name: "المرسلات", englishName: "Al-Mursalat", englishNameTranslation: "The Emissaries", numberOfAyahs: 50, revelationType: "Meccan", page: 580, juz: 29 },
  { number: 78, name: "النبأ", englishName: "An-Naba", englishNameTranslation: "The Tidings", numberOfAyahs: 40, revelationType: "Meccan", page: 582, juz: 30 },
  { number: 79, name: "النازعات", englishName: "An-Nazi'at", englishNameTranslation: "Those who drag forth", numberOfAyahs: 46, revelationType: "Meccan", page: 583, juz: 30 },
  { number: 80, name: "عبس", englishName: "'Abasa", englishNameTranslation: "He Frowned", numberOfAyahs: 42, revelationType: "Meccan", page: 585, juz: 30 },
  { number: 81, name: "التكوير", englishName: "At-Takwir", englishNameTranslation: "The Overthrowing", numberOfAyahs: 29, revelationType: "Meccan", page: 586, juz: 30 },
  { number: 82, name: "الانفطار", englishName: "Al-Infitar", englishNameTranslation: "The Cleaving", numberOfAyahs: 19, revelationType: "Meccan", page: 587, juz: 30 },
  { number: 83, name: "المطففين", englishName: "Al-Mutaffifin", englishNameTranslation: "The Defrauding", numberOfAyahs: 36, revelationType: "Meccan", page: 587, juz: 30 },
  { number: 84, name: "الانشقاق", englishName: "Al-Inshiqaq", englishNameTranslation: "The Splitting Open", numberOfAyahs: 25, revelationType: "Meccan", page: 589, juz: 30 },
  { number: 85, name: "البروج", englishName: "Al-Buruj", englishNameTranslation: "The Mansions of the Stars", numberOfAyahs: 22, revelationType: "Meccan", page: 590, juz: 30 },
  { number: 86, name: "الطارق", englishName: "At-Tariq", englishNameTranslation: "The Morning Star", numberOfAyahs: 17, revelationType: "Meccan", page: 591, juz: 30 },
  { number: 87, name: "الأعلى", englishName: "Al-A'la", englishNameTranslation: "The Most High", numberOfAyahs: 19, revelationType: "Meccan", page: 591, juz: 30 },
  { number: 88, name: "الغاشية", englishName: "Al-Ghashiyah", englishNameTranslation: "The Overwhelming", numberOfAyahs: 26, revelationType: "Meccan", page: 592, juz: 30 },
  { number: 89, name: "الفجر", englishName: "Al-Fajr", englishNameTranslation: "The Dawn", numberOfAyahs: 30, revelationType: "Meccan", page: 593, juz: 30 },
  { number: 90, name: "البلد", englishName: "Al-Balad", englishNameTranslation: "The City", numberOfAyahs: 20, revelationType: "Meccan", page: 594, juz: 30 },
  { number: 91, name: "الشمس", englishName: "Ash-Shams", englishNameTranslation: "The Sun", numberOfAyahs: 15, revelationType: "Meccan", page: 595, juz: 30 },
  { number: 92, name: "الليل", englishName: "Al-Layl", englishNameTranslation: "The Night", numberOfAyahs: 21, revelationType: "Meccan", page: 595, juz: 30 },
  { number: 93, name: "الضحى", englishName: "Ad-Duha", englishNameTranslation: "The Morning Hours", numberOfAyahs: 11, revelationType: "Meccan", page: 596, juz: 30 },
  { number: 94, name: "الشرح", englishName: "Ash-Sharh", englishNameTranslation: "The Relief", numberOfAyahs: 8, revelationType: "Meccan", page: 596, juz: 30 },
  { number: 95, name: "التين", englishName: "At-Tin", englishNameTranslation: "The Fig", numberOfAyahs: 8, revelationType: "Meccan", page: 597, juz: 30 },
  { number: 96, name: "العلق", englishName: "Al-'Alaq", englishNameTranslation: "The Clot", numberOfAyahs: 19, revelationType: "Meccan", page: 597, juz: 30 },
  { number: 97, name: "القدر", englishName: "Al-Qadr", englishNameTranslation: "The Power", numberOfAyahs: 5, revelationType: "Meccan", page: 598, juz: 30 },
  { number: 98, name: "البينة", englishName: "Al-Bayyinah", englishNameTranslation: "The Clear Proof", numberOfAyahs: 8, revelationType: "Medinan", page: 598, juz: 30 },
  { number: 99, name: "الزلزلة", englishName: "Az-Zalzalah", englishNameTranslation: "The Earthquake", numberOfAyahs: 8, revelationType: "Medinan", page: 599, juz: 30 },
  { number: 100, name: "العاديات", englishName: "Al-'Adiyat", englishNameTranslation: "The Courser", numberOfAyahs: 11, revelationType: "Meccan", page: 599, juz: 30 },
  { number: 101, name: "القارعة", englishName: "Al-Qari'ah", englishNameTranslation: "The Calamity", numberOfAyahs: 11, revelationType: "Meccan", page: 600, juz: 30 },
  { number: 102, name: "التكاثر", englishName: "At-Takathur", englishNameTranslation: "The Rivalry in World Increase", numberOfAyahs: 8, revelationType: "Meccan", page: 600, juz: 30 },
  { number: 103, name: "العصر", englishName: "Al-'Asr", englishNameTranslation: "The Declining Day", numberOfAyahs: 3, revelationType: "Meccan", page: 601, juz: 30 },
  { number: 104, name: "الهمزة", englishName: "Al-Humazah", englishNameTranslation: "The Traducer", numberOfAyahs: 9, revelationType: "Meccan", page: 601, juz: 30 },
  { number: 105, name: "الفيل", englishName: "Al-Fil", englishNameTranslation: "The Elephant", numberOfAyahs: 5, revelationType: "Meccan", page: 601, juz: 30 },
  { number: 106, name: "قريش", englishName: "Quraysh", englishNameTranslation: "Quraysh", numberOfAyahs: 4, revelationType: "Meccan", page: 602, juz: 30 },
  { number: 107, name: "الماعون", englishName: "Al-Ma'un", englishNameTranslation: "The Small Kindness", numberOfAyahs: 7, revelationType: "Meccan", page: 602, juz: 30 },
  { number: 108, name: "الكوثر", englishName: "Al-Kawthar", englishNameTranslation: "The Abundance", numberOfAyahs: 3, revelationType: "Meccan", page: 602, juz: 30 },
  { number: 109, name: "الكافرون", englishName: "Al-Kafirun", englishNameTranslation: "The Disbelievers", numberOfAyahs: 6, revelationType: "Meccan", page: 603, juz: 30 },
  { number: 110, name: "النصر", englishName: "An-Nasr", englishNameTranslation: "The Divine Support", numberOfAyahs: 3, revelationType: "Medinan", page: 603, juz: 30 },
  { number: 111, name: "المسد", englishName: "Al-Masad", englishNameTranslation: "The Palm Fiber", numberOfAyahs: 5, revelationType: "Meccan", page: 603, juz: 30 },
  { number: 112, name: "الإخلاص", englishName: "Al-Ikhlas", englishNameTranslation: "The Sincerity", numberOfAyahs: 4, revelationType: "Meccan", page: 604, juz: 30 },
  { number: 113, name: "الفلق", englishName: "Al-Falaq", englishNameTranslation: "The Daybreak", numberOfAyahs: 5, revelationType: "Meccan", page: 604, juz: 30 },
  { number: 114, name: "الناس", englishName: "An-Nas", englishNameTranslation: "Mankind", numberOfAyahs: 6, revelationType: "Meccan", page: 604, juz: 30 }
];

export interface JuzMeta {
  juz: number;
  startPage: number;
  endPage: number;
  name: string;
}

export const JUZ_PAGE_DEFINITIONS: JuzMeta[] = [
  { juz: 1, startPage: 1, endPage: 21, name: "Al-Fatihah" },
  { juz: 2, startPage: 22, endPage: 41, name: "Sayaqool" },
  { juz: 3, startPage: 42, endPage: 61, name: "Tilka'r-Rusul" },
  { juz: 4, startPage: 62, endPage: 81, name: "Lan Tanaloo" },
  { juz: 5, startPage: 82, endPage: 101, name: "Wal-Muhsanat" },
  { juz: 6, startPage: 102, endPage: 120, name: "La Yuhibbullah" },
  { juz: 7, startPage: 121, endPage: 141, name: "Wa Iza Sami'oo" },
  { juz: 8, startPage: 142, endPage: 161, name: "Wa Law Annana" },
  { juz: 9, startPage: 162, endPage: 181, name: "Qal Al-Mala'u" },
  { juz: 10, startPage: 182, endPage: 200, name: "Wa'lamoo" },
  { juz: 11, startPage: 201, endPage: 221, name: "Ya'taziroona" },
  { juz: 12, startPage: 222, endPage: 241, name: "Wa Ma Min Da'abbah" },
  { juz: 13, startPage: 242, endPage: 261, name: "Wa Ma Ubarri'u" },
  { juz: 14, startPage: 262, endPage: 281, name: "Rubama" },
  { juz: 15, startPage: 282, endPage: 301, name: "Subhana'llazi" },
  { juz: 16, startPage: 302, endPage: 321, name: "Qala Alam" },
  { juz: 17, startPage: 322, endPage: 341, name: "Iqtaraba Li'n-Nas" },
  { juz: 18, startPage: 342, endPage: 361, name: "Qad Aflaha" },
  { juz: 19, startPage: 362, endPage: 381, name: "Wa Qala'llazeena" },
  { juz: 20, startPage: 382, endPage: 401, name: "Aman Khalaqa" },
  { juz: 21, startPage: 402, endPage: 421, name: "Utlu Ma Oohiya" },
  { juz: 22, startPage: 422, endPage: 441, name: "Wa Man Yaqnut" },
  { juz: 23, startPage: 442, endPage: 461, name: "Wa Maliya" },
  { juz: 24, startPage: 462, endPage: 481, name: "Fa Man Azlamu" },
  { juz: 25, startPage: 482, endPage: 501, name: "Ilayhi Yuraddu" },
  { juz: 26, startPage: 502, endPage: 521, name: "Ha Meem" },
  { juz: 27, startPage: 522, endPage: 541, name: "Qala Fa Ma Khatbukum" },
  { juz: 28, startPage: 542, endPage: 561, name: "Qad Sami'allah" },
  { juz: 29, startPage: 562, endPage: 581, name: "Tabaraka'llazi" },
  { juz: 30, startPage: 582, endPage: 604, name: "'Amma Yatasa'aloon" }
];

export function getSurahPageRange(surahNumber: number): { startPage: number; endPage: number } {
  const meta = SURAH_METADATA_LIST.find(s => s.number === surahNumber);
  if (!meta) return { startPage: 1, endPage: 1 };
  
  const startPage = meta.page;
  if (surahNumber >= 114) {
    return { startPage, endPage: 604 };
  }
  
  const nextSurah = SURAH_METADATA_LIST.find(s => s.number === surahNumber + 1);
  if (!nextSurah) return { startPage, endPage: startPage };
  
  const nextStart = nextSurah.page;
  const endPage = nextStart > startPage ? nextStart - 1 : startPage;
  return { startPage, endPage: Math.max(startPage, endPage) };
}
