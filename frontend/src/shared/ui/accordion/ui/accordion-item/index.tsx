import cn from "classnames";
import { PlusIcon } from "@/shared/ui/icons";
import type { AccordionItem } from "../../model/types";
import styles from "./style.module.scss";

/** Пункт списка, состояние раскрытия и обработчик переключения. */
interface AccordionItemViewProps {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: (id: string) => void;
}

/** Показывает заголовок и сохраняет содержимое в HTML при закрытии пункта. */
export function AccordionItemView({
  item,
  isOpen,
  onToggle,
}: AccordionItemViewProps) {
  /** Передаёт идентификатор пункта владельцу состояния списка. */
  function toggle() {
    onToggle(item.id);
  }

  return (
    <div
      className={cn(styles.item, {
        [styles.open]: isOpen,
      })}
    >
      <button
        type="button"
        className={styles.question}
        aria-expanded={isOpen}
        aria-controls={`accordion-answer-${item.id}`}
        onClick={toggle}
      >
        <span>{item.question}</span>
        <span
          className={cn(styles.icon, {
            [styles.open]: isOpen,
          })}
        >
          <PlusIcon isOpen={isOpen} />
        </span>
      </button>
      <div
        id={`accordion-answer-${item.id}`}
        role="region"
        className={cn(styles.answer, {
          [styles.open]: isOpen,
        })}
      >
        <div className={styles.answerInner}>
          <div>{item.answer}</div>
        </div>
      </div>
    </div>
  );
}
