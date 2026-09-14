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
import articles11 from "./articles-11";
import articles12 from "./articles-12";
import articles13 from "./articles-13";
import articles14 from "./articles-14";
import articles15 from "./articles-15";
import articles16 from "./articles-16";
import articles17 from "./articles-17";
import articles18 from "./articles-18";
import articles19 from "./articles-19";
import articles20 from "./articles-20";
import articles21 from "./articles-21";
import articles22 from "./articles-22";
import articles23 from "./articles-23";
import articles24 from "./articles-24";
import articles25 from "./articles-25";
import articles26 from "./articles-26";
import articles27 from "./articles-27";
import articles28 from "./articles-28";
import articles29 from "./articles-29";
import articles30 from "./articles-30";
import articles31 from "./articles-31";
import articles32 from "./articles-32";
import articles33 from "./articles-33";
import articles34 from "./articles-34";
import articles35 from "./articles-35";
import articles36 from "./articles-36";
import articles37 from "./articles-37";
import articles38 from "./articles-38";
import articles39 from "./articles-39";
import articles40 from "./articles-40";
import articles41 from "./articles-41";
import articles42 from "./articles-42";
import articles43 from "./articles-43";
import articles44 from "./articles-44";
import articles45 from "./articles-45";
import articles46 from "./articles-46";
import articles47 from "./articles-47";
import articles48 from "./articles-48";
import articles49 from "./articles-49";
import articles50 from "./articles-50";
import articles51 from "./articles-51";
import articles52 from "./articles-52";
import articles53 from "./articles-53";
import articles54 from "./articles-54";
import articles55 from "./articles-55";
import articles56 from "./articles-56";
import articles57 from "./articles-57";
import articles58 from "./articles-58";
import articles59 from "./articles-59";
import articles60 from "./articles-60";
import articles61 from "./articles-61";
import articles62 from "./articles-62";
import articles63 from "./articles-63";
import articles64 from "./articles-64";
import articles65 from "./articles-65";
import articles66 from "./articles-66";
import articles67 from "./articles-67";
import articles68 from "./articles-68";
import articles69 from "./articles-69";
import articles70 from "./articles-70";
import articles71 from "./articles-71";
import articles72 from "./articles-72";
import articles73 from "./articles-73";
import articles74 from "./articles-74";
import articles75 from "./articles-75";
import articles76 from "./articles-76";
import articles77 from "./articles-77";
import articles78 from "./articles-78";
import articles79 from "./articles-79";
import articles80 from "./articles-80";
import articles81 from "./articles-81";
import articles82 from "./articles-82";
import articles83 from "./articles-83";

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
const shard11 = articles11.map(toIndex(11));
const shard12 = articles12.map(toIndex(12));
const shard13 = articles13.map(toIndex(13));
const shard14 = articles14.map(toIndex(14));
const shard15 = articles15.map(toIndex(15));
const shard16 = articles16.map(toIndex(16));
const shard17 = articles17.map(toIndex(17));
const shard18 = articles18.map(toIndex(18));
const shard19 = articles19.map(toIndex(19));
const shard20 = articles20.map(toIndex(20));
const shard21 = articles21.map(toIndex(21));
const shard22 = articles22.map(toIndex(22));
const shard23 = articles23.map(toIndex(23));
const shard24 = articles24.map(toIndex(24));
const shard25 = articles25.map(toIndex(25));
const shard26 = articles26.map(toIndex(26));
const shard27 = articles27.map(toIndex(27));
const shard28 = articles28.map(toIndex(28));
const shard29 = articles29.map(toIndex(29));
const shard30 = articles30.map(toIndex(30));
const shard31 = articles31.map(toIndex(31));
const shard32 = articles32.map(toIndex(32));
const shard33 = articles33.map(toIndex(33));
const shard34 = articles34.map(toIndex(34));
const shard35 = articles35.map(toIndex(35));
const shard36 = articles36.map(toIndex(36));
const shard37 = articles37.map(toIndex(37));
const shard38 = articles38.map(toIndex(38));
const shard39 = articles39.map(toIndex(39));
const shard40 = articles40.map(toIndex(40));
const shard41 = articles41.map(toIndex(41));
const shard42 = articles42.map(toIndex(42));
const shard43 = articles43.map(toIndex(43));
const shard44 = articles44.map(toIndex(44));
const shard45 = articles45.map(toIndex(45));
const shard46 = articles46.map(toIndex(46));
const shard47 = articles47.map(toIndex(47));
const shard48 = articles48.map(toIndex(48));
const shard49 = articles49.map(toIndex(49));
const shard50 = articles50.map(toIndex(50));
const shard51 = articles51.map(toIndex(51));
const shard52 = articles52.map(toIndex(52));
const shard53 = articles53.map(toIndex(53));
const shard54 = articles54.map(toIndex(54));
const shard55 = articles55.map(toIndex(55));
const shard56 = articles56.map(toIndex(56));
const shard57 = articles57.map(toIndex(57));
const shard58 = articles58.map(toIndex(58));
const shard59 = articles59.map(toIndex(59));
const shard60 = articles60.map(toIndex(60));
const shard61 = articles61.map(toIndex(61));
const shard62 = articles62.map(toIndex(62));
const shard63 = articles63.map(toIndex(63));
const shard64 = articles64.map(toIndex(64));
const shard65 = articles65.map(toIndex(65));
const shard66 = articles66.map(toIndex(66));
const shard67 = articles67.map(toIndex(67));
const shard68 = articles68.map(toIndex(68));
const shard69 = articles69.map(toIndex(69));
const shard70 = articles70.map(toIndex(70));
const shard71 = articles71.map(toIndex(71));
const shard72 = articles72.map(toIndex(72));
const shard73 = articles73.map(toIndex(73));
const shard74 = articles74.map(toIndex(74));
const shard75 = articles75.map(toIndex(75));
const shard76 = articles76.map(toIndex(76));
const shard77 = articles77.map(toIndex(77));
const shard78 = articles78.map(toIndex(78));
const shard79 = articles79.map(toIndex(79));
const shard80 = articles80.map(toIndex(80));
const shard81 = articles81.map(toIndex(81));
const shard82 = articles82.map(toIndex(82));
const shard83 = articles83.map(toIndex(83));

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
  ...shard11,
  ...shard12,
  ...shard13,
  ...shard14,
  ...shard15,
  ...shard16,
  ...shard17,
  ...shard18,
  ...shard19,
  ...shard20,
  ...shard21,
  ...shard22,
  ...shard23,
  ...shard24,
  ...shard25,
  ...shard26,
  ...shard27,
  ...shard28,
  ...shard29,
  ...shard30,
  ...shard31,
  ...shard32,
  ...shard33,
  ...shard34,
  ...shard35,
  ...shard36,
  ...shard37,
  ...shard38,
  ...shard39,
  ...shard40,
  ...shard41,
  ...shard42,
  ...shard43,
  ...shard44,
  ...shard45,
  ...shard46,
  ...shard47,
  ...shard48,
  ...shard49,
  ...shard50,
  ...shard51,
  ...shard52,
  ...shard53,
  ...shard54,
  ...shard55,
  ...shard56,
  ...shard57,
  ...shard58,
  ...shard59,
  ...shard60,
  ...shard61,
  ...shard62,
  ...shard63,
  ...shard64,
  ...shard65,
  ...shard66,
  ...shard67,
  ...shard68,
  ...shard69,
  ...shard70,
  ...shard71,
  ...shard72,
  ...shard73,
  ...shard74,
  ...shard75,
  ...shard76,
  ...shard77,
  ...shard78,
  ...shard79,
  ...shard80,
  ...shard81,
  ...shard82,
  ...shard83,
] satisfies readonly StaticNewsIndexItem[];
