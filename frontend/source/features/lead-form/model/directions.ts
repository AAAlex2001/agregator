export interface LeadDirection {
  value: string;
  label: string;
  hint: string;
  href: string;
  image: string;
  video: string;
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
    label: "Экспертиза промбезопасности",
    hint: "аттестованные эксперты",
    href: "/ekspertiza-promyshlennoy-bezopasnosti",
    image: "/services/1.webp",
    video: "/landing/expertise/hero.mp4",
    bg: "linear-gradient(135deg, #e7eefb 0%, #b7c9ec 100%)",
    ink: "#14263c",
    muted: "#47608c",
    objectPlaceholder: "Например: сосуд под давлением, кран, здание цеха",
    taskPlaceholder: "Что нужно: тип оборудования, год выпуска, есть ли паспорт, сроки",
  },
  {
    value: "AUDIT_SUPB",
    label: "Аудит СУПБ",
    hint: "органы инспекции и аудиторы",
    href: "/audit-supb",
    image: "/services/5.webp",
    video: "/landing/audit/hero.mp4",
    bg: "linear-gradient(135deg, #eef1f4 0%, #c2ccd6 100%)",
    ink: "#222d36",
    muted: "#52626f",
    objectPlaceholder: "Например: ОПО I класса, химическое производство",
    taskPlaceholder: "Класс опасности объектов, есть ли положение о СУПБ, к какому сроку нужен отчёт",
  },
  {
    value: "TECH_DIAG",
    label: "Техдиагностирование и НК",
    hint: "лаборатории и дефектоскописты",
    href: "/tehnicheskoe-diagnostirovanie",
    image: "/services/8.webp",
    video: "/landing/tech-diag/hero.mp4",
    bg: "linear-gradient(135deg, #f5f1fb 0%, #d9c9f0 100%)",
    ink: "#2b1e42",
    muted: "#6b5a8a",
    objectPlaceholder: "Например: резервуар РВС-2000, трубопровод, мостовой кран",
    taskPlaceholder: "Какое оборудование, какие методы контроля нужны, объём работ",
  },
  {
    value: "DESIGN",
    label: "Проектирование объектов",
    hint: "специалисты НОПРИЗ",
    href: "/proektirovanie",
    image: "/services/2.webp",
    video: "/landing/design/hero.mp4",
    bg: "linear-gradient(135deg, #fceae4 0%, #eeab8d 100%)",
    ink: "#3f2212",
    muted: "#7d4f33",
    objectPlaceholder: "Например: цех, склад, котельная, линейный объект",
    taskPlaceholder: "Стадия проекта, разделы ПД, есть ли изыскания и задание на проектирование",
  },
  {
    value: "SURVEY",
    label: "Инженерные изыскания",
    hint: "геологи, геодезисты, экологи",
    href: "/inzhenernye-izyskaniya",
    image: "/services/3.webp",
    video: "/landing/survey/hero.mp4",
    bg: "linear-gradient(135deg, #e9f6fb 0%, #a5d8ee 100%)",
    ink: "#103648",
    muted: "#35687e",
    objectPlaceholder: "Например: участок под строительство, трасса, площадка",
    taskPlaceholder: "Виды изысканий (ИГИ, ИГДИ, ИЭИ…), площадь участка, сроки",
  },
  {
    value: "ECOLOGY",
    label: "Экологическое сопровождение",
    hint: "инженеры-экологи",
    href: "/ekologiya",
    image: "/services/6.webp",
    video: "/landing/ekologiya/hero.mp4",
    bg: "linear-gradient(135deg, #f2fbe8 0%, #cdeaa8 100%)",
    ink: "#2c3d0f",
    muted: "#5a7333",
    objectPlaceholder: "Например: производственная площадка, объект НВОС",
    taskPlaceholder: "Какие документы нужны: КЭР, ПНООЛР, НДВ, ПЭК, отчётность",
  },
  {
    value: "RESEARCH",
    label: "НИР и лаборатории",
    hint: "кандидаты и доктора наук",
    href: "/nir",
    image: "/services/7.webp",
    video: "/landing/nir/hero.mp4",
    bg: "linear-gradient(135deg, #fff9ee 0%, #ffe7bf 100%)",
    ink: "#2c2113",
    muted: "#6f5c3c",
    objectPlaceholder: "Например: образцы металла, грунты, технология производства",
    taskPlaceholder: "Тема исследования или перечень испытаний, требуемые методики",
  },
  {
    value: "CADASTRAL",
    label: "Кадастровые работы",
    hint: "инженеры из СРО",
    href: "/kadastrovye-raboty",
    image: "/services/9.webp",
    video: "/landing/kadastr/hero.mp4",
    bg: "linear-gradient(135deg, #f7f0e8 0%, #dcc3a4 100%)",
    ink: "#3a2c18",
    muted: "#75603f",
    objectPlaceholder: "Например: земельный участок, здание, сооружение",
    taskPlaceholder: "Что нужно: межевание, технический план, акт обследования, кадастровый номер",
  },
  {
    value: "FORENSIC",
    label: "Судебная экспертиза",
    hint: "судебные эксперты",
    href: "/sudebnaya-ekspertiza",
    image: "/services/10.webp",
    video: "/landing/forensic/hero.mp4",
    bg: "linear-gradient(135deg, #fbecf3 0%, #eebbd6 100%)",
    ink: "#4a1f36",
    muted: "#8a4a6b",
    objectPlaceholder: "Например: объект спора — здание, оборудование, участок",
    taskPlaceholder: "Вид экспертизы, стадия дела, вопросы эксперту, суд и сроки",
  },
];
