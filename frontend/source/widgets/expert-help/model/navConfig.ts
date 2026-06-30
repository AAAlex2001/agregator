export type CabinetRole = "EXPERT" | "CUSTOMER" | "LICENSE_HOLDER";

export type PlateColor = "indigo" | "amber" | "green" | "red";

export interface NavItem {
  label: string;
  href?: string;
  external?: boolean;
  soon?: boolean;
  description?: string;
}

export interface NavPlate {
  key: string;
  label: string;
  color: PlateColor;
  dynamic?: "license";
  items?: NavItem[];
  roles?: CabinetRole[];
}

function reviewItems(role: string | null): NavItem[] {
  const items: NavItem[] = [{ label: "Отзывы о нас", href: "/landing/reviews" }];
  if (role === "EXPERT") {
    items.push({ label: "Мои отзывы", href: "/expert/reviews" });
  }
  items.push({ label: "Отзывы экспертов", href: "/expert-reviews" });
  return items;
}

function usefulItems(role: string | null): NavItem[] {
  if (role === "CUSTOMER") {
    return [
      { label: "Проверка ЭО", href: "https://pb.nalog.ru/search.html#search-ul", external: true },
      { label: "Рейтинг ЭО", href: "https://экг-рейтинг.рф", external: true },
    ];
  }
  return [
    { label: "Реестр средств измерений", href: "https://all-pribors.ru/grsilist", external: true },
    { label: "Проверки прокуратуры", href: "https://proverki.gov.ru/portal", external: true },
    { label: "Результаты поверки приборов", href: "https://grmetr.ru/arshin", external: true },
    { label: "Единый реестр проверок", href: "https://proverki.gov.ru/portal", external: true },
  ];
}

export function getCabinetNav(role: string | null): NavPlate[] {
  const all: NavPlate[] = [
    {
      key: "tech",
      label: "ТехЭксперт",
      color: "indigo",
      roles: ["EXPERT"],
      items: [{ label: "Интеграция с ТехЭкспертом", soon: true }],
    },
    {
      key: "edu",
      label: "Учебный центр",
      color: "indigo",
      roles: ["EXPERT"],
      items: [
        { label: "Подготовка к аттестации на эксперта", soon: true },
        { label: "Аттестация на дефектоскописта", soon: true },
        { label: "Дополнительное профессиональное образование", soon: true },
      ],
    },
    {
      key: "license",
      label: "Держатели лицензии",
      color: "amber",
      dynamic: "license",
      roles: ["EXPERT"],
    },
    {
      key: "labor",
      label: "Трудовые резервы",
      color: "amber",
      roles: ["EXPERT", "LICENSE_HOLDER"],
      items: [
        {
          label: "Поиск эксперта в штат — для держателя лицензии",
          description:
            "Объявление о поиске эксперта в штат для срочного договора на период проверки лицензионных требований. Укажите область аттестации, категорию и регион.",
          soon: true,
        },
        {
          label: "Готов к срочному договору — для эксперта",
          description:
            "Объявление эксперта о готовности устроиться по срочному трудовому договору в штат ЭО. Укажите область аттестации, категорию и регион.",
          soon: true,
        },
      ],
    },
    {
      key: "help-expert",
      label: "Помощь эксперту",
      color: "green",
      roles: ["EXPERT"],
      items: [
        { label: "Расчёт анализа риска аварий", href: "/expert/hazard" },
        { label: "Расчёт остаточного ресурса", href: "/expert/lining" },
        { label: "Шаблоны ЗЭПБ", soon: true },
      ],
    },
    {
      key: "help-customer",
      label: "Помощь заказчику",
      color: "green",
      roles: ["CUSTOMER"],
      items: [
        { label: "Проверка ЭО", soon: true },
        { label: "Рейтинг ЭО", href: "https://экг-рейтинг.рф", external: true },
        { label: "Шаблоны ТЗ", soon: true },
      ],
    },
    {
      key: "useful",
      label: "Полезные ссылки",
      color: "green",
      roles: ["EXPERT", "CUSTOMER"],
      items: usefulItems(role),
    },
    {
      key: "reviews",
      label: "Все отзывы",
      color: "red",
      items: reviewItems(role),
    },
  ];

  return all.filter((p) => !p.roles || (role !== null && p.roles.includes(role as CabinetRole)));
}
