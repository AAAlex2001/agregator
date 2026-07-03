import { Button, Card } from "@/shared/ui";
import { CountdownBar } from "@/shared/ui/countdown-bar";
import { VAT_LABEL, type ExpertResponse } from "../../model/api";
import { statusMeta, canEdit, canWithdraw, canRestore } from "../../model/status";
import s from "./style.module.scss";

interface Props {
  response: ExpertResponse;
  busy: boolean;
  onEdit: (response: ExpertResponse) => void;
  onWithdraw: (id: number) => void;
  onRestore: (id: number) => void;
}

export function ResponseCard({ response, busy, onEdit, onWithdraw, onRestore }: Props) {
  const meta = statusMeta(response.status);
  const customer = response.customer_company || response.customer_name;
  const period = [response.proposed_start_date, response.proposed_deadline].filter(Boolean).join(" — ");
  const hasActions = canEdit(response.status) || canWithdraw(response.status) || canRestore(response.status);

  return (
    <Card className={s.card}>
      <div className={s.head}>
        <span className={s.date}>Отклик от {response.date}</span>
        <span className={s.status} style={{ color: meta.color, background: meta.bg }}>
          {meta.label}
        </span>
      </div>

      <span className={s.title}>{response.order_title}</span>
      {customer && <span className={s.customer}>{customer}</span>}

      {response.status === "REVIEW" && response.order_responses_deadline && (
        <CountdownBar
          deadline={response.order_responses_deadline}
          from={response.order_created_at || undefined}
          label="До окончания приёма откликов"
        />
      )}

      <div className={s.info}>
        <div className={s.row}>
          <span className={s.lab}>Моё предложение</span>
          <span className={s.mine}>
            {response.proposed_sum} · {VAT_LABEL[response.vat_kind]}
          </span>
        </div>
        <div className={s.row}>
          <span className={s.lab}>Начальная цена</span>
          <span className={s.val}>{response.order_sum || "—"}</span>
        </div>
        {period && (
          <div className={s.row}>
            <span className={s.lab}>Сроки работ</span>
            <span className={s.val}>{period}</span>
          </div>
        )}
      </div>

      {response.comment && (
        <div className={s.commentBlock}>
          <span className={s.commentLab}>Комментарий</span>
          <p className={s.comment}>{response.comment}</p>
        </div>
      )}

      {hasActions && (
        <div className={s.actions}>
          {canEdit(response.status) && (
            <Button loading={busy} onClick={() => onEdit(response)} className={s.actionBtn}>
              Редактировать
            </Button>
          )}
          {canWithdraw(response.status) && (
            <Button variant="outline" loading={busy} onClick={() => onWithdraw(response.id)} className={s.actionBtn}>
              Отозвать
            </Button>
          )}
          {canRestore(response.status) && (
            <Button loading={busy} onClick={() => onRestore(response.id)} className={s.actionBtn}>
              Восстановить
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
