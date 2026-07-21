"use client";

import type { ReactNode } from "react";
import { PlusIcon } from "@/source/shared/ui/icons";
import styles from "./accordion.module.scss";

interface AccordionItem {
  id: string;
  question: string;
  answer: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  activeId: string | null;
  onToggle: (id: string) => void;
  className?: string;
}

const Accordion = ({ items, activeId, onToggle, className = "" }: AccordionProps) => {
  return (
    <div className={`${styles.list} ${className}`}>
      {items.map((item) => {
        const isOpen = activeId === item.id;
        return (
          <div
            key={item.id}
            className={`${styles.item} ${isOpen ? styles.open : ""}`}
          >
            <button
              type="button"
              className={styles.question}
              onClick={() => onToggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={`accordion-answer-${item.id}`}
            >
              <span>{item.question}</span>
              <span className={`${styles.icon} ${isOpen ? styles.open : ""}`}>
                <PlusIcon isOpen={isOpen} />
              </span>
            </button>
            <div
              id={`accordion-answer-${item.id}`}
              role="region"
              className={`${styles.answer} ${isOpen ? styles.open : ""}`}
            >
              <div className={styles.answerInner}>
                <div>{item.answer}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
