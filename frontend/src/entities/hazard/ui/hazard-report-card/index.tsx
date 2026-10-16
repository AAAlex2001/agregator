"use client";

import cn from "classnames";
import { useState } from "react";
import { downloadFile } from "@/shared/lib/download-file";
import { formatWithTime } from "@/shared/lib/format-date";
import { Button } from "@/shared/ui/button";
import { PdfViewer } from "@/shared/ui/pdf-viewer";
import { getHazardReportPdfUrl } from "../../api/get-hazard-report-pdf-url";
import { getHazardRiskTone, getShortHazardCategory } from "../../model/risk";
import type { HazardReport } from "../../model/types";
import { RiskRing } from "../risk-ring";
import styles from "./style.module.scss";

/** Сохранённый отчёт из истории эксперта. */
interface HazardReportCardProps {
  report: HazardReport;
}

/** Показывает итог отчёта по группам и открывает или скачивает его PDF. */
export function HazardReportCard({ report }: HazardReportCardProps) {
  const [isViewing, setViewing] = useState(false);
  const pdfUrl = getHazardReportPdfUrl(report.id);
  const profileLabel = report.profile === "shahta" ? "Шахта" : "Рудник";

  /** Открывает PDF во встроенном просмотре. */
  function openViewer() {
    setViewing(true);
  }

  /** Закрывает просмотр PDF. */
  function closeViewer() {
    setViewing(false);
  }

  /** Скачивает PDF под названием отчёта. */
  function download() {
    downloadFile(pdfUrl, `${report.name}.pdf`);
  }

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <span className={styles.date}>{formatWithTime(report.created_at)}</span>
        <span className={styles.profile}>{profileLabel}</span>
      </div>

      <div className={styles.main}>
        <div className={styles.info}>
          <div className={styles.name}>{report.name}</div>
          <div className={styles.caption}>
            Показатель риска на объекте · {getShortHazardCategory(report.overall_category)}
          </div>
        </div>
        <RiskRing percent={report.overall_r} />
      </div>

      {report.blocks.length > 0 && (
        <div className={styles.grid}>
          {report.blocks.map((block) => (
            <div
              key={block.group}
              className={styles.row}
            >
              <span className={styles.rowName}>{block.title}</span>
              <span className={cn(styles.badge, styles[getHazardRiskTone(block.category)])}>
                {block.value.toFixed(1)}% · {getShortHazardCategory(block.category)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.actions}>
        <Button
          variant="outlineOrange"
          fullWidth
          onClick={openViewer}
        >
          Посмотреть
        </Button>
        <Button
          variant="primary"
          fullWidth
          onClick={download}
        >
          Скачать
        </Button>
      </div>

      {isViewing && (
        <PdfViewer
          url={pdfUrl}
          title={report.name}
          onClose={closeViewer}
        />
      )}
    </div>
  );
}
