"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  listContactDeals,
  type AdminContactDealListItem,
  type ContactDealStatus,
} from "@/entities/contact-deal";

const STATUS_LABELS: Record<ContactDealStatus, string> = {
  AWAITING_BUYER_SIGNATURE: "Подпись покупателя",
  AWAITING_SELLER_SIGNATURE: "Подпись исполнителя",
  AWAITING_PAYMENT: "Ожидает оплаты",
  PAYMENT_REPORTED: "Чек на проверке",
  PAYMENT_REJECTED: "Чек отклонён",
  CONTACTS_RELEASED: "Контакты выданы",
  CANCELED: "Отменена",
};

const FILTERS: Array<{ value: ContactDealStatus | ""; label: string }> = [
  { value: "", label: "Все статусы" },
  { value: "PAYMENT_REPORTED", label: "Чеки на проверке" },
  { value: "PAYMENT_REJECTED", label: "Отклонённые чеки" },
  { value: "CONTACTS_RELEASED", label: "Контакты выданы" },
  { value: "AWAITING_PAYMENT", label: "Ожидают оплаты" },
];

export default function ContactDealsPage() {
  const router = useRouter();
  const [items, setItems] = useState<AdminContactDealListItem[]>([]);
  const [status, setStatus] = useState<ContactDealStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await listContactDeals(status || undefined);
        if (active) setItems(data.items);
      } catch (reason) {
        if (reason instanceof Error && reason.message === "UNAUTHORIZED") {
          router.replace("/login");
          return;
        }
        if (active) setError("Не удалось загрузить сделки");
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [router, status]);

  return (
    <div className="page wide-page">
      <header className="topbar">
        <div>
          <h1>Покупка контактов исполнителей</h1>
          <p className="muted topbar-subtitle">Чеки, электронные договоры и ручная выдача контактов</p>
        </div>
        <div className="topbar-right">
          <Link className="btn" href="/">Статьи</Link>
          <Link className="btn" href="/rtn">Ростехнадзор отвечает</Link>
        </div>
      </header>

      <div className="toolbar">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as ContactDealStatus | "")}
          className="status-filter"
        >
          {FILTERS.map((filter) => (
            <option value={filter.value} key={filter.value}>{filter.label}</option>
          ))}
        </select>
        <span className="muted count">Найдено: {items.length}</span>
      </div>

      {error && <div className="error">{error}</div>}
      {loading ? (
        <div className="muted">Загрузка…</div>
      ) : items.length === 0 ? (
        <div className="muted">Сделок с таким статусом нет.</div>
      ) : (
        <table className="grid deals-grid">
          <thead>
            <tr>
              <th>Договор</th>
              <th>Исполнитель</th>
              <th>Покупатель</th>
              <th>Сумма</th>
              <th>Статус</th>
              <th>Чеки</th>
              <th>Обновлена</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((deal) => (
              <tr key={deal.id}>
                <td>#{deal.public_id.slice(0, 8).toUpperCase()}</td>
                <td>{deal.seller_name}</td>
                <td>{deal.buyer_name}</td>
                <td>{deal.price_rubles.toLocaleString("ru-RU")} ₽</td>
                <td><span className={`badge deal-${deal.status.toLowerCase()}`}>{STATUS_LABELS[deal.status]}</span></td>
                <td>{deal.receipt_count}</td>
                <td className="muted">{new Date(deal.updated_at).toLocaleString("ru-RU")}</td>
                <td><Link href={`/contact-deals/${deal.id}`}>Открыть</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
