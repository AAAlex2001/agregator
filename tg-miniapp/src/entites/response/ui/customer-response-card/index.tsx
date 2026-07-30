import { Button, Card, InfoRow } from "@/shared/ui";
import { ExpertIcon } from "@/shared/ui/icons/expert";
import { ReviewStarIcon } from "@/shared/ui/icons/interface";
import { pluralRu } from "@/shared/lib/format";
import { VAT_LABEL, type ExpertResponse } from "../../model/types";
import {
  statusMeta,
  customerCanAccept,
  customerCanHire,
  customerCanReject,
  customerCanComplete,
  customerCanReturn,
  customerCanDeleteRejected,
  customerCanChat,
} from "../../model/status";
import s from "./style.module.scss";

interface Props {
  response: ExpertResponse;
  busy: boolean;
  onAccept: (response: ExpertResponse) => void;
  onHire: (id: number) => void;
  onReject: (response: ExpertResponse) => void;
  onComplete: (id: number) => void;
  onReturn: (id: number) => void;
  onDeleteRejected: (id: number) => void;
  onChat: (response: ExpertResponse) => void;
}

export function CustomerResponseCard({
  response,
  busy,
  onAccept,
  onHire,
  onReject,
  onComplete,
  onReturn,
  onDeleteRejected,
  onChat,
}: Props) {
  const meta = statusMeta(response.status);

  return (
    <Card className={s.card}>
      <div className={s.header}>
        <span className={s.date}>Отклик от {response.date}</span>
        <span className={s.status} style={{ color: meta.color, background: meta.bg }}>
          {meta.label}
        </span>
      </div>

      <div className={s.expert}>
        <span className={s.avatar}>
          <ExpertIcon size={22} />
        </span>
        <div className={s.identity}>
          <span className={s.name}>{response.expert_name}</span>
          {response.expert_rating !== null && (
            <span className={s.rating}>
              <ReviewStarIcon active width={14} height={14} /> {response.expert_rating.toFixed(1)} ·{" "}
              {response.expert_review_count} {pluralRu(response.expert_review_count, "отзыв", "отзыва", "отзывов")}
            </span>
          )}
        </div>
      </div>

      <span className={s.title}>{response.order_title}</span>

      <div className={s.info}>
        <InfoRow label="Предложение" value={`${response.proposed_sum} · ${VAT_LABEL[response.vat_kind]}`} accent />
        <InfoRow label="Начальная цена" value={response.order_sum} />
        <InfoRow label="Сроки работ" value={`до ${response.proposed_deadline}`} />
      </div>

      <div className={s.actions}>
        {customerCanAccept(response.status) && (
          <Button className={s.actionBtn} variant="outline" loading={busy} onClick={() => onAccept(response)}>
            Пригласить в чат
          </Button>
        )}
        {customerCanHire(response.status) && (
          <Button className={s.actionBtn} loading={busy} onClick={() => onHire(response.id)}>
            Выбрать исполнителем
          </Button>
        )}
        {customerCanChat(response.status) && (
          <Button className={s.actionBtn} variant="outline" loading={busy} onClick={() => onChat(response)}>
            {response.status === "IN_PROGRESS" ? "Чат с исполнителем" : "Перейти в чат"}
          </Button>
        )}
        {customerCanComplete(response.status) && (
          <Button className={s.actionBtn} loading={busy} onClick={() => onComplete(response.id)}>
            Завершить проект
          </Button>
        )}
        {customerCanReject(response.status) && (
          <Button className={s.actionBtn} variant="danger" loading={busy} onClick={() => onReject(response)}>
            Отклонить
          </Button>
        )}
        {customerCanReturn(response.status) && !response.order_locked && (
          <Button className={s.actionBtn} variant="outline" loading={busy} onClick={() => onReturn(response.id)}>
            Вернуть на рассмотрение
          </Button>
        )}
        {customerCanDeleteRejected(response.status) && (
          <Button className={s.actionBtn} variant="danger" loading={busy} onClick={() => onDeleteRejected(response.id)}>
            Удалить
          </Button>
        )}
      </div>
    </Card>
  );
}
