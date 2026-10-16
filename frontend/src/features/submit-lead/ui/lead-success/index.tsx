import type { LeadDirection } from "@/entities/lead";
import { Button } from "@/shared/ui/button";
import styles from "./style.module.scss";

/** Направление заявки, принятой сервером. */
interface LeadSuccessProps {
  direction: LeadDirection;
}

/** Подтверждает отправку и предлагает открыть страницу выбранного направления. */
export function LeadSuccess({ direction }: LeadSuccessProps) {
  return (
    <div className={styles.done}>
      <h2 className={styles.doneTitle}>Заявка отправлена</h2>
      <p className={styles.doneText}>
        Мы получили вашу задачу по направлению «{direction.label}» и свяжемся
        с вами по указанному телефону в ближайшее рабочее время.
      </p>
      <Button
        href={direction.href}
        variant="outline"
        size="md"
        className={styles.doneButton}
      >
        Посмотреть направление
      </Button>
    </div>
  );
}
