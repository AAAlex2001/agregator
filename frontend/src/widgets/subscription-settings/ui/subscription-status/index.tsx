import type { UserSubscription } from "@/entities/pricing";
import styles from "./style.module.scss";

/** Действующая подписка либо отсутствие выбранного тарифа. */
interface SubscriptionStatusProps {
  subscription: UserSubscription | null;
}

/** Показывает срок действия тарифа или пояснение перед выбором подписки. */
export function SubscriptionStatus({ subscription }: SubscriptionStatusProps) {
  return (
    <div className={styles.statusBlock}>
      {subscription ? (
        <>
          <span className={styles.statusTitle}>{subscription.plan_name}</span>
          <span className={styles.statusSubtitle}>{subscription.active_label}</span>
        </>
      ) : (
        <>
          <span className={styles.statusTitle}>
            Выберите тариф для работы на платформе
          </span>
          <span className={styles.statusSubtitle}>
            Подписка открывает отклики на заказы по экспертизе промышленной безопасности
            и проектированию, прямое общение с заказчиками и доступ к профессиональным
            инструментам «Оценка крепи» и «Оценка опасности».
          </span>
        </>
      )}
    </div>
  );
}
