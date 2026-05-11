"use client";

import { useState } from "react";
import type { OrderCardData } from "@/source/entities/order";
import { ResponsesSkeleton } from "@/source/widgets/responses/ui/ResponsesSkeleton";
import { EmptyStateCard } from "@/source/shared/ui";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import Loader from "@/source/shared/ui/Loader";
import { useInfiniteScroll } from "@/source/shared/lib/useInfiniteScroll";
import { getReportPdfUrl, useReports } from "@/source/features/reports";
import { ReportCard } from "./ReportCard";
import { ReportPdfViewer } from "./ReportPdfViewer";
import s from "./ReportsWidget.module.scss";

function downloadPdf(card: OrderCardData) {
  const link = document.createElement("a");
  link.href = getReportPdfUrl(card.id);
  link.download = `report-${card.id}.pdf`;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function ReportsWidget() {
  const { items, hasMore, isLoading, isLoadingMore, error, loadMore } = useReports();
  const [viewing, setViewing] = useState<OrderCardData | null>(null);

  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: isLoading || isLoadingMore,
    onLoadMore: () => void loadMore(),
  });

  return (
    <div className={s.wrapper}>
      <div className={s.pageHead}>
        <Title text="Мои отчёты" as="h1" className={s.pageTitle} />
        <Subtitle
          text="Отчёты по завершённым тендерам: участники и выбранный исполнитель"
          className={s.pageSubtitle}
        />
      </div>

      <div className={s.contentArea}>
        <div className={s.contentBody}>
          {isLoading ? (
            <ResponsesSkeleton compact hideTabs />
          ) : error ? (
            <div className={s.empty}>
              <EmptyStateCard title="Ошибка загрузки" subtitle={error} />
            </div>
          ) : items.length === 0 ? (
            <div className={s.empty}>
              <EmptyStateCard
                title="Отчётов пока нет"
                subtitle="Здесь появятся отчёты по завершённым тендерам"
              />
            </div>
          ) : (
            <>
              <div className={s.list}>
                {items.map((card) => (
                  <ReportCard
                    key={card.id}
                    card={card}
                    onView={() => setViewing(card)}
                    onDownload={() => downloadPdf(card)}
                  />
                ))}
                {isLoadingMore && (
                  <div className={s.loadMore}>
                    <Loader label="" size="md" />
                  </div>
                )}
              </div>
              <div ref={sentinelRef} aria-hidden="true" />
            </>
          )}
        </div>
      </div>

      {viewing && (
        <ReportPdfViewer
          orderId={viewing.id}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}
