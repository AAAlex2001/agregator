export interface ZepbRegistry {
  name: string;
  site: string;
  url: string;
  note: string;
}

export const REGISTRIES: ZepbRegistry[] = [
  {
    name: "Межрегиональное технологическое управление Ростехнадзора",
    site: "mos.gosnadzor.ru",
    url: "http://mos.gosnadzor.ru/activity/svedeniya/",
    note: "Сведения из Реестра заключений экспертизы промышленной безопасности. Сведений об исключенных ЗЭПБ не приведено.",
  },
  {
    name: "Центральное управление Ростехнадзора",
    site: "cntr.gosnadzor.ru",
    url: "http://cntr.gosnadzor.ru/activity/gu/exp/reestr-eekspertiz.php",
    note: "Сведения из Реестра заключений экспертизы промышленной безопасности. Сведений об исключенных ЗЭПБ не приведено.",
  },
  {
    name: "Верхне-Донское управление Ростехнадзора",
    site: "vdon.gosnadzor.ru",
    url: "http://vdon.gosnadzor.ru/activity/gosuslugi/",
    note: "Сведения из реестра заключений экспертизы промышленной безопасности. Реестр ЭПБ. Сведений об исключенных ЗЭПБ не приведено.",
  },
  {
    name: "Приокское управление Ростехнадзора",
    site: "priok.gosnadzor.ru",
    url: "http://priok.gosnadzor.ru/activity/expertise/",
    note: "Сведения из реестра заключений экспертиз промышленной безопасности. Исключённые ЗЭПБ входят в сведения из реестра. Поиск по фильтру статуса.",
  },
  {
    name: "Северо-Западное управление Ростехнадзора",
    site: "szap.gosnadzor.ru",
    url: "http://szap.gosnadzor.ru/activity/ekspert/svedeniya-iz-reestra/",
    note: "Сведения из Реестра заключений экспертизы промышленной безопасности. Сведений об исключенных ЗЭПБ не приведено.",
  },
  {
    name: "Печорское управление Ростехнадзора",
    site: "pech.gosnadzor.ru",
    url: "http://pech.gosnadzor.ru/activity/service/list/zepb/",
    note: "Заключения экспертизы промышленной безопасности, исключённые из реестра.",
  },
  {
    name: "Нижне-Волжское управление Ростехнадзора",
    site: "nvol.gosnadzor.ru",
    url: "http://nvol.gosnadzor.ru/activity/expert/",
    note: "Сведения из Реестра заключений экспертизы промышленной безопасности. Исключённые ЗЭПБ входят в сведения из реестра. Поиск по фильтру даты исключения из реестра.",
  },
  {
    name: "Северо-Кавказское управление Ростехнадзора",
    site: "sevkav.gosnadzor.ru",
    url: "http://sevkav.gosnadzor.ru/activity/gosudarstvennye-uslugi/svedeniya-iz-reestra-zaklyucheniy-ekspertiz-promyshlennoy-bezopasnosti.php",
    note: "Сведения об исключении заключения экспертизы промышленной безопасности из Реестра заключений экспертиз промышленной безопасности.",
  },
  {
    name: "Межрегиональное управление Ростехнадзора по Республике Крым и г. Севастополю",
    site: "crim.gosnadzor.ru",
    url: "http://crim.gosnadzor.ru/activity/expbopo/",
    note: "Сведения из реестра заключений экспертизы промышленной безопасности.",
  },
  {
    name: "Кавказское управление Ростехнадзора",
    site: "kav.gosnadzor.ru",
    url: "http://sevkav.gosnadzor.ru/activity/gosudarstvennye-uslugi/svedeniya-iz-reestra-zaklyucheniy-ekspertiz-promyshlennoy-bezopasnosti.php",
    note: "Сведения об исключении заключения экспертизы промышленной безопасности из Реестра заключений экспертиз промышленной безопасности.",
  },
  {
    name: "Волжско-Окское управление Ростехнадзора",
    site: "volok.gosnadzor.ru",
    url: "http://volok.gosnadzor.ru/activity/gosudarstvennye-uslugi/epb/reestr/reestr.php",
    note: "Исключенные из реестра экспертизы промышленной безопасности за 2025 год, по состоянию на 28 февраля.",
  },
  {
    name: "Западно-Уральское управление Ростехнадзора",
    site: "zural.gosnadzor.ru",
    url: "http://www.zural.gosnadzor.ru/activity/expert2/",
    note: "Реестр исключенных заключений экспертизы промышленной безопасности.",
  },
  {
    name: "Приволжское управление Ростехнадзора",
    site: "privol.gosnadzor.ru",
    url: "http://privol.gosnadzor.ru/activity/expertiza/sved_zepb.php",
    note: "Сведения из Реестра заключений экспертизы промышленной безопасности. Сведений об исключенных ЗЭПБ не приведено.",
  },
  {
    name: "Средне-Поволжское управление Ростехнадзора",
    site: "srpov.gosnadzor.ru",
    url: "http://srpov.gosnadzor.ru/activity/expertiza/",
    note: "Сведения из реестра заключений экспертиз промышленной безопасности. Исключённые ЗЭПБ входят в сведения из реестра. Поиск по фильтру статуса.",
  },
  {
    name: "Северо-Уральское управление Ростехнадзора",
    site: "sural.gosnadzor.ru",
    url: "http://www.sural.gosnadzor.ru/activity/ekspertiza-pb/data/index.php",
    note: "Сведения из Реестра заключений экспертизы промышленной безопасности. Сведений об исключенных ЗЭПБ не приведено.",
  },
  {
    name: "Уральское управление Ростехнадзора",
    site: "ural.gosnadzor.ru",
    url: "http://ural.gosnadzor.ru/activity/regisntration_2/svedeniya/",
    note: "Сведения из Реестра заключений экспертизы промышленной безопасности. Исключённые ЗЭПБ входят в сведения из реестра. Поиск по фильтру даты исключения из реестра.",
  },
  {
    name: "Енисейское управление Ростехнадзора",
    site: "enis.gosnadzor.ru",
    url: "http://enis.gosnadzor.ru/activity/expbopo/",
    note: "Сведения из реестра ЗЭПБ. Исключённые ЗЭПБ входят в сведения из реестра. Поиск по фильтру статуса.",
  },
  {
    name: "Сибирское управление Ростехнадзора",
    site: "usib.gosnadzor.ru",
    url: "http://usib.gosnadzor.ru/activity/registration/ekspertiza.php",
    note: "Пункт 10: сведения об исключении заключения экспертизы промышленной безопасности из Реестра заключений экспертиз промышленной безопасности с 30.05.2018 по 28.06.2026.",
  },
  {
    name: "Дальневосточное управление Ростехнадзора",
    site: "dvost.gosnadzor.ru",
    url: "http://dvost.gosnadzor.ru/activity/government_services/industrial_safety_expertise_register/registry/index.php",
    note: "Сведения из реестра заключений экспертизы промышленной безопасности. Сведений об исключенных ЗЭПБ не приведено.",
  },
  {
    name: "Ленское управление Ростехнадзора",
    site: "lensk.gosnadzor.ru",
    url: "http://www.lensk.gosnadzor.ru/activity/gosudarstvennye-uslugi-upravleniya/vedenie-reestra-zaklyucheniy-ekspertizy-promyshlennoy-bezopasnosti/zhurnaly-vneseniya-zaklyucheniy-ekspertizy-pb.php",
    note: "Сведения об исключении заключения экспертизы ПБ из Реестра. Исключённые ЗЭПБ также входят в сведения из реестра. Поиск по фильтру статуса.",
  },
  {
    name: "Сахалинское управление Ростехнадзора",
    site: "sahal.gosnadzor.ru",
    url: "http://www.sahal.gosnadzor.ru/activity/gosuslugirtn/СИЭР%202026%20(для%20сайта).xlsx",
    note: "Сведения из Реестра заключений экспертизы промышленной безопасности. Сведений об исключенных ЗЭПБ не приведено.",
  },
  {
    name: "Забайкальское управление Ростехнадзора",
    site: "zab.gosnadzor.ru",
    url: "http://zab.gosnadzor.ru/activity/expert_OPO/sved_from_reestr/",
    note: "Сведения из реестра заключения экспертизы. Сведений об исключенных ЗЭПБ не приведено.",
  },
  {
    name: "Северо-Восточное управление Ростехнадзора",
    site: "svost.gosnadzor.ru",
    url: "http://svost.gosnadzor.ru/activity/ЗЭПБ/svedeniya-iz-reestra-zaklyucheniy-ekspertiz-promyshlennoy-bezopasnosti-/index.php",
    note: "Сведения об исключенных из реестра заключений экспертиз промышленной безопасности.",
  },
  {
    name: "Донецкое управление Ростехнадзора",
    site: "dnr.gosnadzor.ru",
    url: "http://dnr.gosnadzor.ru/activity/gosudarstvennye-uslugi/vedenie-zaklyucheniy-ekspertizy-promyshlennoy-bezopasnost/",
    note: "Сведения из реестра заключений экспертиз промышленной безопасности за 2026 год. Исключённые ЗЭПБ входят в сведения из реестра. Поиск по фильтру статуса.",
  },
  {
    name: "Луганское управление Ростехнадзора",
    site: "lnr.gosnadzor.ru",
    url: "http://lnr.gosnadzor.ru/activity/gosuslugi/",
    note: "Сведения из Реестра заключений экспертизы промышленной безопасности. Сведений об исключенных ЗЭПБ не приведено.",
  },
  {
    name: "Запорожское управление Ростехнадзора",
    site: "zpr.gosnadzor.ru",
    url: "http://zpr.gosnadzor.ru/activity/expbopo/index.php",
    note: "Не обновлялся с 2023 года.",
  },
  {
    name: "Херсонское управление Ростехнадзора",
    site: "kho.gosnadzor.ru",
    url: "http://szap.gosnadzor.ru/activity/ekspert/svedeniya-iz-reestra/",
    note: "Не обновлялся с 2023 года.",
  },
];
