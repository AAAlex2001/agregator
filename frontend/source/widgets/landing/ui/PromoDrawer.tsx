"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CheckIcon, PromoAppIcon, PromoBotIcon } from "@/source/shared/ui/icons";
import s from "./promo-drawer.module.scss";

const SECTIONS = [
  {
    key: "bot",
    title: "Telegram-бот Ресурс-Плюс",
    image: "/promo/tg-bot-sq.webp",
    features: [
      "Лента заявок и отклики — не выходя из Telegram",
      "Мгновенные уведомления о новых заказах и ответах",
      "Чат с заказчиком и статусы сделок в одном месте",
    ],
  },
  {
    key: "app",
    title: "Мобильное приложение",
    image: "/promo/app-sq.webp",
    features: [
      "Все сделки и документы всегда под рукой",
      "Push-уведомления о каждом движении по заказу",
      "Полный кабинет эксперта и заказчика в кармане",
    ],
  },
] as const;

const PromoDrawer = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button type="button" className={s.tab} onClick={() => setOpen(true)}>
        Скоро: бот и приложение
      </button>

      <div className={`${s.backdrop} ${open ? s.backdropVisible : ""}`} onClick={() => setOpen(false)} aria-hidden />

      <aside className={`${s.drawer} ${open ? s.drawerOpen : ""}`} aria-label="Скоро на Ресурс-Плюс" aria-hidden={!open}>
        <header className={s.head}>
          <div>
            <h2 className={s.title}>Скоро на Ресурс-Плюс</h2>
            <p className={s.subtitle}>Telegram-бот и мобильное приложение</p>
          </div>
          <button type="button" className={s.close} onClick={() => setOpen(false)} aria-label="Закрыть">
            ×
          </button>
        </header>

        <div className={s.body}>
          {SECTIONS.map((section) => (
            <section key={section.key} className={s.card}>
              <Image className={s.img} src={section.image} alt="" width={800} height={800} />
              <div className={s.cardHead}>
                <span className={`${s.dot} ${s[section.key]}`}>
                  {section.key === "bot" ? <PromoBotIcon width={18} height={18} /> : <PromoAppIcon width={18} height={18} />}
                </span>
                <h3 className={s.cardTitle}>{section.title}</h3>
                <span className={s.soon}>скоро</span>
              </div>
              <ul className={s.features}>
                {section.features.map((feature) => (
                  <li key={feature}>
                    <CheckIcon className={s.check} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </aside>
    </>
  );
};

export default PromoDrawer;
