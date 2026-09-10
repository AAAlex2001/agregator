"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RtnQuestion, RtnQuestionStatus, listQuestions, setQuestionStatus } from "@/entities/rtn-question";

const STATUS_LABELS: Record<RtnQuestionStatus, string> = {
  NEW: "Новый",
  IN_REVIEW: "В работе",
  PUBLISHED: "Обработан",
  DISMISSED: "Отклонён",
};

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

  const changeStatus = async (id: number, status: RtnQuestionStatus, dismissReason = "") => {
    try {
      const updated = await setQuestionStatus(id, status, dismissReason);
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch {
      alert("Не удалось обновить статус");
    }
  };

  const dismiss = async (id: number) => {
    const reason = prompt("Причина отклонения — её увидит автор вопроса:");
    if (reason === null) return;
    if (!reason.trim()) {
      alert("Без причины отклонить нельзя");
      return;
    }
    await changeStatus(id, "DISMISSED", reason.trim());
  };

  return (
    <div className="page wide-page">
      <header className="topbar">
        <h1>«Не нашли ответ?» — вопросы посетителей</h1>
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
                <td>
                  <div>{q.questionText}</div>
                  {q.answerSlug && (
                    <div className="muted">
                      Ответ:{" "}
                      <a href={`https://plus-resurs.com/rtn/${q.answerSlug}`} target="_blank" rel="noreferrer">
                        {q.answerTitle || q.answerSlug}
                      </a>
                    </div>
                  )}
                  {q.status === "DISMISSED" && q.dismissReason && (
                    <div className="muted">Причина: {q.dismissReason}</div>
                  )}
                </td>
                <td className="muted">{q.contactEmail || "—"}</td>
                <td>
                  <span className={q.status === "PUBLISHED" ? "badge ok" : "badge"}>
                    {STATUS_LABELS[q.status]}
                  </span>
                </td>
                <td className="row-actions">
                  <Link className="btn primary" href={`/rtn/new?fromQuestion=${q.id}`}>
                    Создать разъяснение
                  </Link>
                  <button className="link" onClick={() => changeStatus(q.id, "IN_REVIEW")}>
                    В работу
                  </button>
                  <button className="link danger" onClick={() => dismiss(q.id)}>
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
