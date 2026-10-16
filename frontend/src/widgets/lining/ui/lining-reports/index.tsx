"use client";

import { LiningReportCard, useLiningReports } from "@/entities/lining";
import { Loader } from "@/shared/ui/loader";
import styles from "./style.module.scss";

/** История сохранённых отчётов оценки крепи. */
export function LiningReports() {
  const { reports, isLoading, error } = useLiningReports();

  if (isLoading) {
    return (
      <div className={styles.panel}>
        <div className={styles.loader}>
          <Loader
            label=""
            size="lg"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.panel}>
        <p className={styles.empty}>{error}</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className={styles.panel}>
        <p className={styles.empty}>Сохранённых отчётов пока нет.</p>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.list}>
        {reports.map((report) => (
          <LiningReportCard
            key={report.id}
            report={report}
          />
        ))}
      </div>
    </div>
  );
}
