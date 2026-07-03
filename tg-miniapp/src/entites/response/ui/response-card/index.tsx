import { Button, Card } from "@/shared/ui";
import { CountdownRing } from "@/shared/ui/countdown-ring";
import type { ExpertResponse } from "../../model/types";
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
      <div className={s.head}>
        <span className={s.title}>{response.order_title}</span>
        <span className={s.status} style={{ color: meta.color, background: meta.bg }}>
          {meta.label}
        </span>
      </div>
      {customer && <span className={s.customer}>{customer}</span>}

      {response.status === "REVIEW" && response.order_responses_deadline && (
        <div className={s.deadline}>
          <CountdownRing deadline={response.order_responses_deadline} from={response.order_created_at || undefined} />
          <span className={s.deadlineText}>До конца приёма откликов</span>
        </div>
      )}

      <div className={s.sums}>
        <div className={s.sumCol}>
          <span className={s.sumLab}>Моё предложение</span>
          <span className={s.sumMine}>{response.proposed_sum}</span>
        </div>
        <div className={`${s.sumCol} ${s.sumColEnd}`}>
          <span className={s.sumLab}>Начальная</span>
          <span className={s.sumBase}>{response.order_sum}</span>
        </div>
      </div>

      {response.comment && <p className={s.comment}>{response.comment}</p>}

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
