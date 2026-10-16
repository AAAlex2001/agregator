"use client";

import cn from "classnames";
import { useState } from "react";
import { downloadFile } from "@/shared/lib/download-file";
import { formatWithTime } from "@/shared/lib/format-date";
import { Button } from "@/shared/ui/button";
import { PdfViewer } from "@/shared/ui/pdf-viewer";
import { getLiningReportPdfUrl } from "../../api/get-lining-report-pdf-url";
import {
  getLiningRiskTone,
  getServiceLifeFraction,
  getShortLiningCategory,
} from "../../model/risk";
import type { LiningReport } from "../../model/types";
import { ReportGauge } from "../report-gauge";
import styles from "./style.module.scss";

/** Сохранённый отчёт из истории эксперта. */
interface LiningReportCardProps {
  report: LiningReport;
}

/** Показывает риск, сроки службы и группы отчёта; открывает или скачивает его PDF. */
export function LiningReportCard({ report }: LiningReportCardProps) {
  const [isViewing, setViewing] = useState(false);
  const pdfUrl = getLiningReportPdfUrl(report.id);
  const riskColor = `var(--color-risk-${getLiningRiskTone(report.overall_category)})`;

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
      </div>

      <div className={styles.name}>{report.name}</div>

      <div className={styles.gauges}>
        <ReportGauge
          value={report.overall_r}
          unit="%"
          label={`Риск · ${getShortLiningCategory(report.overall_category)}`}
          fraction={report.overall_r / 100}
          color={riskColor}
        />
        <ReportGauge
          value={report.final_capital}
          unit="лет"
          label="До капремонта"
          fraction={getServiceLifeFraction(report.final_capital)}
          color="var(--color-orange-primary)"
        />
        <ReportGauge
          value={report.final_emergency}
          unit="лет"
          label="До аварии"
          fraction={getServiceLifeFraction(report.final_emergency)}
          color="var(--color-risk-high)"
        />
      </div>

      {report.blocks.length > 0 && (
        <div className={styles.grid}>
          {report.blocks.map((block) => (
            <div
              key={block.group}
              className={styles.row}
            >
              <span className={styles.rowName}>{block.title}</span>
              <span className={cn(styles.badge, styles[getLiningRiskTone(block.category)])}>
                {block.value.toFixed(1)}% · {getShortLiningCategory(block.category)}
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
