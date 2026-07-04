"use client";

import { useEffect } from "react";
import Image from "next/image";
import { CheckIcon } from "@/source/shared/ui/icons";
import s from "./promo-modal.module.scss";

export type PromoKind = "bot" | "app";

const CONTENT: Record<PromoKind, { title: string; image: string; features: string[] }> = {
  bot: {
    title: "Telegram-бот Ресурс-Плюс",
    image: "/promo/tg-bot.webp",
    features: [
      "Лента заявок и отклики — не выходя из Telegram",
      "Мгновенные уведомления о новых заказах и ответах",
      "Чат с заказчиком и статусы сделок в одном месте",
    ],
  },
  app: {
    title: "Мобильное приложение",
    image: "/promo/app.webp",
    features: [
      "Все сделки и документы всегда под рукой",
      "Push-уведомления о каждом движении по заказу",
      "Полный кабинет эксперта и заказчика в кармане",
    ],
  },
};

interface Props {
  kind: PromoKind | null;
  onClose: () => void;
}

const PromoModal = ({ kind, onClose }: Props) => {
  useEffect(() => {
    if (!kind) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [kind, onClose]);

  if (!kind) return null;
  const content = CONTENT[kind];

  return (
    <div
      className={s.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={s.modal} role="dialog" aria-modal="true" aria-label={content.title}>
        <div className={`${s.art} ${s[kind]}`}>
          <Image className={s.img} src={content.image} alt="" fill sizes="(max-width: 640px) 100vw, 340px" />
        </div>
        <div className={s.body}>
          <span className={s.tag}>Скоро</span>
          <h2 className={s.title}>{content.title}</h2>
          <ul className={s.features}>
            {content.features.map((feature) => (
              <li key={feature}>
                <CheckIcon className={s.check} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <div className={s.actions}>
            <button type="button" className={s.primary} onClick={onClose}>
              Круто, жду!
            </button>
            <button type="button" className={s.ghost} onClick={onClose}>
              Позже
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoModal;
