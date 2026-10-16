"use client";

import cn from "classnames";
import type { AccordionItem } from "./model/types";
import { AccordionItemView } from "./ui/accordion-item";
import styles from "./style.module.scss";

/** Раскрывающийся список с одним открытым пунктом и внешним управлением. */
interface AccordionProps {
  items: AccordionItem[];
  activeId: string | null;
  onToggle: (id: string) => void;
  className?: string;
}

/** Собирает пункты с общей разметкой и анимацией раскрытия. */
export function Accordion({
  items,
  activeId,
  onToggle,
  className,
}: AccordionProps) {
  return (
    <div className={cn(styles.list, className)}>
      {items.map((item) => (
        <AccordionItemView
          key={item.id}
          item={item}
          isOpen={activeId === item.id}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
