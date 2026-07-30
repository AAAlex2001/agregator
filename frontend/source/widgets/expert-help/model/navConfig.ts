export type CabinetRole = "EXPERT" | "CUSTOMER" | "LICENSE_HOLDER";

export type PlateColor = "indigo" | "amber" | "green" | "red" | "gold";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavRegion {
  region: string;
  links: NavLink[];
}

export type NavBadge =
  | "labor"
  | "deals"
  | "expertSearch"
  | "employment";

export interface NavItem {
  label: string;
  href?: string;
  external?: boolean;
  soon?: boolean;
  description?: string;
  logoSrc?: string;
  logoAlt?: string;
  regions?: NavRegion[];
  badge?: NavBadge;
}

export interface NavPlate {
  key: string;
  label: string;
  color: PlateColor;
  dynamic?: "license";
  items?: NavItem[];
  roles?: CabinetRole[];
  href?: string;
  logo?: boolean;
  badge?: NavBadge;
}

function reviewItems(role: string | null): NavItem[] {
  const items: NavItem[] = [{ label: "Отзывы о нас", href: "/landing/reviews" }];
  if (role === "EXPERT") {
    items.push({ label: "Мои отзывы", href: "/expert/reviews" });
  }
  items.push({ label: "Отзывы исполнителей", href: "/expert-reviews" });
  return items;
}

const VERIFICATION_REGIONS: NavRegion[] = [
  {
    region: "ЦФО (Москва и область)",
    links: [
      { label: "rostest.ru", href: "https://www.rostest.ru/page/contacts/" },
      { label: "vniiofi.ru", href: "https://www.vniiofi.ru/services/poverka-sredstv-izmerenii.html" },
    ],
  },
  {
    region: "СЗФО (Ленинградская область)",
    links: [{ label: "rustest.spb.ru", href: "https://rustest.spb.ru/poverka-i-kalibrovka/poverka/" }],
  },
  {
    region: "ЮФО (Ростовская область, Краснодарский край)",
    links: [
      { label: "cmtr.ru", href: "https://cmtr.ru/uslugi/nerazrushayuschiy-kontrol/" },
      { label: "krasnodarcsm.ru", href: "https://krasnodarcsm.ru/poverka-i-kalibrovka/proverka-sredstv-izmerenij/" },
    ],
  },
  {
    region: "СКФО (Дагестан)",
    links: [{ label: "dagcsm.ru", href: "https://dagcsm.ru/klientam/price/" }],
  },
  {
    region: "ПФО (Саратов)",
    links: [{ label: "gosmera.ru", href: "https://gosmera.ru/content/price.html" }],
  },
  {
    region: "УФО (Екатеринбург)",
    links: [
      { label: "kb-agava.ru", href: "https://www.kb-agava.ru/uslugi/poverka" },
      { label: "uniim.ru", href: "https://uniim.ru/verification/" },
    ],
  },
  {
    region: "СФО (Новосибирск, Новокузнецк, Барнаул)",
    links: [
      { label: "ncsm.ru", href: "https://www.ncsm.ru/service/metrologiya/" },
      { label: "altcsm.ru", href: "https://altcsm.ru/services/technical-regulation/" },
    ],
  },
  {
    region: "ДФО (Владивосток, Хабаровск)",
    links: [
      { label: "dfocsm.ru", href: "https://dfocsm.ru/" },
      { label: "vniiftridf.ru", href: "https://vniiftridf.ru/index.php/services/186-metrologicheskie-uslugi" },
    ],
  },
];

function usefulItems(role: string | null): NavItem[] {
  const registryHref = role ? "/landing/zepb-registry" : "/zepb-registry";

  if (role === "CUSTOMER") {
    return [
      { label: "Реестр исполнителей Ростехнадзора", href: "https://www.gosnadzor.ru/service/list/certification%20experts/", external: true },
      { label: "Проверки прокуратуры", href: "https://proverki.gov.ru/portal", external: true },
    ];
  }
  return [
    { label: "Реестр исполнителей Ростехнадзора", href: "https://www.gosnadzor.ru/service/list/certification%20experts/", external: true },
    { label: "Реестр заключений ЭПБ", href: registryHref },
    { label: "Сервис проверки подлинности протоколов ИС ЕПТ", href: "https://qr.gosnadzor.ru/prombez", external: true },
    { label: "Реестр средств измерений", href: "https://all-pribors.ru/grsilist", external: true },
    { label: "Поверка приборов", regions: VERIFICATION_REGIONS },
    { label: "Результаты поверки приборов", href: "https://grmetr.ru/arshin", external: true },
    { label: "Проверки прокуратуры", href: "https://proverki.gov.ru/portal", external: true },
  ];
}

function createCabinetNav(role: string | null): NavPlate[] {
  const expertContactsHref = role ? "/landing/expert-contacts" : "/expert-contacts";

  return [
    {
      key: "license",
      label: "Держатели разрешительных документов",
      color: "amber",
      dynamic: "license",
      roles: ["EXPERT"],
    },
    {
      key: "labor",
      label: "Трудовые ресурсы",
      color: "amber",
      roles: ["EXPERT", "CUSTOMER", "LICENSE_HOLDER"],
      badge: "labor",
      items: [
        {
          label: "Контакты исполнителей",
          href: expertContactsHref,
          badge: "deals",
          description:
            "Каталог исполнителей с областями аттестации и защищённой покупкой контактных данных по электронному договору.",
        },
        {
          label: "Поиск исполнителя в штат — для держателя разрешительных документов",
          href: "/labor/expert-search",
          badge: "expertSearch",
          description:
            "Объявление о поиске исполнителя для постоянной работы, получения лицензии или проверки лицензионных требований. Укажите область аттестации, категорию и регион.",
        },
        {
          label: "Готов к трудовому договору — для исполнителя",
          href: "/labor/employment",
          badge: "employment",
          description:
            "Объявление исполнителя о готовности устроиться по трудовому договору на постоянной основе или на определённый срок. Укажите область аттестации, категорию и регион.",
        },
      ],
    },
    {
      key: "edu",
      label: "Учебный центр",
      color: "indigo",
      roles: ["EXPERT", "LICENSE_HOLDER"],
      items: [
        { label: "Подготовка к аттестации на исполнителя", soon: true },
        {
          label: "Аттестация на дефектоскописта",
          href: "/landing/training/defectoscopist-certification",
          description: "Подготовка, аттестация и сертификация специалистов неразрушающего контроля в ООО «АРЦ НК».",
          logoSrc: "/ARC.png",
          logoAlt: "ООО «АРЦ НК»",
        },
        {
          label: "Дополнительное профессиональное образование ООО «НПИ «Недра»",
          href: "https://nedra-npi.ru/svedeniya/obrazovanie",
          external: true,
          description: "Повышение квалификации проектных специалистов и дополнительное профессиональное образование.",
          logoSrc: "/npi-nedra-logo.svg",
          logoAlt: "ООО «НПИ «Недра»",
        },
      ],
    },
    {
      key: "useful",
      label: "Полезные ссылки",
      color: "green",
      roles: ["EXPERT", "CUSTOMER", "LICENSE_HOLDER"],
      items: usefulItems(role),
    },
    {
      key: "tech",
      label: "ТехЭксперт",
      color: "indigo",
      roles: ["EXPERT", "LICENSE_HOLDER"],
      href: "/tech-expert",
      logo: true,
    },
    {
      key: "rtn",
      label: "РОСТЕХНАДЗОР отвечает",
      color: "gold",
      items: [
        {
          label: "База официальных ответов",
          href: role ? "/landing/rtn" : "/rtn",
          description:
            "Письма и разъяснения Ростехнадзора с поиском по заголовку, номеру документа и направлениям надзора.",
        },
        {
          label: "Задать вопрос в Ростехнадзор",
          href: role ? "/landing/rtn/ask" : "/rtn/ask",
          description:
            "Передайте вопрос для подготовки официального обращения и отслеживайте его рассмотрение.",
        },
      ],
    },
    {
      key: "help-expert",
      label: "Помощь исполнителю",
      color: "green",
      roles: ["EXPERT"],
      items: [
        { label: "Расчёт анализа риска аварий", href: "/expert/hazard" },
        { label: "Расчёт остаточного ресурса", href: "/expert/lining" },
        { label: "Шаблоны зЭПБ", soon: true },
      ],
    },
    {
      key: "help-customer",
      label: "Помощь заказчику",
      color: "green",
      roles: ["CUSTOMER"],
      items: [
        { label: "Проверка ЭО", href: "https://pb.nalog.ru/search.html#search-ul", external: true },
        { label: "Рейтинг ЭО", href: "https://экг-рейтинг.рф", external: true },
        { label: "Шаблоны ТЗ", soon: true },
      ],
    },
    {
      key: "reviews",
      label: "Все отзывы",
      color: "red",
      items: reviewItems(role),
    },
  ];
}

export function getCabinetNav(role: string | null): NavPlate[] {
  return createCabinetNav(role).filter(
    (plate) => !plate.roles || (role !== null && plate.roles.includes(role as CabinetRole)),
  );
}

export function getGuestCabinetNav(): NavPlate[] {
  return createCabinetNav(null);
}
