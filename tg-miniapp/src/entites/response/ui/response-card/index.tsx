import { Button, Card } from "@/shared/ui";
import { CountdownBar } from "@/shared/ui/countdown-bar";
import type { ExpertResponse } from "../../model/api";
import { statusMeta, canWithdraw, canRestore } from "../../model/status";
import s from "./style.module.scss";

interface Props {
  response: ExpertResponse;
  busy: boolean;
  onWithdraw: (id: number) => void;
  onRestore: (id: number) => void;
}

export function ResponseCard({ response, busy, onWithdraw, onRestore }: Props) {
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
        <CountdownBar
          deadline={response.order_responses_deadline}
          from={response.order_created_at || undefined}
          label="До окончания приёма откликов"
        />
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

      {(canWithdraw(response.status) || canRestore(response.status)) && (
        <div className={s.actions}>
          {canWithdraw(response.status) && (
            <Button variant="outline" loading={busy} onClick={() => onWithdraw(response.id)} style={{ height: 42 }}>
              Отозвать
            </Button>
          )}
          {canRestore(response.status) && (
            <Button loading={busy} onClick={() => onRestore(response.id)} style={{ height: 42 }}>
              Восстановить
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
