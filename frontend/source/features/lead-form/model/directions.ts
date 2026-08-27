export interface LeadDirection {
  value: string;
  label: string;
  short: string;
  href: string;
  /** Палитра берётся с лендинга направления — виджет перекрашивается вместе с выбором. */
  bg: string;
  ink: string;
  muted: string;
  taskPlaceholder: string;
  objectPlaceholder: string;
}

export const LEAD_DIRECTIONS: LeadDirection[] = [
  {
    value: "EXPERTISE",
    label: "Экспертиза промышленной безопасности",
    short: "ЭПБ",
    href: "/ekspertiza-promyshlennoy-bezopasnosti",
    bg: "linear-gradient(135deg, #e7eefb 0%, #b7c9ec 100%)",
    ink: "#14263c",
    muted: "#47608c",
    objectPlaceholder: "Например: сосуд под давлением, кран, здание цеха",
    taskPlaceholder: "Что нужно: тип оборудования, год выпуска, есть ли паспорт, сроки",
  },
  {
    value: "AUDIT_SUPB",
    label: "Аудит СУПБ",
    short: "Аудит СУПБ",
    href: "/audit-supb",
    bg: "linear-gradient(135deg, #eef1f4 0%, #c2ccd6 100%)",
    ink: "#222d36",
    muted: "#52626f",
    objectPlaceholder: "Например: ОПО I класса, химическое производство",
    taskPlaceholder: "Класс опасности объектов, есть ли положение о СУПБ, к какому сроку нужен отчёт",
  },
  {
    value: "TECH_DIAG",
    label: "Техническое диагностирование и НК",
    short: "Техдиагностирование",
    href: "/tehnicheskoe-diagnostirovanie",
    bg: "linear-gradient(135deg, #f5f1fb 0%, #d9c9f0 100%)",
    ink: "#2b1e42",
    muted: "#6b5a8a",
    objectPlaceholder: "Например: резервуар РВС-2000, трубопровод, мостовой кран",
    taskPlaceholder: "Какое оборудование, какие методы контроля нужны, объём работ",
  },
  {
    value: "DESIGN",
    label: "Проектирование объектов",
    short: "Проектирование",
    href: "/proektirovanie",
    bg: "linear-gradient(135deg, #fceae4 0%, #eeab8d 100%)",
    ink: "#3f2212",
    muted: "#7d4f33",
    objectPlaceholder: "Например: цех, склад, котельная, линейный объект",
    taskPlaceholder: "Стадия проекта, разделы ПД, есть ли изыскания и задание на проектирование",
  },
  {
    value: "SURVEY",
    label: "Инженерные изыскания",
    short: "Изыскания",
    href: "/inzhenernye-izyskaniya",
    bg: "linear-gradient(135deg, #e9f6fb 0%, #a5d8ee 100%)",
    ink: "#103648",
    muted: "#35687e",
    objectPlaceholder: "Например: участок под строительство, трасса, площадка",
    taskPlaceholder: "Виды изысканий (ИГИ, ИГДИ, ИЭИ…), площадь участка, сроки",
  },
  {
    value: "ECOLOGY",
    label: "Экологическое сопровождение",
    short: "Экология",
    href: "/ekologiya",
    bg: "linear-gradient(135deg, #f2fbe8 0%, #cdeaa8 100%)",
    ink: "#2c3d0f",
    muted: "#5a7333",
    objectPlaceholder: "Например: производственная площадка, объект НВОС",
    taskPlaceholder: "Какие документы нужны: КЭР, ПНООЛР, НДВ, ПЭК, отчётность",
  },
  {
    value: "RESEARCH",
    label: "НИР и лабораторные исследования",
    short: "НИР",
    href: "/nir",
    bg: "linear-gradient(135deg, #fff9ee 0%, #ffe7bf 100%)",
    ink: "#2c2113",
    muted: "#6f5c3c",
    objectPlaceholder: "Например: образцы металла, грунты, технология производства",
    taskPlaceholder: "Тема исследования или перечень испытаний, требуемые методики",
  },
  {
    value: "CADASTRAL",
    label: "Кадастровые работы",
    short: "Кадастр",
    href: "/kadastrovye-raboty",
    bg: "linear-gradient(135deg, #f7f0e8 0%, #dcc3a4 100%)",
    ink: "#3a2c18",
    muted: "#75603f",
    objectPlaceholder: "Например: земельный участок, здание, сооружение",
    taskPlaceholder: "Что нужно: межевание, технический план, акт обследования, кадастровый номер",
  },
  {
    value: "FORENSIC",
    label: "Судебная экспертиза",
    short: "Судэкспертиза",
    href: "/sudebnaya-ekspertiza",
    bg: "linear-gradient(135deg, #fbecf3 0%, #eebbd6 100%)",
    ink: "#4a1f36",
    muted: "#8a4a6b",
    objectPlaceholder: "Например: объект спора — здание, оборудование, участок",
    taskPlaceholder: "Вид экспертизы, стадия дела, вопросы эксперту, суд и сроки",
  },
];
