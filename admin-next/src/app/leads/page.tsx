"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Lead,
  LeadStatus,
  LEAD_DIRECTION_LABELS,
  LEAD_STATUS_LABELS,
  listLeads,
  updateLead,
} from "@/entities/lead";

export default function LeadsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Lead[]>([]);
  const [status, setStatus] = useState<"" | LeadStatus>("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await listLeads(status || undefined));
    } catch (e) {
      if (e instanceof Error && e.message === "UNAUTHORIZED") return router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const changeStatus = async (id: number, next: LeadStatus) => {
    try {
      const updated = await updateLead(id, { status: next });
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch {
      alert("Не удалось обновить заявку");
    }
  };

  const saveComment = async (id: number, comment: string) => {
    try {
      const updated = await updateLead(id, { comment });
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch {
      alert("Не удалось сохранить заметку");
    }
  };

  return (
    <div className="page">
      <header className="topbar">
        <h1>Заявки с сайта</h1>
      </header>

      <div className="toolbar">
        <select value={status} onChange={(e) => setStatus(e.target.value as "" | LeadStatus)}>
          <option value="">Все статусы</option>
          <option value="NEW">Новые</option>
          <option value="IN_WORK">В работе</option>
          <option value="DONE">Обработанные</option>
          <option value="SPAM">Спам</option>
        </select>
        <span className="muted count">Всего: {items.length}</span>
      </div>

      {loading ? (
        <div className="muted">Загрузка…</div>
      ) : items.length === 0 ? (
        <div className="muted">Заявок пока нет.</div>
      ) : (
        <table className="grid">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Направление</th>
              <th>Контакты</th>
              <th>Задача</th>
              <th>Статус</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((lead) => (
              <tr key={lead.id}>
                <td className="muted">{new Date(lead.createdAt).toLocaleString("ru-RU")}</td>
                <td>{LEAD_DIRECTION_LABELS[lead.direction] ?? lead.direction}</td>
                <td>
                  <div>
                    <b>{lead.name}</b>
                  </div>
                  <div>{lead.phone}</div>
                  {lead.email && <div className="muted">{lead.email}</div>}
                  {lead.company && (
                    <div className="muted">
                      {lead.company}
                      {lead.inn && ` · ИНН ${lead.inn}`}
                    </div>
                  )}
                  {lead.region && <div className="muted">{lead.region}</div>}
                </td>
                <td>
                  {lead.workKinds && <div><b>{lead.workKinds}</b></div>}
                  <div>{lead.task}</div>
                  {lead.objectName && <div className="muted">Объект: {lead.objectName}</div>}
                  {(lead.deadline || lead.budget) && (
                    <div className="muted">
                      {lead.deadline && `Срок: ${lead.deadline}`}
                      {lead.deadline && lead.budget && " · "}
                      {lead.budget && `Бюджет: ${lead.budget}`}
                    </div>
                  )}
                  {lead.sourceUrl && (
                    <div className="muted">
                      <a href={lead.sourceUrl} target="_blank" rel="noopener noreferrer">
                        Страница обращения
                      </a>
                    </div>
                  )}
                  {expanded === lead.id ? (
                    <textarea
                      autoFocus
                      defaultValue={lead.comment}
                      placeholder="Заметка менеджера"
                      onBlur={(e) => {
                        setExpanded(null);
                        if (e.target.value !== lead.comment) void saveComment(lead.id, e.target.value);
                      }}
                    />
                  ) : (
                    <div className="muted">
                      {lead.comment ? `Заметка: ${lead.comment}` : null}{" "}
                      <button className="link" onClick={() => setExpanded(lead.id)}>
                        {lead.comment ? "изменить" : "+ заметка"}
                      </button>
                    </div>
                  )}
                </td>
                <td>
                  <span className={lead.status === "NEW" ? "badge" : "badge ok"}>
                    {LEAD_STATUS_LABELS[lead.status]}
                  </span>
                </td>
                <td className="row-actions">
                  <button className="link" onClick={() => changeStatus(lead.id, "IN_WORK")}>
                    В работу
                  </button>
                  <button className="link" onClick={() => changeStatus(lead.id, "DONE")}>
                    Обработана
                  </button>
                  <button className="link danger" onClick={() => changeStatus(lead.id, "SPAM")}>
                    Спам
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
