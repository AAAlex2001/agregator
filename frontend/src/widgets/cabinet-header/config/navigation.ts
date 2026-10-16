import type { UserRole } from "@/entities/user";
import type { HeaderNavigationItem, HeaderNavigationSection } from "../model/types";
import { VERIFICATION_REGIONS } from "./verification-regions";

/** Добавляет исполнителю ссылку на его отзывы среди общих страниц отзывов. */
function reviewItems(role: UserRole): HeaderNavigationItem[] {
  const platformReviews = {
    label: "Отзывы о нас",
    href: "/landing/reviews",
  };
  const expertReviews = {
    label: "Отзывы исполнителей",
    href: "/expert-reviews",
  };

  if (role !== "EXPERT") {
    return [platformReviews, expertReviews];
  }

  return [
    platformReviews,
    {
      label: "Мои отзывы",
      href: "/expert/reviews",
    },
    expertReviews,
  ];
}

/** Выбирает справочные сервисы: заказчику нужен сокращённый список. */
function usefulItems(role: UserRole): HeaderNavigationItem[] {
  const registryHref = "/landing/zepb-registry";

  if (role === "CUSTOMER") {
    return [
      {
        label: "Реестр исполнителей Ростехнадзора",
        href: "https://www.gosnadzor.ru/service/list/certification%20experts/",
        external: true,
      },
      {
        label: "Проверки прокуратуры",
        href: "https://proverki.gov.ru/portal",
        external: true,
      },
    ];
  }
  return [
    {
      label: "Реестр исполнителей Ростехнадзора",
      href: "https://www.gosnadzor.ru/service/list/certification%20experts/",
      external: true,
    },
    {
      label: "Реестр заключений ЭПБ",
      href: registryHref,
    },
    {
      label: "Сервис проверки подлинности протоколов ИС ЕПТ",
      href: "https://qr.gosnadzor.ru/prombez",
      external: true,
    },
    {
      label: "Реестр средств измерений",
      href: "https://all-pribors.ru/grsilist",
      external: true,
    },
    {
      label: "Поверка приборов",
      regions: VERIFICATION_REGIONS,
    },
    {
      label: "Результаты поверки приборов",
      href: "https://grmetr.ru/arshin",
      external: true,
    },
    {
      label: "Проверки прокуратуры",
      href: "https://proverki.gov.ru/portal",
      external: true,
    },
  ];
}

/** Описывает сервисы кабинета, их ссылки, подписи и доступные роли. */
function createHeaderNavigation(role: UserRole): HeaderNavigationSection[] {
  const expertContactsHref = "/landing/expert-contacts";

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
        {
          label: "Подготовка к аттестации на исполнителя",
          soon: true,
        },
        {
          label: "Аттестация на дефектоскописта",
          href: "/landing/training/defectoscopist-certification",
          description:
            "Подготовка, аттестация и сертификация специалистов неразрушающего контроля в ООО «АРЦ НК».",
          logoSrc: "/ARC.png",
          logoAlt: "ООО «АРЦ НК»",
        },
        {
          label: "Дополнительное профессиональное образование ООО «НПИ «Недра»",
          href: "https://nedra-npi.ru/svedeniya/obrazovanie",
          external: true,
          description:
            "Повышение квалификации проектных специалистов и дополнительное профессиональное образование.",
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
          href: "/landing/rtn",
          description:
            "Письма и разъяснения Ростехнадзора с поиском по заголовку, номеру документа и направлениям надзора.",
        },
        {
          label: "Задать вопрос в Ростехнадзор",
          href: "/landing/rtn/ask",
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
        {
          label: "Расчёт анализа риска аварий",
          href: "/expert/hazard",
        },
        {
          label: "Расчёт остаточного ресурса",
          href: "/expert/lining",
        },
        {
          label: "Шаблоны зЭПБ",
          soon: true,
        },
      ],
    },
    {
      key: "help-customer",
      label: "Помощь заказчику",
      color: "green",
      roles: ["CUSTOMER"],
      items: [
        {
          label: "Проверка ЭО",
          href: "https://pb.nalog.ru/search.html#search-ul",
          external: true,
        },
        {
          label: "Рейтинг ЭО",
          href: "https://экг-рейтинг.рф",
          external: true,
        },
        {
          label: "Шаблоны ТЗ",
          soon: true,
        },
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

/** Возвращает разделы, доступные текущей роли в обеих версиях меню. */
export function getHeaderNavigation(role: UserRole): HeaderNavigationSection[] {
  return createHeaderNavigation(role).filter(
    (section) => !section.roles || section.roles.includes(role),
  );
}
