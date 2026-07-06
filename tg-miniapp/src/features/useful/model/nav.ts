import type { Role } from "@/shared/services/api";

const SITE = "https://plus-resurs.com";

export interface UsefulRegion {
  region: string;
  links: { label: string; url: string }[];
}

export interface UsefulLink {
  label: string;
  hint?: string;
  url?: string;
  soon?: boolean;
  regions?: UsefulRegion[];
}

export interface UsefulCategory {
  key: string;
  label: string;
  links: UsefulLink[];
}

const VERIFICATION_REGIONS: UsefulRegion[] = [
  {
    region: "ЦФО (Москва и область)",
    links: [
      { label: "rostest.ru", url: "https://www.rostest.ru/page/contacts/" },
      { label: "vniiofi.ru", url: "https://www.vniiofi.ru/services/poverka-sredstv-izmerenii.html" },
    ],
  },
  {
    region: "СЗФО (Ленинградская область)",
    links: [{ label: "rustest.spb.ru", url: "https://rustest.spb.ru/poverka-i-kalibrovka/poverka/" }],
  },
  {
    region: "ЮФО (Ростовская область, Краснодарский край)",
    links: [
      { label: "cmtr.ru", url: "https://cmtr.ru/uslugi/nerazrushayuschiy-kontrol/" },
      { label: "krasnodarcsm.ru", url: "https://krasnodarcsm.ru/poverka-i-kalibrovka/proverka-sredstv-izmerenij/" },
    ],
  },
  {
    region: "СКФО (Дагестан)",
    links: [{ label: "dagcsm.ru", url: "https://dagcsm.ru/klientam/price/" }],
  },
  {
    region: "ПФО (Саратов)",
    links: [{ label: "gosmera.ru", url: "https://gosmera.ru/content/price.html" }],
  },
  {
    region: "УФО (Екатеринбург)",
    links: [
      { label: "kb-agava.ru", url: "https://www.kb-agava.ru/uslugi/poverka" },
      { label: "uniim.ru", url: "https://uniim.ru/verification/" },
    ],
  },
  {
    region: "СФО (Новосибирск, Новокузнецк, Барнаул)",
    links: [
      { label: "ncsm.ru", url: "https://www.ncsm.ru/service/metrologiya/" },
      { label: "altcsm.ru", url: "https://altcsm.ru/services/technical-regulation/" },
    ],
  },
  {
    region: "ДФО (Владивосток, Хабаровск)",
    links: [
      { label: "dfocsm.ru", url: "https://dfocsm.ru/" },
      { label: "vniiftridf.ru", url: "https://vniiftridf.ru/index.php/services/186-metrologicheskie-uslugi" },
    ],
  },
];

const TECH: UsefulCategory = {
  key: "tech",
  label: "ТехЭксперт",
  links: [
    {
      label: "Открыть ТехЭксперт",
      hint: "Справочник нормативной документации по промышленной безопасности — на сайте Ресурс-Плюс",
      url: `${SITE}/tech-expert`,
    },
  ],
};

const EDU: UsefulCategory = {
  key: "edu",
  label: "Учебный центр",
  links: [
    { label: "Подготовка к аттестации на эксперта", soon: true },
    { label: "Аттестация на дефектоскописта", soon: true },
    { label: "Дополнительное профессиональное образование", url: "https://nedra-npi.ru/education" },
  ],
};

const LICENSE: UsefulCategory = {
  key: "license",
  label: "Держатели лицензии",
  links: [],
};

const LABOR: UsefulCategory = {
  key: "labor",
  label: "Трудовые ресурсы",
  links: [
    {
      label: "Поиск эксперта в штат — для держателя лицензии",
      hint: "Объявление о поиске эксперта в штат для срочного договора на период проверки лицензионных требований. Укажите область аттестации, категорию и регион.",
      soon: true,
    },
    {
      label: "Готов к срочному договору — для эксперта",
      hint: "Объявление эксперта о готовности устроиться по срочному трудовому договору в штат ЭО. Укажите область аттестации, категорию и регион.",
      soon: true,
    },
  ],
};

const HELP_EXPERT: UsefulCategory = {
  key: "help",
  label: "Помощь эксперту",
  links: [
    { label: "Расчёт анализа риска аварий", hint: "Программа на сайте Ресурс-Плюс", url: `${SITE}/expert/hazard` },
    { label: "Расчёт остаточного ресурса", hint: "Программа на сайте Ресурс-Плюс", url: `${SITE}/expert/lining` },
    { label: "Шаблоны зЭПБ", soon: true },
  ],
};

const HELP_CUSTOMER: UsefulCategory = {
  key: "help",
  label: "Помощь заказчику",
  links: [
    { label: "Проверка ЭО", url: "https://pb.nalog.ru/search.html#search-ul" },
    { label: "Рейтинг ЭО", url: "https://экг-рейтинг.рф" },
    { label: "Шаблоны ТЗ", soon: true },
  ],
};

const LINKS_FULL: UsefulCategory = {
  key: "links",
  label: "Полезные ссылки",
  links: [
    { label: "Реестр экспертов Ростехнадзора", url: "https://www.gosnadzor.ru/service/list/certification%20experts/" },
    { label: "Реестр заключений ЭПБ", hint: "На сайте Ресурс-Плюс", url: `${SITE}/zepb-registry` },
    { label: "Сервис проверки подлинности протоколов ИС ЕПТ", url: "https://qr.gosnadzor.ru/prombez" },
    { label: "Реестр средств измерений", url: "https://all-pribors.ru/grsilist" },
    { label: "Поверка приборов", hint: "Центры метрологии по округам", regions: VERIFICATION_REGIONS },
    { label: "Результаты поверки приборов", url: "https://grmetr.ru/arshin" },
    { label: "Проверки прокуратуры", url: "https://proverki.gov.ru/portal" },
  ],
};

const LINKS_CUSTOMER: UsefulCategory = {
  key: "links",
  label: "Полезные ссылки",
  links: [
    { label: "Реестр экспертов Ростехнадзора", url: "https://www.gosnadzor.ru/service/list/certification%20experts/" },
    { label: "Проверки прокуратуры", url: "https://proverki.gov.ru/portal" },
  ],
};

export function usefulCategories(role: Role | null): UsefulCategory[] {
  if (role === "EXPERT") return [TECH, EDU, LICENSE, LABOR, HELP_EXPERT, LINKS_FULL];
  if (role === "CUSTOMER") return [HELP_CUSTOMER, LINKS_CUSTOMER];
  if (role === "LICENSE_HOLDER") return [TECH, EDU, LABOR, LINKS_FULL];
  return [];
}
