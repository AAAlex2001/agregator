import cn from "classnames";
import type { OrderWorkOption as WorkOption } from "../../model/order-form-types";
import type { OrderListItem } from "../../model/order-list-item";
import styles from "./style.module.scss";

/** Вариант направления и действие его выбора в форме заказа. */
interface OrderWorkOptionProps {
  option: WorkOption;
  isSelected: boolean;
  onSelect: (workType: OrderListItem["work_type"]) => void;
}

/** Показывает название и пояснение одного доступного вида работ. */
export function OrderWorkOption({
  option,
  isSelected,
  onSelect,
}: OrderWorkOptionProps) {
  /** Выбирает направление, указанное в этой карточке. */
  function selectDirection() {
    onSelect(option.value);
  }

  return (
    <button
      type="button"
      className={cn(styles.option, {
        [styles.optionActive]: isSelected,
      })}
      onClick={selectDirection}
    >
      <strong>{option.label}</strong>
      <span>{option.description}</span>
    </button>
  );
}
