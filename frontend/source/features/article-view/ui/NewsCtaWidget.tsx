"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Button from "@/source/shared/ui/Button";
import { ChevronIcon } from "@/source/shared/ui/icons";
import { useAuthModal, type AuthPreset } from "@/source/shared/lib/auth-modal";
import { useSession } from "@/source/features/session";
import s from "./NewsCtaWidget.module.scss";

type Direction = NonNullable<AuthPreset["direction"]>;

const DIRECTIONS: { value: Direction; label: string; hint: string; image: string }[] = [
  { value: "EXPERTISE", label: "Экспертиза промбезопасности", hint: "аттестованные эксперты", image: "/services/1.webp" },
  { value: "AUDIT_SUPB", label: "Аудит СУПБ", hint: "органы инспекции и аудиторы", image: "/services/5.webp" },
  { value: "TECH_DIAG", label: "Техдиагностирование и НК", hint: "лаборатории и дефектоскописты", image: "/services/8.webp" },
  { value: "DESIGN", label: "Проектирование", hint: "специалисты НОПРИЗ", image: "/services/2.webp" },
  { value: "SURVEY", label: "Инженерные изыскания", hint: "геологи, геодезисты, экологи", image: "/services/3.webp" },
  { value: "ECOLOGY", label: "Экологическое сопровождение", hint: "инженеры-экологи", image: "/services/6.webp" },
  { value: "RESEARCH", label: "НИР и лаборатории", hint: "кандидаты и доктора наук", image: "/services/7.webp" },
  { value: "CADASTRAL", label: "Кадастровые работы", hint: "инженеры из СРО", image: "/services/9.webp" },
  { value: "FORENSIC", label: "Судебная экспертиза", hint: "судебные эксперты", image: "/services/10.webp" },
];

export function NewsCtaWidget() {
  const { user, role } = useSession();
  const { openAuth } = useAuthModal();
  const [direction, setDirection] = useState(DIRECTIONS[0]);
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [isOpen]);

  if (user) {
    const isCustomer = role === "CUSTOMER";
    return (
      <aside className={s.outer}>
        <div className={s.single}>
          <h2 className={s.title}>
            {isCustomer ? "Нужен исполнитель под задачу?" : "Новые заказы уже на площадке"}
          </h2>
          <p className={s.text}>
            {isCustomer
              ? "Разместите заявку бесплатно — исполнители откликнутся с ценой и сроками."
              : "Откликайтесь на заказы по вашим направлениям и работайте с заказчиками напрямую."}
          </p>
        </div>
        <Button
          href={isCustomer ? "/customer/orders" : "/orders"}
          variant="primary"
          size="md"
          fullWidth
          showArrow
          className={s.cta}
        >
          {isCustomer ? "Разместить заказ" : "Смотреть заказы"}
        </Button>
      </aside>
    );
  }

  return (
    <aside className={s.outer}>
      <div className={s.fields}>
        <div className={s.field} ref={pickerRef}>
          <div className={s.fieldHead}>
            <span className={s.fieldLabel}>Ваша задача</span>
            <span className={s.fieldRule} aria-hidden="true" />
          </div>
          <button
            type="button"
            className={s.picker}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
          >
            <Image src={direction.image} alt="" width={40} height={40} className={s.pickerIcon} />
            <span className={s.pickerLabel}>
              <span className={s.pickerTop}>{direction.label}</span>
              <span className={s.pickerBottom}>{direction.hint}</span>
            </span>
            <ChevronIcon className={isOpen ? `${s.chevron} ${s.chevronOpen}` : s.chevron} color="currentColor" />
          </button>
          {isOpen && (
            <ul className={s.menu} role="listbox" aria-label="Направление работ">
              {DIRECTIONS.map((item) => (
                <li key={item.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={item.value === direction.value}
                    className={item.value === direction.value ? `${s.option} ${s.optionActive}` : s.option}
                    onClick={() => {
                      setDirection(item);
                      setIsOpen(false);
                    }}
                  >
                    <Image src={item.image} alt="" width={32} height={32} className={s.optionIcon} />
                    <span className={s.optionLabel}>
                      <span className={s.pickerTop}>{item.label}</span>
                      <span className={s.pickerBottom}>{item.hint}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={s.swap} aria-hidden="true">
          <svg width="22" height="14" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.35 0.65a0.5 0.5 0 0 1 0.71 0l3.18 3.18a0.5 0.5 0 0 1 0 0.71l-3.18 3.18a0.5 0.5 0 0 1-0.71-0.71L17.19 4.18H1a0.5 0.5 0 0 1 0-1h16.19l-2.84-2.83a0.5 0.5 0 0 1 0-0.7z" fill="currentColor" transform="translate(3 3)" />
          </svg>
        </div>

        <div className={s.field}>
          <div className={s.fieldHead}>
            <span className={s.fieldLabel}>Получаете</span>
            <span className={s.fieldRule} aria-hidden="true" />
          </div>
          <p className={s.resultTitle}>Отклики исполнителей</p>
          <ul className={s.resultPerks}>
            <li>с ценой и сроками</li>
            <li>напрямую, без посредников</li>
            <li>размещение заявки бесплатно</li>
          </ul>
        </div>
      </div>

      <Button
        variant="primary"
        size="md"
        fullWidth
        showArrow
        className={s.cta}
        onClick={() => openAuth("register", { role: "CUSTOMER", direction: direction.value })}
      >
        Найти исполнителя
      </Button>

      <p className={s.fine}>
        Нажимая кнопку, вы перейдёте к короткой регистрации заказчика — и сразу к созданию заказа.
      </p>
      <button
        type="button"
        className={s.expertLink}
        onClick={() => openAuth("register", { role: "EXPERT", direction: direction.value })}
      >
        Я исполнитель — хочу получать заказы
      </button>
    </aside>
  );
}
