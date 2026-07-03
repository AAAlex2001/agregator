import { Button, Card, Field, InfoRow } from "@/shared/ui";
import { CountdownRing } from "@/shared/ui/countdown-ring";
import { VAT_LABEL, type ExpertResponse } from "../../model/types";
import { statusMeta, canWithdraw, canRestore, canEdit } from "../../model/status";
import s from "./style.module.scss";

interface Props {
  response: ExpertResponse;
  busy: boolean;
  onWithdraw: (id: number) => void;
  onRestore: (id: number) => void;
  onEdit: (response: ExpertResponse) => void;
}

export function ResponseCard({ response, busy, onWithdraw, onRestore, onEdit }: Props) {
  const meta = statusMeta(response.status);
  const customer = response.customer_company || response.customer_name;

  return (
    <Card className={s.card}>
      <div className={s.header}>
        <span className={s.date}>Отклик от {response.date}</span>
        <span className={s.status} style={{ color: meta.color, background: meta.bg }}>
          {meta.label}
        </span>
      </div>

      <span className={s.title}>{response.order_title}</span>
      {customer && <span className={s.customer}>{customer}</span>}

      {response.status === "REVIEW" && response.order_responses_deadline && (
        <div className={s.deadline}>
          <span className={s.deadlineText}>До конца приёма откликов</span>
          <CountdownRing deadline={response.order_responses_deadline} from={response.order_created_at || undefined} />
        </div>
      )}

      <div className={s.info}>
        <InfoRow label="Моё предложение" value={`${response.proposed_sum} · ${VAT_LABEL[response.vat_kind]}`} accent />
        <InfoRow label="Начальная цена" value={response.order_sum} />
        <InfoRow label="Сроки работ" value={`до ${response.proposed_deadline}`} />
      </div>

      {response.comment && (
        <Field label="Ваш комментарий">
          <div className={s.commentBlock}>
            <p className={s.comment}>{response.comment}</p>
          </div>
        </Field>
      )}

      {(canEdit(response.status) || canWithdraw(response.status) || canRestore(response.status)) && (
        <div className={s.actions}>
          {canEdit(response.status) && (
            <Button className={s.actionBtn} loading={busy} onClick={() => onEdit(response)}>
              Редактировать
            </Button>
          )}
          {canWithdraw(response.status) && (
            <Button className={s.actionBtn} variant="outline" loading={busy} onClick={() => onWithdraw(response.id)}>
              Отозвать
            </Button>
          )}
          {canRestore(response.status) && (
            <Button className={s.actionBtn} loading={busy} onClick={() => onRestore(response.id)}>
              Восстановить
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
