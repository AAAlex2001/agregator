"use client";

import Button from "@/source/shared/ui/Button";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { LandingTabsShowcase } from "../../shared/ui/LandingTabsShowcase";
import { FORENSIC_GROUPS, FORENSIC_LABOUR_SAFETY } from "../model/content";
import s from "./catalog.module.scss";

function ArrowUpRight() {
  return (
    <svg
      className={s.cardArrow}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function ForensicCatalog() {
  return (
    <section className={s.section} id="vidy-ekspertiz">
      <div className={s.content}>
        <header className={s.header}>
          <Title text="Виды судебной экспертизы" as="h2" />
          <Subtitle text="Выберите направление — внутри собраны конкретные виды исследований и рецензии на заключения." />
        </header>

        <LandingTabsShowcase
          items={FORENSIC_GROUPS}
          renderPanel={(group) => (
            <>
              <div className={s.groupHead}>
                <div className={s.groupText}>
                  <h3 className={s.groupTitle}>{group.title}</h3>
                  <p className={s.groupDesc}>{group.description}</p>
                </div>
                <Button
                  href={group.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="md"
                  showArrow
                  className={s.groupBtn}
                >
                  Подробнее о направлении
                </Button>
              </div>

              <ul className={s.grid}>
                {group.items.map((item, index) => (
                  <li key={item.label} className={s.gridItem}>
                    <a className={s.card} href={item.href} target="_blank" rel="noopener noreferrer">
                      <span className={s.cardNum}>{String(index + 1).padStart(2, "0")}</span>
                      <span className={s.cardLabel}>{item.label}</span>
                      <ArrowUpRight />
                    </a>
                  </li>
                ))}
              </ul>

              <div className={s.safety}>
                <h3 className={s.safetyTitle}>{FORENSIC_LABOUR_SAFETY.title}</h3>
                <p className={s.safetyDesc}>{FORENSIC_LABOUR_SAFETY.description}</p>
              </div>
            </>
          )}
        />
      </div>
    </section>
  );
}
