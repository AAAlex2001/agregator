import styles from "./loading.module.scss";
import { Loader } from "@/shared/ui";

export default function Loading() {
  return (
    <div className={styles.root}>
      <Loader size="lg" label="Загружаем…" />
    </div>
  );
}
