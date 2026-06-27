"use client";

import Loader from "@/source/shared/ui/Loader";
import { useHazardReports } from "../model/useHazardReports";
import { HazardReportCard } from "./HazardReportCard";
import s from "./HazardReports.module.scss";

export function HazardReports() {
  const { reports, loading } = useHazardReports();

  return (
    <div className={s.panel}>
      <div className={s.body}>
        {loading ? (
          <div className={s.loaderWrap}>
            <Loader label="" size="lg" />
          </div>
        ) : reports.length === 0 ? (
          <p className={s.empty}>Сохранённых отчётов пока нет.</p>
        ) : (
          <div className={s.list}>
            {reports.map((report) => (
              <HazardReportCard key={report.id} item={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
