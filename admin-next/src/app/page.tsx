"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArticleListItem, deleteArticle, listArticles, logout } from "@/entities/article";
import { TagsPanel } from "@/features/tags-manage/TagsPanel";

const KIND: Record<string, string> = { NEWS: "Новость", BLOG: "Блог" };
const STATUS: Record<string, string> = { DRAFT: "Черновик", PUBLISHED: "Опубликована" };

export default function ListPage() {
  const router = useRouter();
  const [items, setItems] = useState<ArticleListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [kind, setKind] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listArticles({ kind: kind || undefined, status: status || undefined });
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
  }, [kind, status]);

  const onLogout = async () => {
    await logout();
    router.replace("/login");
    router.refresh();
  };

  const onDelete = async (id: number, title: string) => {
    if (!confirm(`Удалить «${title}»? Это необратимо.`)) return;
    try {
      await deleteArticle(id);
      setItems((prev) => prev.filter((a) => a.id !== id));
      setTotal((t) => t - 1);
    } catch {
      alert("Не удалось удалить");
    }
  };

  return (
    <div className="page">
      <header className="topbar">
        <h1>Статьи · Новости и блог</h1>
        <div className="topbar-right">
          <Link className="btn" href="/rtn">Ростехнадзор отвечает</Link>
          <Link className="btn" href="/contact-deals">Чеки и контакты</Link>
          <button className="ghost" onClick={onLogout}>Выйти</button>
        </div>
      </header>

      <div className="toolbar">
        <Link className="btn primary" href="/new">+ Новая статья</Link>
        <select value={kind} onChange={(e) => setKind(e.target.value)}>
          <option value="">Все типы</option>
          <option value="NEWS">Новости</option>
          <option value="BLOG">Блог</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Все статусы</option>
          <option value="DRAFT">Черновики</option>
          <option value="PUBLISHED">Опубликованные</option>
        </select>
        <span className="muted count">Всего: {total}</span>
      </div>

      <TagsPanel />

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
              <th>Статус</th>
              <th>Заголовок</th>
              <th>Slug</th>
              <th>Обновлена</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{KIND[a.kind]}</td>
                <td><span className={a.status === "PUBLISHED" ? "badge ok" : "badge"}>{STATUS[a.status]}</span></td>
                <td><Link href={`/edit/${a.id}`}>{a.title || "(без заголовка)"}</Link></td>
                <td className="muted">{a.slug}</td>
                <td className="muted">{new Date(a.updatedAt).toLocaleString("ru-RU")}</td>
                <td className="row-actions">
                  <Link href={`/edit/${a.id}`}>Редактировать</Link>
                  <button className="link danger" onClick={() => onDelete(a.id, a.title)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
