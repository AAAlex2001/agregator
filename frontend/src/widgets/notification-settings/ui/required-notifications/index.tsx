import { Switch } from "@/shared/ui/switch";
import styles from "./style.module.scss";

/** Показывает неизменяемую подписку держателя документов на заявки исполнителей. */
export function RequiredNotifications() {
  return (
    <div className={styles.notifications}>
      <header className={styles.text}>
        <h2 className={styles.title}>Почтовые уведомления</h2>
        <p className={styles.subtitle}>
          Уведомления о новых заявках исполнителей включены всегда.
        </p>
      </header>

      <Switch
        id="pref-email-on-labor-listing"
        checked
        onChange={() => undefined}
        label="Новые заявки исполнителей"
        description="Новые объявления исполнителей о готовности к трудоустройству."
        disabled
      />
    </div>
  );
}
