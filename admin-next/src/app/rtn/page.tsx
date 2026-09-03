"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RtnClarificationListItem, deleteClarification, listClarifications } from "@/entities/rtn-clarification";

const DOCUMENT_TYPE: Record<string, string> = {
  OFFICIAL_CLARIFICATION: "Офиц. разъяснение",
  INFO_LETTER: "Инф. письмо",
  RESPONSE_TO_REQUEST: "Ответ на обращение",
};
const STATUS: Record<string, string> = { ACTIVE: "Действует", EXPIRED: "Утратило силу" };
const PUBLICATION_STATUS: Record<string, string> = { DRAFT: "Черновик", PUBLISHED: "Опубликовано" };

export default function RtnListPage() {
  const router = useRouter();
  const [items, setItems] = useState<RtnClarificationListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [publicationStatus, setPublicationStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listClarifications({ publicationStatus: publicationStatus || undefined });
      setItems(data.items);
      setTotal(data.total);
    } catch (e) {
      if (e instanceof Error && e.message === "UNAUTHORIZED") return router.replace("/login");
      setError("Не удалось загрузить список");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicationStatus]);

  const onDelete = async (id: number, title: string) => {
    if (!confirm(`Удалить «${title}»? Это необратимо.`)) return;
    try {
      await deleteClarification(id);
      setItems((prev) => prev.filter((c) => c.id !== id));
      setTotal((t) => t - 1);
    } catch {
      alert("Не удалось удалить");
    }
  };

  return (
    <div className="page">
      <header className="topbar">
        <h1>Ростехнадзор отвечает</h1>
      </header>

      <div className="toolbar">
        <Link className="btn primary" href="/rtn/new">+ Новое разъяснение</Link>
        <select value={publicationStatus} onChange={(e) => setPublicationStatus(e.target.value)}>
          <option value="">Все статусы публикации</option>
          <option value="DRAFT">Черновики</option>
          <option value="PUBLISHED">Опубликованные</option>
        </select>
        <span className="muted count">Всего: {total}</span>
      </div>

      {error && <div className="error">{error}</div>}
      {loading ? (
        <div className="muted">Загрузка…</div>
      ) : items.length === 0 ? (
        <div className="muted">Ничего не найдено.</div>
      ) : (
        <table className="grid">
          <thead>
            <tr>
              <th>ID</th>
              <th>Тип</th>
              <th>Актуальность</th>
              <th>Публикация</th>
              <th>Заголовок</th>
              <th>Номер письма</th>
              <th>Обновлено</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{DOCUMENT_TYPE[c.documentType]}</td>
                <td>
                  <span className={c.status === "ACTIVE" ? "badge ok" : "badge"}>{STATUS[c.status]}</span>
                </td>
                <td>
                  <span className={c.publicationStatus === "PUBLISHED" ? "badge ok" : "badge"}>
                    {PUBLICATION_STATUS[c.publicationStatus]}
                  </span>
                </td>
                <td>
                  <Link href={`/rtn/edit/${c.id}`}>{c.title || "(без заголовка)"}</Link>
                </td>
                <td className="muted">{c.letterNumber}</td>
                <td className="muted">{new Date(c.updatedAt).toLocaleString("ru-RU")}</td>
                <td className="row-actions">
                  <Link href={`/rtn/edit/${c.id}`}>Редактировать</Link>
                  <button className="link danger" onClick={() => onDelete(c.id, c.title)}>
                    Удалить
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
