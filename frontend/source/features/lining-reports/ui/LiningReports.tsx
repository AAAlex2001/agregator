"use client";

import Loader from "@/source/shared/ui/Loader";
import { useLiningReports } from "../model/useLiningReports";
import { LiningReportCard } from "./LiningReportCard";
import s from "./LiningReports.module.scss";

export function LiningReports() {
  const { reports, loading } = useLiningReports();

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
              <LiningReportCard key={report.id} item={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
