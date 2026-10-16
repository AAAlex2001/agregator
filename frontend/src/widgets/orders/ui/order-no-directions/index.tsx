import { Button } from "@/shared/ui/button";
import { Title } from "@/shared/ui/title";
import styles from "./style.module.scss";

/** Показ заголовка формы и возврат к списку заказов. */
interface OrderNoDirectionsProps {
  showHeading: boolean;
  onBack: () => void;
}

/** Объясняет, почему форма недоступна без выбранных направлений работы. */
export function OrderNoDirections({ showHeading, onBack }: OrderNoDirectionsProps) {
  return (
    <div className={styles.shell}>
      <div className={styles.form}>
        {showHeading && (
          <Title
            className={styles.title}
            text="Создание заказа"
          />
        )}
        <p className={styles.text}>
          У вас не выбрано ни одного направления работы. Перейдите в настройки
          профиля и отметьте направления, по которым размещаете заказы, — после
          этого форма станет доступна.
        </p>
        <Button
          href="/settings"
          variant="chat"
          size="md"
        >
          Перейти в настройки профиля
        </Button>
        <button
          type="button"
          className={styles.back}
          onClick={onBack}
        >
          Вернуться к заказам
        </button>
      </div>
    </div>
  );
}
