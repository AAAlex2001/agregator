"use client";

import Link from "next/link";
import { useSession } from "@/source/features/session";
import { ReviewIcon } from "@/source/shared/ui/icons";
import { getReviewLinks } from "../model/links";
import { useReviewsHub } from "../model/ReviewsHubContext";
import s from "./ReviewsDrawer.module.scss";

export function ReviewsDrawer() {
  const { role } = useSession();
  const { isAvailable, isOpen, close } = useReviewsHub();

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
        className={`${s.drawer} ${isOpen ? s.drawerOpen : ""}`}
        aria-label="Все отзывы"
        aria-hidden={!isOpen}
      >
        <header className={s.head}>
          <div className={s.headTitle}>
            <span className={s.headIcon}>
              <ReviewIcon />
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
