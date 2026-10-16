import type { HeaderRegion } from "../model/types";

/** Ссылки организаций поверки приборов в региональном подменю. */
export const VERIFICATION_REGIONS: HeaderRegion[] = [
  {
    region: "ЦФО (Москва и область)",
    links: [
      {
        label: "rostest.ru",
        href: "https://www.rostest.ru/page/contacts/",
      },
      {
        label: "vniiofi.ru",
        href: "https://www.vniiofi.ru/services/poverka-sredstv-izmerenii.html",
      },
    ],
  },
  {
    region: "СЗФО (Ленинградская область)",
    links: [
      {
        label: "rustest.spb.ru",
        href: "https://rustest.spb.ru/poverka-i-kalibrovka/poverka/",
      },
    ],
  },
  {
    region: "ЮФО (Ростовская область, Краснодарский край)",
    links: [
      {
        label: "cmtr.ru",
        href: "https://cmtr.ru/uslugi/nerazrushayuschiy-kontrol/",
      },
      {
        label: "krasnodarcsm.ru",
        href: "https://krasnodarcsm.ru/poverka-i-kalibrovka/proverka-sredstv-izmerenij/",
      },
    ],
  },
  {
    region: "СКФО (Дагестан)",
    links: [
      {
        label: "dagcsm.ru",
        href: "https://dagcsm.ru/klientam/price/",
      },
    ],
  },
  {
    region: "ПФО (Саратов)",
    links: [
      {
        label: "gosmera.ru",
        href: "https://gosmera.ru/content/price.html",
      },
    ],
  },
  {
    region: "УФО (Екатеринбург)",
    links: [
      {
        label: "kb-agava.ru",
        href: "https://www.kb-agava.ru/uslugi/poverka",
      },
      {
        label: "uniim.ru",
        href: "https://uniim.ru/verification/",
      },
    ],
  },
  {
    region: "СФО (Новосибирск, Новокузнецк, Барнаул)",
    links: [
      {
        label: "ncsm.ru",
        href: "https://www.ncsm.ru/service/metrologiya/",
      },
      {
        label: "altcsm.ru",
        href: "https://altcsm.ru/services/technical-regulation/",
      },
    ],
  },
  {
    region: "ДФО (Владивосток, Хабаровск)",
    links: [
      {
        label: "dfocsm.ru",
        href: "https://dfocsm.ru/",
      },
      {
        label: "vniiftridf.ru",
        href: "https://vniiftridf.ru/index.php/services/186-metrologicheskie-uslugi",
      },
    ],
  },
];
