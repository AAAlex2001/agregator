"use client";

import { useState } from "react";
import { PromoAppIcon, PromoBotIcon } from "@/source/shared/ui/icons";
import PromoModal, { type PromoKind } from "./PromoModal";
import s from "./promo-banner.module.scss";

const PromoBanner = () => {
  const [open, setOpen] = useState<PromoKind | null>(null);

  return (
    <>
      <div className={s.bar}>
        <button type="button" className={`${s.plate} ${s.bot}`} onClick={() => setOpen("bot")}>
          <span className={s.avatar}>
            <PromoBotIcon width={22} height={22} />
          </span>
          <span className={s.txt}>
            <span className={s.title}>Скоро — Telegram-бот</span>
            <span className={s.subtitle}>Заявки и отклики прямо в Telegram</span>
          </span>
          <span className={s.chip}>Подробнее</span>
        </button>
        <button type="button" className={`${s.plate} ${s.app}`} onClick={() => setOpen("app")}>
          <span className={s.avatar}>
            <PromoAppIcon width={22} height={22} />
          </span>
          <span className={s.txt}>
            <span className={s.title}>Скоро — приложение</span>
            <span className={s.subtitle}>Сделки и документы под рукой</span>
          </span>
          <span className={s.chip}>Подробнее</span>
        </button>
      </div>
      <PromoModal kind={open} onClose={() => setOpen(null)} />
    </>
  );
};

export default PromoBanner;
