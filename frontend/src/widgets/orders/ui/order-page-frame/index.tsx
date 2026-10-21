import type { ReactNode } from "react";
import { EmptyState } from "@/shared/ui/empty-state";
import { Loader } from "@/shared/ui/loader";
import styles from "./style.module.scss";

/** Состояние загрузки страницы и её содержимое после загрузки. */
interface OrderPageFrameProps {
  isLoading: boolean;
  error: string | null;
  backHref: string;
  backLabel: string;
  children: ReactNode;
}

/** Рамка отдельной страницы заказа или отклика: загрузка по центру, ошибка или содержимое. */
export function OrderPageFrame({
  isLoading,
  error,
  backHref,
  backLabel,
  children,
}: OrderPageFrameProps) {
  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loader}>
          <Loader size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <EmptyState
          title="Страница недоступна"
          subtitle={error}
          actionLabel={backLabel}
          actionHref={backHref}
        />
      </div>
    );
  }

  return <div className={styles.page}>{children}</div>;
}
