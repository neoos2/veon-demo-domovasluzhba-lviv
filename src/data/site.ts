// All facts on the page come from veon/client.json (ids in comments). Nothing here is invented.

export interface Phone { tel: string; label: string; }

const phone = (tel: string): Phone => {
  const d = tel.replace(/\D/g, "").slice(2); // 0960556556
  return { tel: `+${tel.replace(/\D/g, "")}`, label: `+38 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8, 10)}` };
};

// C-021, C-019: header number of the Lviv page and Lviv JSON-LD.
export const mainPhone = phone("+380960556556");
// C-020: call centre (except the main one) and quality control.
export const callCentre: Phone[] = ["+380677517592", "+380930556556", "+380950056556", "+380503087275"].map(phone);
export const control: Phone[] = ["+380675881011", "+380500285231"].map(phone);

// company.contacts.messengers, C-021.
export const viber = { href: "viber://chat?number=%2B380964010025", number: phone("+380964010025") };
export const telegram = { href: "https://t.me/domovaslugbalviv", handle: "@domovaslugbalviv" };
export const email = "domslugba@gmail.com";
export const address = "м. Львів, вул. Б.\u00A0Хмельницького\u00A0176, офіс\u00A0106";
export const mapHref = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Львів, вул. Богдана Хмельницького 176");
// C-035: the app buttons of the Lviv page lead to this one Branch link.
export const appHref = "https://domovasluzhba.app.link/nPkE5igh5Zb";

// C-006, header version (decisions.md). Index: 0 = Sunday … 6 = Saturday.
export const schedule = [
  { days: "Пн–Пт", hours: "07:30–21:00" },
  { days: "Сб", hours: "08:00–20:00" },
  { days: "Нд", hours: "08:00–18:00" },
];
export const hoursByDay = ["08:00–18:00", "07:30–21:00", "07:30–21:00", "07:30–21:00", "07:30–21:00", "07:30–21:00", "08:00–20:00"];

// socials with status confirmed only (TikTok is probable and is not shown).
export const socials = [
  { name: "Instagram", href: "https://www.instagram.com/domovasluzhba/" },
  { name: "Facebook", href: "https://www.facebook.com/domovaslugba.ua/" },
  { name: "YouTube", href: "https://www.youtube.com/@domslugba-2002" },
  { name: "Telegram", href: "https://t.me/domovaslugbalviv" },
];

export const nav = [
  { href: "#posluhy", label: "Послуги" },
  { href: "#yak-pratsiuiemo", label: "Як працюємо" },
  { href: "#harantiia", label: "Гарантія" },
  { href: "#vidhuky", label: "Відгуки" },
  { href: "#kontakty", label: "Контакти" },
];

// C-001: network cities; Lviv is the current page.
export const otherCities = ["Рівне", "Луцьк", "Тернопіль", "Івано-Франківськ"];

/*
 * Rooms = service groups. Group texts are quoted from «Послуги Домової служби у Львові» on the Lviv page,
 * popular jobs from «Найчастіше замовляють» (C-023); their split by group is a studio assumption (ux/demo-home.md §5).
 */
export interface Room {
  id: string;
  room: string;
  master: string;
  span: number; // columns of 12 on the desktop floor
  text: string;
  jobs: string[];
  short: string[]; // two or three jobs shown in the room on the first screen
}

export const rooms: Room[] = [
  {
    id: "vanna", room: "Ванна", master: "Сантехнік", span: 3,
    text: "Установка та ремонт труб, сантехніки, бойлерів, професійне прочищення каналізації.",
    jobs: ["Встановлення душової кабіни", "Ремонт змішувача", "Монтаж водяної теплої підлоги"],
    short: ["Душова кабіна", "Ремонт змішувача"],
  },
  {
    id: "kukhnia", room: "Кухня і техніка", master: "Ремонт побутової техніки", span: 4,
    text: "Пральні машини, холодильники, кондиціонери та інше.",
    jobs: ["Встановлення кондиціонера", "Ремонт посудомийної машини", "Ремонт пральної машини", "Ремонт холодильника", "Чищення газового котла"],
    short: ["Пральна машина", "Холодильник", "Кондиціонер"],
  },
  {
    id: "vikna", room: "Вікна і прибирання", master: "Клінінг", span: 2,
    text: "Прибирання квартир, будинків та офісів, миття вікон, хімчистка м’яких меблів.",
    jobs: ["Генеральне прибирання", "Миття вікон"],
    short: ["Миття вікон"],
  },
  {
    id: "mebli", room: "Меблі й полиці", master: "Столяр", span: 3,
    text: "Ремонт меблів, встановлення дверей, поличок та меблевих конструкцій.",
    jobs: [],
    short: ["Ремонт меблів", "Полички"],
  },
  {
    id: "dveri", room: "Вхідні двері", master: "Аварійне відкривання", span: 2,
    text: "Дверей, замків та сейфів (за наявності документів).",
    jobs: [],
    short: ["Двері, замки, сейфи"],
  },
  {
    id: "shchytok", room: "Електрощиток", master: "Електрик", span: 3,
    text: "Монтаж і ремонт розеток, освітлення, електроприладів та мереж.",
    jobs: ["Заміна автомата", "Ремонт електролічильника", "Підключення генератора"],
    short: ["Заміна автомата", "Генератор"],
  },
  {
    id: "pereizd", room: "Переїзд", master: "Вантажники і перевезення", span: 4,
    text: "Швидке й акуратне транспортування речей будь-якого обсягу.",
    jobs: ["Перевезення меблів", "Вантажі до 1,5 т", "Вантажі 1,5–3,5 т", "Вантажі понад 3,5 т", "Будматеріали, сейфи, будсміття"],
    short: ["Перевезення меблів", "Будматеріали, будсміття"],
  },
  {
    id: "dvir", room: "Двір і сад", master: "Інші послуги", span: 3,
    text: "Обрізання дерев — серед робіт, які у Львові замовляють найчастіше.",
    jobs: ["Обрізання дерев"],
    short: ["Обрізання дерев"],
  },
];

// products_services[1]: apartment renovation is the foundation under the floors.
export const renovation: Room = {
  id: "remont", room: "Уся квартира", master: "Ремонт квартир", span: 12,
  text: "Частковий, косметичний, капітальний (євроремонт), під ключ.",
  jobs: ["Частковий ремонт", "Косметичний ремонт", "Капітальний ремонт", "Ремонт під ключ"],
  short: [],
};

// C-017: the three reviews on the Lviv page, verbatim (veon/research/raw/ua_lvov_html.txt).
export interface Review { author: string; date: string; iso: string; master: string; text: string; }
export const reviews: Review[] = [
  {
    author: "Уляна", date: "05.11.2026", iso: "2026-11-05", master: "п. Юрію",
    text: "Дякую п. Юрію за вкладання плитки на стіни і підлогу - швидко, якісно, акуратно. Окрема подяка за поради і консультації, так як я в цій темі абсолютно не розбиралася.",
  },
  {
    author: "Жанна", date: "18.11.2026", iso: "2026-11-18", master: "Пан Олег",
    text: "Був сьогодні майстер Пан Олег!Встановлював унітаз,який попередні майстри встановили так,що він хитався і був перекошений дещо по діагоналі!Пан Олег прийшов,і все зробив ідеально!Все вирівняв,нічого не хитається!Я дуже задоволена його роботою!Дуже вдячна!Таких майстрів треба сильно цінувати!Хочу додати,що все могли б зробити свмі,але будинок хрущовка,все криве- підлога і стіни-все!І зробити рівно щось,це талант,мистецтво,що завгодно!Але він це зробив і так скромно сказав,що він просто поміняв одне кріплення!1,5 години на кріплення?Він фантастичний і чудовий майстер!Я дуууже задоволена!Дякую за роботу і за таку людину!",
  },
  {
    author: "Eleonora", date: "16.11.2026", iso: "2026-11-16", master: "Майстер Василь",
    text: "Майстер Василь - супер професіонал) Все було зроблено читко, гарно та максимально акуратно. Без зайвих питань, самостійно з усім розібрався й взяв все під контроль). Особливо хочу відмітити якість роботи, все максимально бережливо, от прям з любовʼю) Дуже задоволені роботою, будемо обовʼязково звертатися ще.",
  },
];

// «Усі майстри – в твоєму смартфоні!» block of the Lviv page (C-011).
export const appFeatures = [
  "Замовити майстра для будь-якої роботи за кілька кліків",
  "Вибирати зручні дату та час обслуговування",
  "Оплачувати послуги в зручний для вас спосіб",
  "Контролювати виконання робіт та наші гарантійні зобов’язання",
];

export const soon = "Розділ у розробці";
