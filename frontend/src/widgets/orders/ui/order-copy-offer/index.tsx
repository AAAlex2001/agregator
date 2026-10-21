import { Button } from "@/shared/ui/button";
import styles from "./style.module.scss";

/** Открытие выбора своей заявки для копирования. */
interface OrderCopyOfferProps {
  onCopy: () => void;
}

/** Предложение заполнить заказ копией своей заявки — в начале формы, пока ничего не введено. */
export function OrderCopyOffer({ onCopy }: OrderCopyOfferProps) {
  return (
    <div className={styles.offer}>
      <span className={styles.text}>Заказ похож на прошлый? Заполните его копией своей заявки</span>
      <Button
        variant="outlineOrange"
        size="field"
        onClick={onCopy}
      >
        Скопировать заявку
      </Button>
    </div>
  );
}