import { Button } from "@/shared/ui";
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
            Вы ещё не создали ни одного заказа
          </h2>
          <p className={styles.subtitle}>
            <span className={styles.subtitleAccent}>Опубликуйте заказ,</span> чтобы получить
            <br />
            отклики от экспертов по
            <br />
            промышленной безопасности
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          className={styles.button}
          onClick={onCreateOrder}
        >
          Добавить заказ
        </Button>
      </div>
    </div>
  );
}
