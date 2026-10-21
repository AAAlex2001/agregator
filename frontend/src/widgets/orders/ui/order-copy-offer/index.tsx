import { Button } from "@/shared/ui/button";
import { FormSection } from "@/shared/ui/form-section";
import styles from "./style.module.scss";

/** Открытие выбора своей заявки для копирования. */
interface OrderCopyOfferProps {
  onCopy: () => void;
}

/** Предложение заполнить заказ копией своей заявки — в начале формы. */
export function OrderCopyOffer({ onCopy }: OrderCopyOfferProps) {
  return (
    <FormSection
      title="По образцу"
      hint="Заказ похож на прошлый? Заполните его копией своей заявки и поправьте отличия"
    >
      <Button
        variant="outline"
        size="field"
        className={styles.button}
        onClick={onCopy}
      >
        Скопировать заявку
      </Button>
    </FormSection>
  );
}
