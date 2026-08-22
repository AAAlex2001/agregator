"use client";

import { useState } from "react";
import Button from "@/source/shared/ui/Button";
import { useAuthModal, type AuthPreset } from "@/source/shared/lib/auth-modal";
import { useSession } from "@/source/features/session";
import s from "./NewsCtaWidget.module.scss";

type Direction = NonNullable<AuthPreset["direction"]>;

const DIRECTIONS: { value: Direction; label: string }[] = [
  { value: "EXPERTISE", label: "ЭПБ" },
  { value: "AUDIT_SUPB", label: "Аудит СУПБ" },
  { value: "TECH_DIAG", label: "Техдиагностирование" },
  { value: "DESIGN", label: "Проектирование" },
  { value: "SURVEY", label: "Изыскания" },
  { value: "ECOLOGY", label: "Экология" },
  { value: "RESEARCH", label: "НИР" },
  { value: "LABORATORY", label: "Лаборатория" },
  { value: "CADASTRAL", label: "Кадастр" },
  { value: "FORENSIC", label: "Судебная экспертиза" },
];

const PERKS = ["Размещение бесплатно", "Отклики с ценой и сроками", "Напрямую, без посредников"];

export function NewsCtaWidget() {
  const { user, role } = useSession();
  const { openAuth } = useAuthModal();
  const [direction, setDirection] = useState<Direction>("EXPERTISE");

  if (user) {
    const isCustomer = role === "CUSTOMER";
    return (
      <aside className={s.panel}>
        <p className={s.eyebrow}>Ресурс-Плюс</p>
        <h2 className={s.title}>
          {isCustomer ? "Нужен исполнитель под задачу?" : "Новые заказы уже на площадке"}
        </h2>
        <p className={s.text}>
          {isCustomer
            ? "Разместите заявку бесплатно — исполнители откликнутся с ценой и сроками."
            : "Откликайтесь на заказы по вашим направлениям и работайте с заказчиками напрямую."}
        </p>
        <div className={s.actionRow}>
          <Button
            href={isCustomer ? "/customer/orders" : "/orders"}
            variant="primary"
            size="md"
            showArrow
            className={s.cta}
          >
            {isCustomer ? "Разместить заказ" : "Смотреть заказы"}
          </Button>
        </div>
      </aside>
    );
  }

  return (
    <aside className={s.panel}>
      <p className={s.eyebrow}>Ресурс-Плюс</p>
      <h2 className={s.title}>Подберите исполнителя под вашу задачу</h2>
      <p className={s.text}>
        Эксперты, лаборатории и проектные организации откликнутся на заявку с ценой и сроками.
        Выберите направление работ:
      </p>

      <div className={s.pills} role="radiogroup" aria-label="Направление работ">
        {DIRECTIONS.map((item) => (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={direction === item.value}
            className={direction === item.value ? `${s.pill} ${s.pillActive}` : s.pill}
            onClick={() => setDirection(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className={s.actionRow}>
        <Button
          variant="primary"
          size="md"
          showArrow
          className={s.cta}
          onClick={() => openAuth("register", { role: "CUSTOMER", direction })}
        >
          Найти исполнителя
        </Button>
        <button
          type="button"
          className={s.expertLink}
          onClick={() => openAuth("register", { role: "EXPERT", direction })}
        >
          Я исполнитель — хочу получать заказы
        </button>
      </div>

      <ul className={s.perks}>
        {PERKS.map((perk) => (
          <li key={perk}>{perk}</li>
        ))}
      </ul>
    </aside>
  );
}
