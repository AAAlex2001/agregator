import Button from "@/source/shared/ui/Button";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { ServicesAccordion, type ServicesAccordionItem } from "../../shared/ui/ServicesAccordion";
import {
  FORENSIC_GROUPS,
  FORENSIC_LABOUR_SAFETY,
  type ForensicExpertiseItem,
} from "../model/content";
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

interface ForensicAccordionItem extends ServicesAccordionItem {
  items: ForensicExpertiseItem[];
}

const ACCORDION_ITEMS: ForensicAccordionItem[] = FORENSIC_GROUPS.map((group) => ({
  title: group.title,
  text: group.description,
  image: "",
  href: group.href,
  items: group.items,
}));

export function ForensicCatalog() {
  return (
    <section className={s.section} id="vidy-ekspertiz">
      <div className={s.content}>
        <header className={s.header}>
          <Title text="Виды судебной экспертизы" as="h2" />
          <Subtitle text="Выберите направление — внутри собраны конкретные виды исследований и рецензии на заключения." />
        </header>

        <ServicesAccordion
          items={ACCORDION_ITEMS}
          hideItemText
          mobileStack
          renderVisual={(item) => (
            <div className={s.kindsPanel}>
              <p className={s.kindsDesc}>{item.text}</p>
              <ul className={s.kinds}>
                {item.items.map((kind, index) => (
                  <li key={kind.label} className={s.kindsItem}>
                    <a className={s.card} href={kind.href} target="_blank" rel="noopener noreferrer">
                      <span className={s.cardNum}>{String(index + 1).padStart(2, "0")}</span>
                      <span className={s.cardLabel}>{kind.label}</span>
                      <ArrowUpRight />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          renderActions={(item) => (
            <Button
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="md"
              showArrow
              className={s.groupBtn}
            >
              Подробнее о направлении
            </Button>
          )}
        />

        <div className={s.safety}>
          <h3 className={s.safetyTitle}>{FORENSIC_LABOUR_SAFETY.title}</h3>
          <p className={s.safetyDesc}>{FORENSIC_LABOUR_SAFETY.description}</p>
        </div>
      </div>
    </section>
  );
}
