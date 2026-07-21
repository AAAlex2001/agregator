import type { StaticNewsIndexItem } from "../model/types";
import articles02 from "./articles-02";
import articles03 from "./articles-03";
import articles04 from "./articles-04";
import articles05 from "./articles-05";
import articles06 from "./articles-06";
import articles07 from "./articles-07";
import articles08 from "./articles-08";
import articles09 from "./articles-09";
import articles10 from "./articles-10";

const toIndex = (shard: number) => (item: (typeof articles02)[number]) => ({
  id: item.id,
  kind: item.kind,
  slug: item.slug,
  title: item.title,
  excerpt: item.excerpt,
  cover_image: item.cover_image,
  tg_cover_image: item.tg_cover_image,
  tags: item.tags,
  published_at: item.published_at,
  likes_count: item.likes_count,
  dislikes_count: item.dislikes_count,
  views_count: item.views_count,
  updated_at: item.updated_at,
  meta_title: item.meta_title,
  meta_description: item.meta_description,
  meta_keywords: item.meta_keywords,
  og_image: item.og_image,
  shard,
});

const shard02 = articles02.map(toIndex(2));
const shard03 = articles03.map(toIndex(3));
const shard04 = articles04.map(toIndex(4));
const shard05 = articles05.map(toIndex(5));
const shard06 = articles06.map(toIndex(6));
const shard07 = articles07.map(toIndex(7));
const shard08 = articles08.map(toIndex(8));
const shard09 = articles09.map(toIndex(9));
const shard10 = articles10.map(toIndex(10));

export const STATIC_NEWS_INDEX = [
  {
    "id": -1,
    "kind": "news",
    "slug": "provedenie-ekspertizy-promyshlennoy-bezopasnosti-etapy-sroki",
    "title": "Проведение экспертизы промышленной безопасности: этапы, сроки и стоимость",
    "excerpt": "Как проходит проведение экспертизы промышленной безопасности: правила, основные этапы, от чего зависят срок и стоимость ЭПБ и почему важна регистрация заключения в реестре Ростехнадзора.",
    "cover_image": "/articles/static-news/provedenie-ekspertizy-promyshlennoy-bezopasnosti-etapy-sroki.webp",
    "tg_cover_image": "/articles/static-news/provedenie-ekspertizy-promyshlennoy-bezopasnosti-etapy-sroki.webp",
    "tags": [
      "Новость"
    ],
    "published_at": "2026-06-19T09:00:00Z",
    "likes_count": 0,
    "dislikes_count": 0,
    "views_count": 0,
    "updated_at": "2026-06-19T09:00:00Z",
    "meta_title": "Проведение экспертизы промышленной безопасности: этапы, сроки, стоимость ЭПБ",
    "meta_description": "Проведение экспертизы промышленной безопасности: правила, этапы, срок и стоимость ЭПБ опасных производственных объектов, регистрация заключения в реестре Ростехнадзора.",
    "meta_keywords": "проведение экспертизы промышленной безопасности, правила проведения экспертизы, срок проведения экспертизы, стоимость ЭПБ, этапы экспертизы промышленной безопасности, ЭПБ, заключение экспертизы промышленной безопасности, опасные производственные объекты, аттестованные эксперты Ростехнадзора, техническое диагностирование",
    "og_image": "/articles/static-news/provedenie-ekspertizy-promyshlennoy-bezopasnosti-etapy-sroki.webp",
    "shard": 1
  },
  {
    "id": -2,
    "kind": "news",
    "slug": "zaklyuchenie-ekspertizy-promyshlennoy-bezopasnosti-reestr-rostehnadzora",
    "title": "Заключение экспертизы промышленной безопасности: как зарегистрировать в реестре Ростехнадзора",
    "excerpt": "Что такое заключение экспертизы промышленной безопасности, зачем нужен реестр заключений экспертизы промышленной безопасности и как зарегистрировать заключение в реестре Ростехнадзора в электронном виде.",
    "cover_image": "/articles/static-news/zaklyuchenie-ekspertizy-promyshlennoy-bezopasnosti-reestr-rostehnadzora.webp",
    "tg_cover_image": "/articles/static-news/zaklyuchenie-ekspertizy-promyshlennoy-bezopasnosti-reestr-rostehnadzora.webp",
    "tags": [
      "Новость"
    ],
    "published_at": "2026-06-19T09:00:00Z",
    "likes_count": 0,
    "dislikes_count": 0,
    "views_count": 0,
    "updated_at": "2026-06-19T09:00:00Z",
    "meta_title": "Заключение экспертизы промышленной безопасности: регистрация в реестре Ростехнадзора",
    "meta_description": "Заключение экспертизы промышленной безопасности: как зарегистрировать в реестре заключений экспертизы промышленной безопасности Ростехнадзора, зачем нужен реестр экспертиз и почему с 2026 года всё в электронном виде.",
    "meta_keywords": "заключение экспертизы промышленной безопасности, реестр заключений экспертизы промышленной безопасности, реестр экспертиз, регистрация заключения Ростехнадзор, реестр Ростехнадзора, ЭПБ, 116-ФЗ, аттестованные эксперты, электронная регистрация заключения, промышленная безопасность",
    "og_image": "/articles/static-news/zaklyuchenie-ekspertizy-promyshlennoy-bezopasnosti-reestr-rostehnadzora.webp",
    "shard": 1
  },
  {
    "id": -3,
    "kind": "news",
    "slug": "obekty-ekspertizy-promyshlennoy-bezopasnosti-chto-podlezhit-epb",
    "title": "Объекты экспертизы промышленной безопасности: что подлежит ЭПБ",
    "excerpt": "Какие объекты экспертизы промышленной безопасности существуют: технические устройства, здания и сооружения, документация и декларация. Разбираем, что именно подлежит ЭПБ согласно 116-ФЗ.",
    "cover_image": "/articles/static-news/obekty-ekspertizy-promyshlennoy-bezopasnosti-chto-podlezhit-epb.webp",
    "tg_cover_image": "/articles/static-news/obekty-ekspertizy-promyshlennoy-bezopasnosti-chto-podlezhit-epb.webp",
    "tags": [
      "Новость"
    ],
    "published_at": "2026-06-19T09:00:00Z",
    "likes_count": 0,
    "dislikes_count": 0,
    "views_count": 0,
    "updated_at": "2026-06-19T09:00:00Z",
    "meta_title": "Объекты экспертизы промышленной безопасности: что подлежит ЭПБ по 116-ФЗ",
    "meta_description": "Объекты экспертизы промышленной безопасности: технические устройства, здания и сооружения, документация и декларация. Что подлежит ЭПБ опасных производственных объектов согласно 116-ФЗ.",
    "meta_keywords": "объекты экспертизы промышленной безопасности, что подлежит ЭПБ, технические устройства, здания и сооружения ОПО, декларация промышленной безопасности, документация ОПО, 116-ФЗ, опасные производственные объекты, экспертиза промышленной безопасности, ЭПБ",
    "og_image": "/articles/static-news/obekty-ekspertizy-promyshlennoy-bezopasnosti-chto-podlezhit-epb.webp",
    "shard": 1
  },
  {
    "id": -4,
    "kind": "news",
    "slug": "ekspertiza-promyshlennoy-bezopasnosti-tehnicheskih-ustroystv",
    "title": "Экспертиза промышленной безопасности технических устройств",
    "excerpt": "Экспертиза промышленной безопасности технических устройств: когда оборудование ОПО подлежит ЭПБ, как проходит диагностирование и неразрушающий контроль и зачем регистрировать заключение в Ростехнадзоре.",
    "cover_image": "/articles/static-news/ekspertiza-promyshlennoy-bezopasnosti-tehnicheskih-ustroystv.webp",
    "tg_cover_image": "/articles/static-news/ekspertiza-promyshlennoy-bezopasnosti-tehnicheskih-ustroystv.webp",
    "tags": [
      "Новость"
    ],
    "published_at": "2026-06-19T09:00:00Z",
    "likes_count": 0,
    "dislikes_count": 0,
    "views_count": 0,
    "updated_at": "2026-06-19T09:00:00Z",
    "meta_title": "Экспертиза промышленной безопасности технических устройств — порядок и сроки",
    "meta_description": "Экспертиза промышленной безопасности технических устройств ОПО: когда оборудование подлежит ЭПБ, как проходят диагностирование и неразрушающий контроль и зачем регистрировать заключение в Ростехнадзоре.",
    "meta_keywords": "экспертиза промышленной безопасности технических устройств, экспертиза технических устройств, ЭПБ технического устройства, техническое диагностирование, неразрушающий контроль, 116-ФЗ, опасные производственные объекты, заключение экспертизы, аттестованные эксперты Ростехнадзора, остаточный ресурс оборудования",
    "og_image": "/articles/static-news/ekspertiza-promyshlennoy-bezopasnosti-tehnicheskih-ustroystv.webp",
    "shard": 1
  },
  {
    "id": -5,
    "kind": "news",
    "slug": "ekspertiza-promyshlennoy-bezopasnosti-zdaniy-i-sooruzheniy",
    "title": "Экспертиза промышленной безопасности зданий и сооружений ОПО",
    "excerpt": "Экспертиза промышленной безопасности зданий и сооружений на ОПО: когда нужно обследование, как оценивают несущие конструкции и почему заключение необходимо регистрировать в реестре Ростехнадзора.",
    "cover_image": "/articles/static-news/ekspertiza-promyshlennoy-bezopasnosti-zdaniy-i-sooruzheniy.webp",
    "tg_cover_image": "/articles/static-news/ekspertiza-promyshlennoy-bezopasnosti-zdaniy-i-sooruzheniy.webp",
    "tags": [
      "Новость"
    ],
    "published_at": "2026-06-19T09:00:00Z",
    "likes_count": 0,
    "dislikes_count": 0,
    "views_count": 0,
    "updated_at": "2026-06-19T09:00:00Z",
    "meta_title": "Экспертиза промышленной безопасности зданий и сооружений ОПО — порядок и сроки",
    "meta_description": "Экспертиза промышленной безопасности зданий и сооружений на ОПО: когда нужно обследование, как оценивают несущие конструкции по 116-ФЗ и зачем регистрировать заключение в реестре Ростехнадзора.",
    "meta_keywords": "экспертиза промышленной безопасности зданий и сооружений, экспертиза зданий и сооружений ОПО, обследование зданий и сооружений, ЭПБ зданий, несущие конструкции, 116-ФЗ, опасные производственные объекты, заключение экспертизы, аттестованные эксперты Ростехнадзора, неразрушающий контроль",
    "og_image": "/articles/static-news/ekspertiza-promyshlennoy-bezopasnosti-zdaniy-i-sooruzheniy.webp",
    "shard": 1
  },
  {
    "id": -6,
    "kind": "news",
    "slug": "ekspertiza-promyshlennoy-bezopasnosti-dokumentacii-opo",
    "title": "Экспертиза промышленной безопасности документации ОПО: консервация, ликвидация, техническое перевооружение",
    "excerpt": "Когда нужна экспертиза документации ОПО на консервацию, ликвидацию и техническое перевооружение, что входит в декларацию промышленной безопасности и как заключение вносится в реестр Ростехнадзора.",
    "cover_image": "/articles/static-news/ekspertiza-promyshlennoy-bezopasnosti-dokumentacii-opo.webp",
    "tg_cover_image": "/articles/static-news/ekspertiza-promyshlennoy-bezopasnosti-dokumentacii-opo.webp",
    "tags": [
      "Новость"
    ],
    "published_at": "2026-06-19T09:00:00Z",
    "likes_count": 0,
    "dislikes_count": 0,
    "views_count": 0,
    "updated_at": "2026-06-19T09:00:00Z",
    "meta_title": "Экспертиза промышленной безопасности документации ОПО — консервация, ликвидация, перевооружение",
    "meta_description": "Экспертиза документации ОПО: консервация, ликвидация, техническое перевооружение и декларация промышленной безопасности. Что проверяет эксперт и как заключение вносится в реестр Ростехнадзора.",
    "meta_keywords": "экспертиза документации ОПО, экспертиза промышленной безопасности документации, консервация ОПО, ликвидация ОПО, техническое перевооружение, декларация промышленной безопасности, заключение ЭПБ, реестр Ростехнадзора, опасный производственный объект, 116-ФЗ",
    "og_image": "/articles/static-news/ekspertiza-promyshlennoy-bezopasnosti-dokumentacii-opo.webp",
    "shard": 1
  },
  {
    "id": -7,
    "kind": "news",
    "slug": "licenziya-na-provedenie-ekspertizy-promyshlennoy-bezopasnosti",
    "title": "Лицензия на проведение экспертизы промышленной безопасности: требования к экспертной организации",
    "excerpt": "Зачем нужна лицензия на проведение экспертизы промышленной безопасности, какие требования предъявляют к экспертной организации и как заказчику проверить, что ЭПБ проведёт законный исполнитель.",
    "cover_image": "/articles/static-news/licenziya-na-provedenie-ekspertizy-promyshlennoy-bezopasnosti.webp",
    "tg_cover_image": "/articles/static-news/licenziya-na-provedenie-ekspertizy-promyshlennoy-bezopasnosti.webp",
    "tags": [
      "Новость"
    ],
    "published_at": "2026-06-19T09:00:00Z",
    "likes_count": 0,
    "dislikes_count": 0,
    "views_count": 0,
    "updated_at": "2026-06-19T09:00:00Z",
    "meta_title": "Лицензия на проведение экспертизы промышленной безопасности — требования к экспертной организации",
    "meta_description": "Лицензия Ростехнадзора на проведение экспертизы промышленной безопасности: требования к экспертной организации, как заказчику проверить исполнителя ЭПБ и почему без лицензии заключение недействительно.",
    "meta_keywords": "лицензия на проведение экспертизы промышленной безопасности, организации экспертизы промышленной безопасности, экспертная организация, лицензия Ростехнадзора, ЭПБ, требования к экспертной организации, лицензируемый вид деятельности, аттестованные эксперты, реестр заключений, опасный производственный объект",
    "og_image": "/articles/static-news/licenziya-na-provedenie-ekspertizy-promyshlennoy-bezopasnosti.webp",
    "shard": 1
  },
  {
    "id": -8,
    "kind": "news",
    "slug": "reestr-ekspertov-promyshlennoy-bezopasnosti-kategorii-attestaciya",
    "title": "Реестр экспертов промышленной безопасности: категории и аттестация экспертов",
    "excerpt": "Что такое реестр экспертов промышленной безопасности, как проходит аттестация экспертов по промышленной безопасности и чем отличаются категории I, II и III при проведении ЭПБ.",
    "cover_image": "/articles/static-news/reestr-ekspertov-promyshlennoy-bezopasnosti-kategorii-attestaciya.webp",
    "tg_cover_image": "/articles/static-news/reestr-ekspertov-promyshlennoy-bezopasnosti-kategorii-attestaciya.webp",
    "tags": [
      "Новость"
    ],
    "published_at": "2026-06-19T09:00:00Z",
    "likes_count": 0,
    "dislikes_count": 0,
    "views_count": 0,
    "updated_at": "2026-06-19T09:00:00Z",
    "meta_title": "Реестр экспертов промышленной безопасности — категории и аттестация экспертов",
    "meta_description": "Реестр экспертов промышленной безопасности Ростехнадзора: как проходит аттестация экспертов по промышленной безопасности, чем отличаются категории I, II, III и зачем заказчику проверять эксперта.",
    "meta_keywords": "реестр экспертов промышленной безопасности, аттестация экспертов по промышленной безопасности, категории экспертов, эксперт ЭПБ, реестр Ростехнадзора, категория эксперта, аттестация эксперта, экспертиза промышленной безопасности, класс опасности ОПО, квалификация эксперта",
    "og_image": "/articles/static-news/reestr-ekspertov-promyshlennoy-bezopasnosti-kategorii-attestaciya.webp",
    "shard": 1
  },
  {
    "id": -9,
    "kind": "news",
    "slug": "ekspert-v-oblasti-promyshlennoy-bezopasnosti-kto-eto-trebovaniya",
    "title": "Эксперт в области промышленной безопасности: кто это, требования и категории",
    "excerpt": "Кто такой эксперт в области промышленной безопасности, какие требования к нему предъявляются, чем определяются категории и почему статус эксперта по промышленной безопасности важен для заказчика ЭПБ.",
    "cover_image": "/articles/static-news/ekspert-v-oblasti-promyshlennoy-bezopasnosti-kto-eto-trebovaniya.webp",
    "tg_cover_image": "/articles/static-news/ekspert-v-oblasti-promyshlennoy-bezopasnosti-kto-eto-trebovaniya.webp",
    "tags": [
      "Новость"
    ],
    "published_at": "2026-06-19T09:00:00Z",
    "likes_count": 0,
    "dislikes_count": 0,
    "views_count": 0,
    "updated_at": "2026-06-19T09:00:00Z",
    "meta_title": "Эксперт в области промышленной безопасности — кто это, требования и категории",
    "meta_description": "Эксперт в области промышленной безопасности: кто это, какие требования к эксперту по промышленной безопасности, как категории определяют допуск к ОПО и почему статус важен для заказчика ЭПБ.",
    "meta_keywords": "эксперт в области промышленной безопасности, эксперт по промышленной безопасности, требования к эксперту, категории экспертов, аттестация эксперта, реестр экспертов, ЭПБ, опасный производственный объект, неразрушающий контроль, техническое диагностирование",
    "og_image": "/articles/static-news/ekspert-v-oblasti-promyshlennoy-bezopasnosti-kto-eto-trebovaniya.webp",
    "shard": 1
  },
  {
    "id": -10,
    "kind": "news",
    "slug": "elektronnaya-registraciya-zaklucheniy-epb-s-1-sentyabrya-2026",
    "title": "Электронная регистрация заключений ЭПБ с 1 сентября 2026 года: что меняется",
    "excerpt": "С 1 сентября 2026 года подача и регистрация заключений ЭПБ в Ростехнадзоре переходят в электронный вид. Разбираем, что меняется в работе с реестром заключений и как к этому подготовиться.",
    "cover_image": "/articles/static-news/elektronnaya-registraciya-zaklucheniy-epb-s-1-sentyabrya-2026.webp",
    "tg_cover_image": "/articles/static-news/elektronnaya-registraciya-zaklucheniy-epb-s-1-sentyabrya-2026.webp",
    "tags": [
      "Новость"
    ],
    "published_at": "2026-06-19T09:00:00Z",
    "likes_count": 0,
    "dislikes_count": 0,
    "views_count": 0,
    "updated_at": "2026-06-19T09:00:00Z",
    "meta_title": "Электронная регистрация заключений ЭПБ с 1 сентября 2026 года — что меняется в реестре Ростехнадзора",
    "meta_description": "С 1 сентября 2026 года регистрация заключений ЭПБ в Ростехнадзоре — только в электронном виде. Что меняется в работе с реестром заключений, зачем нужна регистрация заключения и как подготовиться.",
    "meta_keywords": "электронная регистрация заключений ЭПБ, реестр заключений, регистрация заключения ЭПБ, Ростехнадзор, заключение экспертизы промышленной безопасности, реестр Ростехнадзора, 1 сентября 2026, электронный вид, экспертиза промышленной безопасности, опасный производственный объект",
    "og_image": "/articles/static-news/elektronnaya-registraciya-zaklucheniy-epb-s-1-sentyabrya-2026.webp",
    "shard": 1
  },
  ...shard02,
  ...shard03,
  ...shard04,
  ...shard05,
  ...shard06,
  ...shard07,
  ...shard08,
  ...shard09,
  ...shard10,
] satisfies readonly StaticNewsIndexItem[];
