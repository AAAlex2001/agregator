"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/source/features/session";
import { ChevronIcon } from "@/source/shared/ui/icons";
import { EXPERT_HELP_LINKS } from "@/source/widgets/expert-help";
import { getReviewLinks } from "@/source/widgets/reviews-hub";
import { getUsefulLinks } from "@/source/widgets/useful-links";
import s from "./cabinet-burger.module.scss";

type Section = "help" | "reviews" | "useful";

export function CabinetBurgerMenu() {
  const { role } = useSession();
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<Section | null>(null);

  const close = () => {
    setOpen(false);
    setSection(null);
  };

  const showHelp = role === "EXPERT";
  const reviewLinks = role === "EXPERT" || role === "CUSTOMER" ? getReviewLinks(role) : [];
  const usefulLinks = getUsefulLinks(role);

  const toggle = (key: Section) => setSection((prev) => (prev === key ? null : key));

  return (
    <>
      <button
        type="button"
        className={`${s.burger} ${open ? s.open : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Меню"
        aria-expanded={open}
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <nav className={s.menu}>
          {showHelp && (
            <div className={s.group}>
              <button
                type="button"
                className={`${s.groupHead} ${s.green} ${section === "help" ? s.groupOpen : ""}`}
                onClick={() => toggle("help")}
                aria-expanded={section === "help"}
              >
                Помощь эксперту
                <ChevronIcon className={s.chevron} color="currentColor" />
              </button>
              {section === "help" && (
                <div className={s.groupBody}>
                  {EXPERT_HELP_LINKS.map(({ href, label, Icon }) => (
                    <Link key={href} href={href} className={`${s.subLink} ${s.greenLink}`} onClick={close}>
                      <span className={s.subIcon}>
                        <Icon />
                      </span>
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {reviewLinks.length > 0 && (
            <div className={s.group}>
              <button
                type="button"
                className={`${s.groupHead} ${s.blue} ${section === "reviews" ? s.groupOpen : ""}`}
                onClick={() => toggle("reviews")}
                aria-expanded={section === "reviews"}
              >
                Все отзывы
                <ChevronIcon className={s.chevron} color="currentColor" />
              </button>
              {section === "reviews" && (
                <div className={s.groupBody}>
                  {reviewLinks.map(({ href, label, Icon }) => (
                    <Link key={href} href={href} className={`${s.subLink} ${s.blueLink}`} onClick={close}>
                      <span className={s.subIcon}>
                        <Icon />
                      </span>
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {usefulLinks.length > 0 && (
            <div className={s.group}>
              <button
                type="button"
                className={`${s.groupHead} ${s.purple} ${section === "useful" ? s.groupOpen : ""}`}
                onClick={() => toggle("useful")}
                aria-expanded={section === "useful"}
              >
                Полезные ссылки
                <ChevronIcon className={s.chevron} color="currentColor" />
              </button>
              {section === "useful" && (
                <div className={s.groupBody}>
                  {usefulLinks.map(({ href, label, Icon }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${s.subLink} ${s.purpleLink}`}
                      onClick={close}
                    >
                      <span className={s.subIcon}>
                        <Icon color="currentColor" />
                      </span>
                      {label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>
      )}
    </>
  );
}

export default CabinetBurgerMenu;
