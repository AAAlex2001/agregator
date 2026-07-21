"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  adminReceiptUrl,
  loadContactDeal,
  releaseContactDeal,
  type AdminContactDealDetail,
} from "@/entities/contact-deal";

export default function ContactDealPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = Number(params.id);
  const [deal, setDeal] = useState<AdminContactDealDetail | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await loadContactDeal(id);
        if (active) setDeal(data);
      } catch (reason) {
        if (reason instanceof Error && reason.message === "UNAUTHORIZED") {
          router.replace("/login");
          return;
        }
        if (active) setError("Не удалось загрузить сделку");
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [id, router]);

  const release = async () => {
    if (note.trim().length < 3) return;
    setBusy(true);
    setError("");
    try {
      setDeal(await releaseContactDeal(id, note.trim()));
      setNote("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Не удалось выдать контакты");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="page"><div className="muted">Загрузка…</div></div>;
  if (!deal) return <div className="page"><div className="error">{error || "Сделка не найдена"}</div></div>;

  return (
    <div className="page deal-page">
      <header className="topbar">
        <div>
          <Link href="/contact-deals">← Все сделки</Link>
          <h1>{deal.contract.title} № {deal.contract.number}</h1>
        </div>
        <span className="badge">{deal.status}</span>
      </header>

      {error && <div className="error">{error}</div>}

      <section className="deal-summary">
        <div><span>Эксперт</span><strong>{deal.seller_name}</strong></div>
        <div><span>Покупатель</span><strong>{deal.buyer_name}</strong></div>
        <div><span>Сумма</span><strong>{deal.price_rubles.toLocaleString("ru-RU")} ₽</strong></div>
        <div><span>SHA-256</span><code>{deal.contract_hash}</code></div>
      </section>

      <section className="admin-section">
        <h2>Договор</h2>
        <p>{deal.contract.preamble}</p>
        <ol>{deal.contract.clauses.map((clause, index) => <li key={index}>{clause}</li>)}</ol>
      </section>

      <section className="admin-section">
        <h2>Подписи</h2>
        {deal.signatures.length === 0 ? <p className="muted">Подписей пока нет.</p> : (
          <table className="grid compact-grid">
            <thead><tr><th>Сторона</th><th>Подписант</th><th>Способ</th><th>Дата</th></tr></thead>
            <tbody>{deal.signatures.map((signature) => (
              <tr key={signature.party}>
                <td>{signature.party}</td>
                <td>{signature.signer_name}</td>
                <td>{signature.method}</td>
                <td>{new Date(signature.signed_at).toLocaleString("ru-RU")}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </section>

      <section className="admin-section">
        <h2>Чеки</h2>
        {deal.receipts.length === 0 ? <p className="muted">Чек ещё не загружен.</p> : (
          <div className="receipt-list">
            {deal.receipts.map((receipt) => (
              <div className="receipt-row" key={receipt.id}>
                <div><strong>{receipt.original_name}</strong><span>{receipt.status} · {(receipt.size_bytes / 1024).toFixed(0)} КБ</span></div>
                <code>{receipt.sha256}</code>
                <a className="btn" href={adminReceiptUrl(deal.id, receipt.id)} target="_blank" rel="noreferrer">Открыть чек</a>
              </div>
            ))}
          </div>
        )}
      </section>

      {deal.status !== "CONTACTS_RELEASED" ? (
        <section className="admin-section release-section">
          <h2>Ручная выдача контактов</h2>
          <p className="muted">Администратор может выдать контакты при наличии чека, не дожидаясь подтверждения эксперта.</p>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Основание решения администратора"
            maxLength={2000}
          />
          <button className="primary" onClick={() => void release()} disabled={busy || note.trim().length < 3}>
            {busy ? "Выдаём…" : "Выдать контакты покупателю"}
          </button>
        </section>
      ) : (
        <section className="admin-section released-section">
          <h2>Контакты выданы</h2>
          <p>{deal.seller_contacts?.phone || "Телефон не указан"}</p>
          <p>{deal.seller_contacts?.email || "Email не указан"}</p>
          <p className="muted">{deal.release_note}</p>
        </section>
      )}
    </div>
  );
}
