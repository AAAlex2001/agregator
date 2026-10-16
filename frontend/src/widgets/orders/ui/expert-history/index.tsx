"use client";

import { useExpertSummary } from "@/entities/expert";
import { OrderListProvider } from "@/entities/order";
import { Skeleton } from "@/shared/ui/skeleton";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import { ExpertHistoryList } from "../expert-history-list";
import styles from "./style.module.scss";

/** Публичный идентификатор исполнителя из адреса страницы. */
interface ExpertHistoryProps {
  publicId: string;
}

/** История выполненных заказов исполнителя с его именем в шапке. */
export function ExpertHistory({ publicId }: ExpertHistoryProps) {
  const { expert, error, isLoading } = useExpertSummary(publicId);

  return (
    <div className={styles.wrapper}>
      <div className={styles.pageHead}>
        <Title
          text="История заказов исполнителя"
          as="h1"
          className={styles.pageTitle}
        />
        {expert && (
          <Subtitle
            text={`Выполненные заказы: ${expert.full_name}`}
            className={styles.pageSubtitle}
          />
        )}
        {error && (
          <Subtitle
            text={error}
            className={styles.pageSubtitle}
          />
        )}
        {isLoading && (
          <Skeleton
            className={styles.expertNameSkeleton}
            rounded="pill"
          />
        )}
      </div>
      <OrderListProvider expertPublicId={publicId}>
        <ExpertHistoryList />
      </OrderListProvider>
    </div>
  );
}
