"use client";

import { useState } from "react";
import { ExpertInfo } from "@/entities/expert";
import { getReportPdfUrl, ReportOrderCard } from "@/entities/order";
import type { OrderListItem } from "@/entities/order";
import { downloadFile } from "@/shared/lib/download-file";
import { Button } from "@/shared/ui/button";
import { PdfViewer } from "@/shared/ui/pdf-viewer";
import { OrderQuestions } from "../order-questions";
import styles from "./style.module.scss";

/** Завершённый тендер, по которому заказчику доступен PDF-отчёт. */
interface CustomerReportItemProps {
  order: OrderListItem;
}

/** Соединяет карточку тендера с исполнителем, вопросами и просмотром PDF-отчёта. */
export function CustomerReportItem({ order }: CustomerReportItemProps) {
  const [isViewing, setViewing] = useState(false);
  const pdfUrl = getReportPdfUrl(order.id);

  /** Открывает отчёт во встроенном просмотре. */
  function openViewer() {
    setViewing(true);
  }

  /** Закрывает просмотр отчёта. */
  function closeViewer() {
    setViewing(false);
  }

  /** Скачивает отчёт под номером тендера. */
  function download() {
    downloadFile(pdfUrl, `report-${order.id}.pdf`);
  }

  return (
    <>
      <ReportOrderCard
        order={order}
        executor={
          <ExpertInfo
            name={order.executor_name}
            avatarUrl={order.executor_avatar_url}
            rating={order.executor_rating}
            reviewCount={order.executor_review_count}
            expertPublicId={order.executor_public_id}
          />
        }
        actions={
          <div className={styles.actions}>
            <Button
              variant="outline"
              size="sm"
              className={styles.action}
              onClick={download}
            >
              Скачать PDF
            </Button>
            <Button
              variant="primary"
              size="sm"
              className={styles.action}
              onClick={openViewer}
            >
              Посмотреть отчёт
            </Button>
          </div>
        }
        footer={
          <OrderQuestions
            orderId={order.id}
            customerId={order.customer_id}
            canAsk={false}
          />
        }
      />
      {isViewing && (
        <PdfViewer
          url={pdfUrl}
          title={`Отчёт по тендеру №${order.id}`}
          onClose={closeViewer}
        />
      )}
    </>
  );
}
