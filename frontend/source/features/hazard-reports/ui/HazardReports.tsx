"use client";

import Loader from "@/source/shared/ui/Loader";
import { getHazardReportPdfUrl } from "@/source/entities/hazard";
import { useHazardReports } from "../model/useHazardReports";
import s from "./HazardReports.module.scss";

const PROFILE_LABELS: Record<string, string> = { rudnik: "Рудник", shahta: "Шахта" };

export function HazardReports() {
  const { reports, loading } = useHazardReports();

  if (loading) return <Loader />;
  if (reports.length === 0) return <p className={s.empty}>Сохранённых отчётов пока нет.</p>;

  return (
    <div className={s.list}>
      {reports.map((report) => (
        <div key={report.id} className={s.card}>
          <div className={s.info}>
            <span className={s.name}>{report.name}</span>
            <span className={s.meta}>
              {PROFILE_LABELS[report.profile] ?? report.profile} ·{" "}
              {new Date(report.created_at).toLocaleDateString("ru-RU")} · R = {report.overall_r.toFixed(1)}% ·{" "}
              {report.overall_category}
            </span>
          </div>
          <a className={s.download} href={getHazardReportPdfUrl(report.id)} target="_blank" rel="noopener noreferrer">
            Скачать PDF
          </a>
        </div>
      ))}
    </div>
  );
}
