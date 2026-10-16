import cn from "classnames";
import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Сторона переписки, у которой стоит заглушка. */
interface MessageSkeletonProps {
  isMine: boolean;
}

/** Заглушка двух сообщений одного отправителя на время загрузки переписки. */
export function MessageSkeleton({ isMine }: MessageSkeletonProps) {
  return (
    <div
      className={cn(styles.group, isMine ? styles.mine : styles.other)}
      aria-hidden="true"
    >
      <Skeleton
        className={styles.wide}
        rounded="lg"
      />
      <Skeleton
        className={styles.short}
        rounded="lg"
      />
    </div>
  );
}
