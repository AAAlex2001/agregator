"use client";

import { useState } from "react";
import Button from "@/source/shared/ui/Button";
import { Select } from "@/source/shared/ui/Select";
import { useAuthModal, type AuthPreset } from "@/source/shared/lib/auth-modal";
import { useSession } from "@/source/features/session";
import s from "./NewsCtaWidget.module.scss";

type Direction = NonNullable<AuthPreset["direction"]>;
type Role = AuthPreset["role"];

interface DirectionItem {
  value: Direction;
  label: string;
  hint: string;
  image: string;
  href: string;
  forCustomer: string;
  forExpert: string;
}

const DIRECTIONS: DirectionItem[] = [
  {
    value: "EXPERTISE",
    label: "Экспертиза промбезопасности",
    hint: "аттестованные эксперты",
    image: "/services/1.webp",
    href: "/ekspertiza-promyshlennoy-bezopasnosti",
    forCustomer:
      "Аттестованные эксперты проведут ЭПБ технических устройств, зданий и документации с внесением заключения в реестр Ростехнадзора.",
    forExpert:
      "Заказы на ЭПБ со всей России: технические устройства, здания и сооружения, документация ОПО. Работайте с владельцами объектов напрямую.",
  },
  {
    value: "AUDIT_SUPB",
    label: "Аудит СУПБ",
    hint: "органы инспекции и аудиторы",
    image: "/services/5.webp",
    href: "/audit-supb",
    forCustomer:
      "Независимые аудиторы проверят систему управления промышленной безопасностью, помогут снизить категорию риска и подготовиться к проверкам.",
    forExpert:
      "Заявки на аудит СУПБ от эксплуатирующих организаций — от ОПО I класса до добровольных проверок. Прямые договоры, без посредников.",
  },
  {
    value: "TECH_DIAG",
    label: "Техдиагностирование и НК",
    hint: "лаборатории и дефектоскописты",
    image: "/services/8.webp",
    href: "/tehnicheskoe-diagnostirovanie",
    forCustomer:
      "Аттестованные лаборатории неразрушающего контроля и дефектоскописты выполнят диагностирование и освидетельствование вашего оборудования.",
    forExpert:
      "Заказы на техническое диагностирование и НК для лабораторий и дефектоскопистов: сосуды, трубопроводы, ГПМ, резервуары.",
  },
  {
    value: "DESIGN",
    label: "Проектирование",
    hint: "специалисты НОПРИЗ",
    image: "/services/2.webp",
    href: "/proektirovanie",
    forCustomer:
      "Проектировщики из НРС НОПРИЗ — от ГИП до BIM-специалистов — выполнят проект и сопроводят его до положительного заключения экспертизы.",
    forExpert:
      "Проектные заказы промышленных и гражданских объектов. Укажите специальности в профиле — заказчики найдут вас на карте специалистов.",
  },
  {
    value: "SURVEY",
    label: "Инженерные изыскания",
    hint: "геологи, геодезисты, экологи",
    image: "/services/3.webp",
    href: "/inzhenernye-izyskaniya",
    forCustomer:
      "Геологи, геодезисты, гидрометеорологи, геофизики и археологи выполнят изыскания для вашего проекта — в комплексе или по отдельным видам.",
    forExpert:
      "ТЗ на инженерные изыскания: полевые и камеральные работы по всем видам — от ИГИ до археологии. Откликайтесь бесплатно.",
  },
  {
    value: "ECOLOGY",
    label: "Экологическое сопровождение",
    hint: "инженеры-экологи",
    image: "/services/6.webp",
    href: "/ekologiya",
    forCustomer:
      "Инженеры-экологи подготовят КЭР, ПНООЛР, проекты НДВ и СЗЗ, отчётность — документы оформляются на бланках вашей организации.",
    forExpert:
      "Заявки на экологическую документацию от предприятий: от паспортов отходов до комплексных экологических разрешений.",
  },
  {
    value: "RESEARCH",
    label: "НИР и лаборатории",
    hint: "кандидаты и доктора наук",
    image: "/services/7.webp",
    href: "/nir",
    forCustomer:
      "Кандидаты и доктора наук выполнят исследования под вашу задачу, а лаборатории — испытания материалов, металла и грунтов.",
    forExpert:
      "Темы НИР и лабораторные исследования от промышленных предприятий — по вашей отрасли науки и профилю лаборатории.",
  },
  {
    value: "CADASTRAL",
    label: "Кадастровые работы",
    hint: "инженеры из СРО",
    image: "/services/9.webp",
    href: "/kadastrovye-raboty",
    forCustomer:
      "Кадастровые инженеры из СРО выполнят межевание, технические планы, акты обследования и постановку на учёт в ЕГРН.",
    forExpert:
      "Заказы на кадастровые работы: межевание, техпланы, охранные зоны — от частных участков до промышленных площадок.",
  },
  {
    value: "FORENSIC",
    label: "Судебная экспертиза",
    hint: "судебные эксперты",
    image: "/services/10.webp",
    href: "/sudebnaya-ekspertiza",
    forCustomer:
      "Судебные эксперты с профильным образованием подготовят заключение для суда, досудебное исследование или рецензию на экспертизу.",
    forExpert:
      "Определения судов и досудебные исследования по вашей специализации: строительные, инженерно-технические, землеустроительные.",
  },
];

const HOLDER_EXCLUDED: Direction[] = ["ECOLOGY"];

const ROLE_TABS: { role: Role; label: string }[] = [
  { role: "CUSTOMER", label: "Я заказчик" },
  { role: "EXPERT", label: "Я исполнитель" },
  { role: "LICENSE_HOLDER", label: "Я держатель разрешительных документов" },
];

const ROLE_CONTENT: Record<Role, { title: string; button: string; fine: string }> = {
  CUSTOMER: {
    title: "Найдите исполнителя за один день",
    button: "Найти исполнителя",
    fine: "Размещение заявки бесплатно — отклики с ценой и сроками, напрямую и без посредников.",
  },
  EXPERT: {
    title: "Получайте заказы по вашему профилю",
    button: "Найти заказы",
    fine: "Регистрация и отклики бесплатны — работайте с заказчиками без комиссии.",
  },
  LICENSE_HOLDER: {
    title: "Монетизируйте разрешительные документы",
    button: "Стать держателем",
    fine: "Условия предоставления документов задаёте вы: процент от заказа, фиксированная сумма или договорная цена.",
  },
};

function roleText(role: Role, direction: DirectionItem): string {
  if (role === "CUSTOMER") return direction.forCustomer;
  if (role === "EXPERT") return direction.forExpert;
  return `Лицензия или членство СРО вашей организации может приносить доход: исполнители направления «${direction.label}» используют ваши разрешительные документы и платят за это по согласованным условиям.`;
}

export function NewsCtaWidget() {
  const { user } = useSession();
  const { openAuth } = useAuthModal();
  const [role, setRole] = useState<Role>("CUSTOMER");
  const [direction, setDirection] = useState(DIRECTIONS[0]);

  const options =
    role === "LICENSE_HOLDER"
      ? DIRECTIONS.filter((item) => !HOLDER_EXCLUDED.includes(item.value))
      : DIRECTIONS;
  const content = ROLE_CONTENT[role];

  if (user) return null;

  const selectRole = (next: Role) => {
    setRole(next);
    if (next === "LICENSE_HOLDER" && HOLDER_EXCLUDED.includes(direction.value)) {
      setDirection(DIRECTIONS[0]);
    }
  };

  return (
    <aside className={s.outer}>
      <div className={s.tabs} role="tablist" aria-label="Ваша роль">
        {ROLE_TABS.map((tab) => (
          <button
            key={tab.role}
            type="button"
            role="tab"
            aria-selected={role === tab.role}
            className={role === tab.role ? `${s.tab} ${s.tabActive}` : s.tab}
            onClick={() => selectRole(tab.role)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={s.panel}>
        <div className={s.left}>
          <h2 className={s.fieldLabel}>Направление работ</h2>
          <Select
            variant="pill"
            ariaLabel="Направление работ"
            options={options.map((item) => ({
              value: item.value,
              label: item.label,
              hint: item.hint,
              image: item.image,
            }))}
            value={direction.value}
            onChange={(value) =>
              setDirection(DIRECTIONS.find((item) => item.value === value) ?? DIRECTIONS[0])
            }
          />
          <Button href={direction.href} variant="outline" size="md" fullWidth className={s.cta}>
            Чем занимается направление
          </Button>
        </div>

        <div className={s.right}>
          <h2 className={s.roleTitle}>{content.title}</h2>
          <p className={s.roleText}>{roleText(role, direction)}</p>
          <Button
            variant="primary"
            size="md"
            fullWidth
            showArrow
            className={s.cta}
            onClick={() => openAuth("register", { role, direction: direction.value })}
          >
            {content.button}
          </Button>
        </div>
      </div>
      <p className={s.fine}>{content.fine}</p>
    </aside>
  );
}
