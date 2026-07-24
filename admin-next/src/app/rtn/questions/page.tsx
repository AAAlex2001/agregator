"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RtnQuestion, listQuestions, setQuestionStatus } from "@/entities/rtn-question";

const STATUS_LABELS: Record<string, string> = { NEW: "Новый", PUBLISHED: "Обработан", DISMISSED: "Отклонён" };

export default function RtnQuestionsPage() {
  const router = useRouter();
  const [items, setItems] = useState<RtnQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await listQuestions());
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

  const changeStatus = async (id: number, status: "PUBLISHED" | "DISMISSED") => {
    try {
      const updated = await setQuestionStatus(id, status);
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch {
      alert("Не удалось обновить статус");
    }
  };

  return (
    <div className="page">
      <header className="topbar">
        <h1>«Не нашли ответ?» — вопросы посетителей</h1>
        <Link className="ghost" href="/rtn">← К разъяснениям</Link>
      </header>

      {loading ? (
        <div className="muted">Загрузка…</div>
      ) : items.length === 0 ? (
        <div className="muted">Вопросов пока нет.</div>
      ) : (
        <table className="grid">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Вопрос</th>
              <th>Контакт</th>
              <th>Статус</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((q) => (
              <tr key={q.id}>
                <td className="muted">{new Date(q.createdAt).toLocaleString("ru-RU")}</td>
                <td>{q.questionText}</td>
                <td className="muted">{q.contactEmail || "—"}</td>
                <td>
                  <span className={q.status === "NEW" ? "badge" : "badge ok"}>{STATUS_LABELS[q.status]}</span>
                </td>
                <td className="row-actions">
                  <Link className="btn primary" href={`/rtn/new?fromQuestion=${q.id}`}>
                    Создать разъяснение
                  </Link>
                  <button className="link" onClick={() => changeStatus(q.id, "PUBLISHED")}>
                    Обработан
                  </button>
                  <button className="link danger" onClick={() => changeStatus(q.id, "DISMISSED")}>
                    Отклонить
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
