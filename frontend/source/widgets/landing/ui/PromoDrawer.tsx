"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Button from "@/source/shared/ui/Button";
import { CheckIcon, TelegramIcon } from "@/source/shared/ui/icons";
import s from "./promo-drawer.module.scss";

export type PromoKind = "bot" | "app";

const BOT_URL = "https://t.me/resursplus_robot";

const CONTENT: Record<PromoKind, { title: string; tab: string; image: string; features: string[]; href: string | null }> = {
  bot: {
    title: "Telegram-бот Ресурс-Плюс",
    tab: "Telegram бот",
    image: "/promo/tg-bot-sq.webp",
    features: [
      "Лента заявок и отклики — не выходя из Telegram",
      "Мгновенные уведомления о новых заказах и ответах",
      "Чат с заказчиком и статусы сделок в одном месте",
    ],
    href: BOT_URL,
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
    href: null,
  },
};

type PromoDrawerState = {
  kind: PromoKind;
  open: boolean;
};

export function PromoDrawerPanel({
  kind,
  open,
  onClose,
}: {
  kind: PromoKind;
  open: boolean;
  onClose: () => void;
}) {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setPortalRoot(document.body));
    return () => window.cancelAnimationFrame(frame);
  }, []);

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

  if (!portalRoot) return null;

  const content = CONTENT[kind];

  return createPortal(
    <>
      <div className={`${s.backdrop} ${open ? s.backdropVisible : ""}`} onClick={onClose} aria-hidden />

      <aside className={`${s.drawer} ${open ? s.drawerOpen : ""}`} aria-label={content.title} aria-hidden={!open}>
        <header className={s.head}>
          <div className={s.titleRow}>
            <h2 className={s.title}>{content.title}</h2>
            {content.href ? (
              <span className={s.live}>уже работает</span>
            ) : (
              <span className={s.soon}>скоро</span>
            )}
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
            {content.href && (
              <Button
                className={s.openBot}
                href={content.href}
                target="_blank"
                rel="noopener noreferrer"
                variant="telegram"
                size="md"
                fullWidth
              >
                <span>Открыть в Telegram</span>
                <TelegramIcon />
              </Button>
            )}
          </section>
        </div>
      </aside>
    </>,
    portalRoot,
  );
}

export function PromoNavButtons({ className }: { className?: string }) {
  const [drawer, setDrawer] = useState<PromoDrawerState>({ kind: "bot", open: false });

  return (
    <>
      <button type="button" className={className} onClick={() => setDrawer({ kind: "bot", open: true })}>
        Telegram-бот
      </button>
      <button type="button" className={className} onClick={() => setDrawer({ kind: "app", open: true })}>
        Мобильное приложение
      </button>
      <PromoDrawerPanel
        kind={drawer.kind}
        open={drawer.open}
        onClose={() => setDrawer((current) => ({ ...current, open: false }))}
      />
    </>
  );
}

const PromoDrawer = () => {
  const [drawer, setDrawer] = useState<PromoDrawerState>({ kind: "bot", open: false });

  return (
    <>
      <div className={s.tabs}>
        {(Object.keys(CONTENT) as PromoKind[]).map((key) => (
          <button key={key} type="button" className={s.tab} onClick={() => setDrawer({ kind: key, open: true })}>
            {CONTENT[key].tab}
          </button>
        ))}
      </div>
      <PromoDrawerPanel
        kind={drawer.kind}
        open={drawer.open}
        onClose={() => setDrawer((current) => ({ ...current, open: false }))}
      />
    </>
  );
};

export default PromoDrawer;
