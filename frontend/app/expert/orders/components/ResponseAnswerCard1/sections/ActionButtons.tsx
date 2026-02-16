import { Button } from "@/app/components";
import styles from "./sections.module.scss";

interface ActionButtonsProps {
  canPay: boolean;
  onCancel: () => void;
  onPay: () => void;
}

export default function ActionButtons({ canPay, onCancel, onPay }: ActionButtonsProps) {
  return (
    <div className={styles.actions}>
      <Button variant="outline" size="sm" fullWidth onClick={onCancel}>
        Отменить
      </Button>
      <Button variant="primary" size="sm" fullWidth disabled={!canPay} onClick={onPay}>
        Оплатить участие
      </Button>
    </div>
  );
}
