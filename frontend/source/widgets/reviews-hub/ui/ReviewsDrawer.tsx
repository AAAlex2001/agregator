"use client";

import Link from "next/link";
import { useSession } from "@/source/features/session";
import { ReviewsAllIcon } from "@/source/shared/ui/icons";
import { getReviewLinks } from "../model/links";
import { useReviewsHub } from "../model/ReviewsHubContext";
import s from "./ReviewsDrawer.module.scss";

export function ReviewsDrawer() {
  const { role } = useSession();
  const { isAvailable, isOpen, anchor, close } = useReviewsHub();

  if (!isAvailable) return null;

  const links = getReviewLinks(role);

  return (
    <>
      <div
        className={`${s.backdrop} ${isOpen ? s.backdropVisible : ""}`}
        onClick={close}
        aria-hidden
      />

      <aside
        className={`${s.drawer} ${anchor ? s.pop : s.sheet} ${isOpen ? s.drawerOpen : ""}`}
        style={anchor ? { left: anchor.left, top: anchor.top } : undefined}
        aria-label="Все отзывы"
        aria-hidden={!isOpen}
      >
        <header className={s.head}>
          <div className={s.headTitle}>
            <span className={s.headIcon}>
              <ReviewsAllIcon />
            </span>
            <div>
              <h2 className={s.title}>Все отзывы</h2>
              <p className={s.subtitle}>Отзывы о площадке и экспертах</p>
            </div>
          </div>
          <button type="button" className={s.close} onClick={close} aria-label="Закрыть">
            ×
          </button>
        </header>

        <div className={s.body}>
          <div className={s.list}>
            {links.map(({ href, label, description, Icon }) => (
              <Link key={href} href={href} className={s.card} onClick={close}>
                <span className={s.cardIcon}>
                  <Icon />
                </span>
                <span className={s.cardText}>
                  <span className={s.cardLabel}>{label}</span>
                  <span className={s.cardDesc}>{description}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
