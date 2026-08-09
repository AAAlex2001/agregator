import type { AudienceBlock } from "../../shared/ui/AudienceSection";
import type { ServiceLandingFaqItem } from "../../shared/ui/ServiceLandingFaq";
import type { ServiceLandingBullet } from "../../shared/ui/ServiceLandingHero";
import type { ServiceLandingRole } from "../../shared/ui/ServiceRoles";

export const FORENSIC_FAQ: ServiceLandingFaqItem[] = [
  {
    id: "forensic-kto",
    question: "Может ли экспертизу проводить негосударственный эксперт?",
    answer:
      "Да. Статья 41 Федерального закона № 73-ФЗ прямо допускает производство судебной экспертизы вне государственных судебно-экспертных учреждений — лицами, обладающими специальными знаниями в области науки, техники, искусства или ремесла. На таких экспертов распространяются те же требования, что и на государственных: объективность, всесторонность и полнота исследования, а также уголовная ответственность за заведомо ложное заключение.",
  },
  {
    id: "forensic-oplata",
    question: "Кто оплачивает судебную экспертизу?",
    answer:
      "Расходы несёт сторона, заявившая ходатайство о назначении экспертизы. Если о ней ходатайствуют обе стороны, оплата вносится в равных долях; если экспертиза назначена по инициативе суда — расходы возмещаются за счёт средств федерального бюджета. Срок внесения оплаты обычно указан в определении о назначении экспертизы, и при его нарушении суд вправе отказать в удовлетворении ходатайства. По итогам дела расходы взыскиваются с проигравшей стороны.",
  },
  {
    id: "forensic-recenziya",
    question: "Что такое рецензия на заключение эксперта и когда она нужна?",
    answer:
      "Рецензия — это исследование другого специалиста, в котором оценивается научная обоснованность и методическая корректность уже данного заключения. Её готовят, когда сторона не согласна с выводами эксперта и намерена ходатайствовать о назначении повторной или дополнительной экспертизы. Чтобы рецензия имела вес, рецензент должен подтвердить свою квалификацию по тому же виду экспертизы документами об образовании и опыте.",
  },
  {
    id: "forensic-podgotovka",
    question: "Что подготовить до назначения экспертизы?",
    answer:
      "Заранее сформулируйте вопросы эксперту — от них напрямую зависят выводы и стоимость работ, и суд, как правило, принимает формулировки сторон. Соберите материалы для исследования: проектную и исполнительную документацию, договоры, акты, фотоматериалы, обеспечьте доступ к объекту. Стороны также вправе предложить суду конкретную экспертную организацию и кандидатуру эксперта — с приложением документов о его квалификации и сведений о сроках и стоимости.",
  },
];

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

export const FORENSIC_ROLES: ServiceLandingRole[] = [
  {
    id: "customer",
    role: "CUSTOMER",
    direction: "FORENSIC",
    title: "Заказчик",
    subtitle: "(организация или частное лицо)",
    description:
      "Для тех, кому нужно заключение судебного эксперта для суда или государственного органа.",
    fields: [
      "Имя, фамилия и контакты: телефон и почта",
      "В заявке: предмет и цель экспертизы, госорган и сроки",
      "Требования к эксперту: образование, опыт аналогичных экспертиз",
      "Материалы дела и ТЗ (Word, PDF, ZIP) — по желанию",
    ],
  },
  {
    id: "forensic-expert",
    role: "EXPERT",
    direction: "FORENSIC",
    title: "Судебный эксперт",
    subtitle: "(исполнитель)",
    description: "Для экспертов, готовящих заключения для судов и государственных органов.",
    fields: [
      "ФИО полностью",
      "Образование, учёная степень и дополнительное образование",
      "Опыт аналогичных экспертиз и место работы",
      "Где вы находитесь",
      "Контактный телефон и электронная почта",
    ],
  },
  {
    id: "license-holder",
    role: "LICENSE_HOLDER",
    direction: "FORENSIC",
    title: "Держатель разрешительных документов",
    subtitle: "(организация)",
    description:
      "Для экспертных организаций с разрешительными документами, от имени которых выдаются заключения.",
    fields: [
      "Полное наименование организации и ИНН",
      "Контактный телефон и электронная почта",
      "Разрешительные документы и условия их предоставления",
      "Отметка направления «Судебная экспертиза»",
    ],
  },
];
