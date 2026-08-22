"use client";

import { useState } from "react";
import Button from "@/source/shared/ui/Button";
import { useAuthModal, type AuthPreset } from "@/source/shared/lib/auth-modal";
import { useSession } from "@/source/features/session";
import s from "./NewsCtaWidget.module.scss";

type Direction = NonNullable<AuthPreset["direction"]>;

const DIRECTIONS: { value: Direction; label: string }[] = [
  { value: "EXPERTISE", label: "Экспертиза промышленной безопасности" },
  { value: "AUDIT_SUPB", label: "Аудит СУПБ" },
  { value: "TECH_DIAG", label: "Техническое освидетельствование и диагностирование" },
  { value: "DESIGN", label: "Проектирование" },
  { value: "SURVEY", label: "Инженерные изыскания" },
  { value: "ECOLOGY", label: "Экологическое сопровождение" },
  { value: "RESEARCH", label: "Научно-исследовательские работы" },
  { value: "LABORATORY", label: "Лабораторные исследования" },
  { value: "CADASTRAL", label: "Кадастровые работы" },
  { value: "FORENSIC", label: "Судебная экспертиза" },
];

export function NewsCtaWidget() {
  const { user, role } = useSession();
  const { openAuth } = useAuthModal();
  const [direction, setDirection] = useState<Direction>("EXPERTISE");

  if (user) {
    const isCustomer = role === "CUSTOMER";
    return (
      <aside className={s.panel}>
        <div className={s.card}>
          <h2 className={s.title}>
            {isCustomer ? "Нужен исполнитель под задачу?" : "Новые заказы уже на площадке"}
          </h2>
          <p className={s.text}>
            {isCustomer
              ? "Разместите заявку бесплатно — исполнители откликнутся с ценой и сроками."
              : "Откликайтесь на заказы по вашим направлениям и работайте с заказчиками напрямую."}
          </p>
          <Button
            href={isCustomer ? "/customer/orders" : "/orders"}
            variant="primary"
            size="md"
            fullWidth
            showArrow
          >
            {isCustomer ? "Разместить заказ" : "Смотреть заказы"}
          </Button>
        </div>
      </aside>
    );
  }

  return (
    <aside className={s.panel}>
      <div className={s.card}>
        <h2 className={s.title}>Подберите исполнителя под вашу задачу</h2>
        <p className={s.text}>
          Эксперты, лаборатории и проектные организации откликнутся на заявку с ценой и сроками —
          напрямую, без посредников.
        </p>
        <label className={s.selectLabel}>
          Направление работ
          <select
            className={s.select}
            value={direction}
            onChange={(event) => setDirection(event.target.value as Direction)}
          >
            {DIRECTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <Button
          variant="primary"
          size="md"
          fullWidth
          showArrow
          onClick={() => openAuth("register", { role: "CUSTOMER", direction })}
        >
          Найти исполнителя
        </Button>
        <p className={s.fine}>
          Размещение заявки бесплатно — после короткой регистрации сразу попадёте к созданию заказа.
        </p>
        <button
          type="button"
          className={s.expertLink}
          onClick={() => openAuth("register", { role: "EXPERT", direction })}
        >
          Я исполнитель — хочу получать заказы
        </button>
      </div>
    </aside>
  );
}
