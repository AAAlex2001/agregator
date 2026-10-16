import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Сохраняет место двух карточек, пока загружаются вопросы заказа. */
export function QuestionsSkeleton() {
  return (
    <ul
      className={styles.list}
      aria-hidden="true"
    >
      {[1, 2].map((key) => (
        <li
          key={key}
          className={styles.card}
        >
          <div className={styles.head}>
            <Skeleton
              className={styles.avatar}
              rounded="pill"
            />
            <div className={styles.headText}>
              <Skeleton
                className={styles.name}
                rounded="md"
              />
              <Skeleton
                className={styles.date}
                rounded="md"
              />
            </div>
          </div>
          <Skeleton
            className={styles.line}
            rounded="md"
          />
          <Skeleton
            className={styles.lineShort}
            rounded="md"
          />
        </li>
      ))}
    </ul>
  );
}
