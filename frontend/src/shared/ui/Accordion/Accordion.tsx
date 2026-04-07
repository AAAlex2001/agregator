"use client";

import { PlusIcon } from "@/shared/ui/icons";
import styles from "./accordion.module.scss";

interface AccordionItem {
  id: string;
  question: string;
  answer: string;
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
            onClick={() => onToggle(item.id)}
          >
            <div className={styles.question}>
              <span>{item.question}</span>
              <span className={`${styles.icon} ${isOpen ? styles.open : ""}`}>
                <PlusIcon isOpen={isOpen} />
              </span>
            </div>
            <div className={`${styles.answer} ${isOpen ? styles.open : ""}`}>
              <div className={styles.answerInner}>
                <span>{item.answer}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
