import { CommissionContent } from "../commission-content";
import styles from "./style.module.scss";

/** Конкурсный отбор экспертов на сайте. */
export function CommissionPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <CommissionContent />
      </div>
    </main>
  );
}