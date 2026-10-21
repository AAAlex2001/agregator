import { CommissionContent } from "../commission-content";
import styles from "./style.module.scss";

/** Конкурсный отбор экспертов в кабинете рядом с боковым меню. */
export function CommissionCabinet() {
  return (
    <div className={styles.page}>
      <CommissionContent />
    </div>
  );
}