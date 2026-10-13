"use client";

import { ExpertHistoryList, useExpertSummary } from "@/source/features/orders/expert-history";
import Skeleton from "@/source/shared/ui/Skeleton";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import s from "./ExpertHistoryWidget.module.scss";

interface ExpertHistoryWidgetProps {
  publicId: string;
}

/** История выполненных заказов исполнителя. */
export function ExpertHistoryWidget({ publicId }: ExpertHistoryWidgetProps) {
  const expert = useExpertSummary(publicId);

  return (
    <div className={s.wrapper}>
      <div className={s.pageHead}>
        <Title text="История заказов исполнителя" as="h1" className={s.pageTitle} />
        {expert ? (
          <Subtitle text={`Выполненные заказы: ${expert.fullName}`} className={s.pageSubtitle} />
        ) : (
          <Skeleton className={s.expertNameSkeleton} rounded="pill" />
        )}
      </div>
      <ExpertHistoryList publicId={publicId} />
    </div>
  );
}
