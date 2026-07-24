"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RtnChangeReport, listChangeReports, setChangeReportStatus } from "@/entities/rtn-change-report";

const STATUS_LABELS: Record<string, string> = { NEW: "Новое", REVIEWED: "Рассмотрено", APPLIED: "Применено" };

export default function RtnChangeReportsPage() {
  const router = useRouter();
  const [items, setItems] = useState<RtnChangeReport[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await listChangeReports());
    } catch (e) {
      if (e instanceof Error && e.message === "UNAUTHORIZED") return router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeStatus = async (id: number, status: "REVIEWED" | "APPLIED") => {
    try {
      const updated = await setChangeReportStatus(id, status);
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch {
      alert("Не удалось обновить статус");
    }
  };

  return (
    <div className="page">
      <header className="topbar">
        <h1>«Сообщить об изменении» — сигналы об устаревших разъяснениях</h1>
        <Link className="ghost" href="/rtn">← К разъяснениям</Link>
      </header>

      {loading ? (
        <div className="muted">Загрузка…</div>
      ) : items.length === 0 ? (
        <div className="muted">Сообщений пока нет.</div>
      ) : (
        <table className="grid">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Разъяснение</th>
              <th>Описание</th>
              <th>Статус</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((report) => (
              <tr key={report.id}>
                <td className="muted">{new Date(report.createdAt).toLocaleString("ru-RU")}</td>
                <td>
                  <Link href={`/rtn/edit/${report.clarificationId}`}>#{report.clarificationId}</Link>
                </td>
                <td>{report.description}</td>
                <td>
                  <span className={report.status === "NEW" ? "badge" : "badge ok"}>{STATUS_LABELS[report.status]}</span>
                </td>
                <td className="row-actions">
                  <button className="link" onClick={() => changeStatus(report.id, "REVIEWED")}>
                    Рассмотрено
                  </button>
                  <button className="link" onClick={() => changeStatus(report.id, "APPLIED")}>
                    Применено
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
