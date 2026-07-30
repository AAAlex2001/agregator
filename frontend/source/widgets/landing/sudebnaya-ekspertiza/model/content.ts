import type { AudienceBlock } from "../../ui/AudienceSection";
import type { ServiceLandingBullet } from "../../ui/ServiceLandingHero";

export const FORENSIC_TITLE = "Судебная экспертиза — подбор экспертов для суда";

export const FORENSIC_SUBTITLE =
  "Процессуальное действие, состоящее из проведения исследований и дачи заключения экспертом по вопросам, разрешение которых требует специальных знаний в области науки, техники, искусства или ремесла, и которые поставлены перед экспертом судом, судьёй, органом дознания, лицом, производящим дознание, следователем, в целях установления обстоятельств, подлежащих доказыванию по конкретному делу.";

export const FORENSIC_CLAIM = "Эксперты помогут Вам добиться справедливости в суде!";

export const FORENSIC_META_DESCRIPTION =
  "Судебная экспертиза: инженерно-техническая, строительная, землеустроительная, охраны труда. Разместите заявку — эксперты с профильным образованием и опытом откликнутся с ценой и сроками.";

export const FORENSIC_KEYWORDS = [
  "судебная экспертиза",
  "судебный эксперт",
  "инженерно-техническая экспертиза",
  "строительная экспертиза",
  "землеустроительная экспертиза",
  "рецензия на заключение эксперта",
  "заключение эксперта для суда",
  "экспертиза охраны труда",
];

export const FORENSIC_COVER = "/services/10.webp";

export const FORENSIC_BULLETS: ServiceLandingBullet[] = [
  {
    title: "Опишите задачу",
    text: "Укажите наименование судебной экспертизы, приложите материалы и требования к исполнителю.",
  },
  {
    title: "Получите отклики",
    text: "Эксперты с профильным образованием и опытом аналогичных экспертиз откликнутся с ценой и сроками.",
  },
  {
    title: "Выберите исполнителя",
    text: "Сравните квалификацию, дипломы и предложения — выберите специалиста напрямую, без посредников.",
  },
];

export interface ForensicExpertiseItem {
  label: string;
  href: string;
}

export interface ForensicExpertiseGroup {
  id: string;
  tab: string;
  title: string;
  href: string;
  description: string;
  items: ForensicExpertiseItem[];
}

export const FORENSIC_GROUPS: ForensicExpertiseGroup[] = [
  {
    id: "engineering",
    tab: "Инженерно-техническая",
    title: "Инженерно-техническая экспертиза",
    href: "https://sudexpa.ru/expertises/inzhenerno-tekhnicheskaia-ekspertiza/",
    description:
      "Исследование оборудования, инженерных сетей, технологических процессов и технической документации для установления причин отказов, аварий и несоответствий.",
    items: [
      {
        label: "Экспертиза технологического процесса",
        href: "https://sudexpa.ru/expertises/ekspertiza-tekhnologicheskogo-protcessa/",
      },
      {
        label: "Экспертиза инженерных сетей",
        href: "https://sudexpa.ru/expertises/ekspertiza-inzhenernykh-setei/",
      },
      {
        label: "Экспертиза промышленного оборудования",
        href: "https://sudexpa.ru/expertises/ekspertiza-promyshlennogo-oborudovaniia/",
      },
      {
        label: "Экспертиза производственного оборудования",
        href: "https://sudexpa.ru/expertises/ekspertiza-promyshlennogo-oborudovaniia/",
      },
      {
        label: "Экспертиза сооружений специального назначения",
        href: "https://sudexpa.ru/expertises/ekspertiza-sooruzhenii-spetcialnogo-naznacheniia/",
      },
      {
        label: "Экспертиза технической документации",
        href: "https://sudexpa.ru/expertises/ekspertiza-tekhnicheskoi-dokumentatcii/",
      },
      {
        label: "Рецензия на заключение инженерной экспертизы",
        href: "https://sudexpa.ru/expertises/recenziia-na-zacliuchenie-inzhenernoi-ekspertizy/",
      },
    ],
  },
  {
    id: "construction",
    tab: "Строительная",
    title: "Строительная экспертиза",
    href: "https://sudexpa.ru/expertises/stroitelnaia-ekspertiza/",
    description:
      "Оценка состояния зданий и сооружений, качества работ и материалов, размера ущерба, соответствия проектной документации и строительным нормам.",
    items: [
      {
        label: "Экспертиза зданий и сооружений",
        href: "https://sudexpa.ru/expertises/ekspertiza-zdanii-i-sooruzhenii/",
      },
      {
        label: "Экспертиза газопроводов и нефтепроводов",
        href: "https://sudexpa.ru/expertises/ekspertiza-gazo-i-nefteprovodov/",
      },
      {
        label: "Экспертиза дорог и дорожных покрытий",
        href: "https://sudexpa.ru/expertises/ekspertiza-gazo-i-nefteprovodov/",
      },
      {
        label: "Экспертиза соответствия здания строительным нормам и правилам (СНиП)",
        href: "https://sudexpa.ru/expertises/ekspertiza-sootvetstviia-zdaniia-stroitelnym-normam-i-pravilam-snip/",
      },
      {
        label: "Экспертиза для определения вариантов раздела дома",
        href: "https://sudexpa.ru/expertises/ekspertiza-dlia-opredeleniia-variantov-razdela-doma/",
      },
      {
        label: "Экспертиза для сноса самовольной постройки",
        href: "https://sudexpa.ru/expertises/ekspertiza-dlia-snosa-samovolnoi-postroiki/",
      },
      {
        label: "Экспертиза размеров ущерба недвижимому имуществу",
        href: "https://sudexpa.ru/expertises/opredelenie-razmerov-ushcherba-nedvizhimomu-imushchestvu/",
      },
      {
        label: "Экспертиза для признания здания аварийным",
        href: "https://sudexpa.ru/expertises/ekspertiza-dlia-priznaniia-zdaniia-avariinym/",
      },
      {
        label: "Экспертиза при приемке квартиры от застройщика",
        href: "https://sudexpa.ru/expertises/ekspertiza-kvartiry-ot-zastroishchika/",
      },
      {
        label: "Экспертиза после залива квартиры",
        href: "https://sudexpa.ru/expertises/ekspertiza-posle-zaliva-kvartiry/",
      },
      {
        label: "Экспертиза строительных материалов",
        href: "https://sudexpa.ru/expertises/ekspertiza-stroitelnykh-materialov/",
      },
      {
        label: "Экспертиза проектно-сметной документации",
        href: "https://sudexpa.ru/expertises/ekspertiza-proektno-smetnoi-dokumentatcii/",
      },
      {
        label: "Экспертиза строительных проектов",
        href: "https://sudexpa.ru/expertises/ekspertiza-stroitelnykh-proektov/",
      },
      {
        label: "Экспертиза процесса строительства и ремонта",
        href: "https://sudexpa.ru/expertises/ekspertiza-protcessa-stroitelstva-i-remonta/",
      },
      {
        label: "Рецензия на заключение строительной экспертизы",
        href: "https://sudexpa.ru/expertises/recenziia-na-zacliuchenie-stroitelnoi-ekspertizy/",
      },
    ],
  },
  {
    id: "land",
    tab: "Землеустроительная",
    title: "Землеустроительная экспертиза",
    href: "https://sudexpa.ru/expertises/zemleustroitelnaia-ekspertiza/",
    description:
      "Установление границ и площади участков, выявление кадастровых ошибок, определение вариантов раздела и условий сервитута.",
    items: [
      {
        label: "Экспертиза для определения вариантов раздела участка",
        href: "https://sudexpa.ru/expertises/ekspertiza-dlia-opredeleniia-variantov-razdela-uchastka/",
      },
      {
        label: "Экспертиза кадастровой ошибки",
        href: "https://sudexpa.ru/expertises/ekspertiza-kadastrovoi-oshibki/",
      },
      {
        label: "Экспертиза для определения границ участка",
        href: "https://sudexpa.ru/expertises/ekspertiza-dlia-opredeleniia-granitc-uchastka/",
      },
      {
        label: "Экспертиза для определения площади участка",
        href: "https://sudexpa.ru/expertises/ekspertiza-dlia-opredeleniia-ploshchadi-uchastka/",
      },
      {
        label: "Экспертиза для установления сервитута",
        href: "https://sudexpa.ru/expertises/ekspertiza-dlia-ustanovleniia-servituta/",
      },
      {
        label: "Экспертиза для определения необходимой площади участка для объекта недвижимости",
        href: "https://sudexpa.ru/expertises/ekspertiza-dlia-opredeleniia-neobhodimoi-ploshchadi-uchastka-dlia-obekta-nedvizhimosti/",
      },
      {
        label: "Рецензия на заключение землеустроительной экспертизы",
        href: "https://sudexpa.ru/expertises/recenziia-na-zemleustroitelnuiu-ekspertizu/",
      },
    ],
  },
];

export const FORENSIC_LABOUR_SAFETY = {
  title: "Экспертиза охраны труда и техники безопасности",
  description:
    "Исследование соответствия деятельности на опасных производственных объектах требованиям охраны труда и техники безопасности.",
};

export const FORENSIC_AUDIENCE: AudienceBlock[] = [
  {
    audience: "Для исполнителей",
    title: "Что можно указать в профиле",
    items: [
      "Образование",
      "Опыт проведения аналогичных экспертиз",
      "Дипломы, документы о дополнительном образовании и курсах",
      "Местонахождение исполнителя",
      "Место работы: экспертная организация, которая выдаст заключение, или работа как физическое лицо",
    ],
    image: "/landing/forensic-expert.svg",
    imageAlt: "Профиль исполнителя с дипломами и опытом судебных экспертиз",
  },
  {
    audience: "Для заказчиков",
    title: "Что можно указать в заявке",
    items: [
      "Наименование судебной экспертизы и материалы дела",
      "Государственный орган, куда требуется предоставить заключение",
      "Требования к исполнителю",
      "Дату, до которой ждёте отклики",
      "Где находится предмет экспертизы",
    ],
    image: "/landing/forensic-customer.svg",
    imageAlt: "Заявка на судебную экспертизу с материалами дела",
  },
];
