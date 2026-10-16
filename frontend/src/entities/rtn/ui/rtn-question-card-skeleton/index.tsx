import { ListCard } from "@/shared/ui/list-card";
import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Сохраняет место карточки обращения, пока загружается список. */
export function RtnQuestionCardSkeleton() {
  return (
    <ListCard
      meta={
        <Skeleton
          className={styles.meta}
          rounded="pill"
        />
      }
      title={
        <Skeleton
          className={styles.title}
          rounded="md"
        />
      }
      bottomLeftLabel="Дата отправки"
      bottomLeftValue={
        <Skeleton
          className={styles.date}
          rounded="pill"
        />
      }
    />
  );
}
