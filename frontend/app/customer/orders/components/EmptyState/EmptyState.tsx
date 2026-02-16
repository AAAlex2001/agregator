import { Button } from "@/app/components";
import styles from "./emptyState.module.scss";

interface EmptyStateProps {
  onCreateOrder: () => void;
}

export default function EmptyState({ onCreateOrder }: EmptyStateProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.textBlock}>
          <h2 className={styles.title}>
            У вас пока нет заказов
          </h2>
          <p className={styles.subtitle}>
            Создайте свой первый заказ
            <br />
            чтобы найти лучшего эксперта
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          className={styles.button}
          onClick={onCreateOrder}
        >
          Создать заказ
        </Button>
      </div>
    </div>
  );
}
