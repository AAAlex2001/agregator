"use client";

import Loader from "@/source/shared/ui/Loader";
import { useHazardReports } from "../model/useHazardReports";
import { HazardReportCard } from "./HazardReportCard";
import s from "./HazardReports.module.scss";

export function HazardReports() {
  const { reports, loading } = useHazardReports();

  if (loading) return <Loader />;
  if (reports.length === 0) return <p className={s.empty}>Сохранённых отчётов пока нет.</p>;

  return (
    <div className={s.list}>
      {reports.map((report) => (
        <HazardReportCard key={report.id} item={report} />
      ))}
    </div>
  );
}
