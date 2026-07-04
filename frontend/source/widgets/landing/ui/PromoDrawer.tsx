"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { CheckIcon } from "@/source/shared/ui/icons";
import s from "./promo-drawer.module.scss";

export type PromoKind = "bot" | "app";

const CONTENT: Record<PromoKind, { title: string; tab: string; image: string; features: string[] }> = {
  bot: {
    title: "Telegram-бот Ресурс-Плюс",
    tab: "Telegram бот",
    image: "/promo/tg-bot-sq.webp",
    features: [
      "Лента заявок и отклики — не выходя из Telegram",
      "Мгновенные уведомления о новых заказах и ответах",
      "Чат с заказчиком и статусы сделок в одном месте",
    ],
  },
  app: {
    title: "Мобильное приложение",
    tab: "Мобильное приложение",
    image: "/promo/app-sq.webp",
    features: [
      "Все сделки и документы всегда под рукой",
      "Push-уведомления о каждом движении по заказу",
      "Полный кабинет эксперта и заказчика в кармане",
    ],
  },
};

export function PromoDrawerPanel({ kind, onClose }: { kind: PromoKind | null; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<PromoKind>("bot");
  const open = kind !== null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (kind) setView(kind);
  }, [kind]);

  useEffect(() => {
    if (!open) return;
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
  }, [open, onClose]);

  if (!mounted) return null;

  const content = CONTENT[kind ?? view];

  return createPortal(
    <>
      <div className={`${s.backdrop} ${open ? s.backdropVisible : ""}`} onClick={onClose} aria-hidden />

      <aside className={`${s.drawer} ${open ? s.drawerOpen : ""}`} aria-label={content.title} aria-hidden={!open}>
        <header className={s.head}>
          <div className={s.titleRow}>
            <h2 className={s.title}>{content.title}</h2>
            <span className={s.soon}>скоро</span>
          </div>
          <button type="button" className={s.close} onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </header>

        <div className={s.body}>
          <section className={s.card}>
            <Image className={s.img} src={content.image} alt="" width={800} height={800} />
            <ul className={s.features}>
              {content.features.map((feature) => (
                <li key={feature}>
                  <CheckIcon className={s.check} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </aside>
    </>,
    document.body,
  );
}

export function PromoNavButtons({ className }: { className?: string }) {
  const [kind, setKind] = useState<PromoKind | null>(null);

  return (
    <>
      <button type="button" className={className} onClick={() => setKind("bot")}>
        Telegram-бот
      </button>
      <button type="button" className={className} onClick={() => setKind("app")}>
        Мобильное приложение
      </button>
      <PromoDrawerPanel kind={kind} onClose={() => setKind(null)} />
    </>
  );
}

const PromoDrawer = () => {
  const [kind, setKind] = useState<PromoKind | null>(null);

  return (
    <>
      <div className={s.tabs}>
        {(Object.keys(CONTENT) as PromoKind[]).map((key) => (
          <button key={key} type="button" className={s.tab} onClick={() => setKind(key)}>
            {CONTENT[key].tab}
          </button>
        ))}
      </div>
      <PromoDrawerPanel kind={kind} onClose={() => setKind(null)} />
    </>
  );
};

export default PromoDrawer;
