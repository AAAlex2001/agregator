import { Field, InfoRow } from "@/shared/ui";
import { formatDateRu, formatMoscowDateTime } from "@/shared/lib/format";
import { type StepProps } from "./types";
import { getOrderWorkLabel } from "@/entites/order";
import s from "./confirm-step.module.scss";

interface Props extends StepProps {
  badgeCodes: string[];
  company: string;
  filesCount: number;
}

export function ConfirmStep({ state, badgeCodes, company, filesCount }: Props) {
  const requirements = [state.requiresExpert ? "эксперт" : "", state.requiresLicense ? "лицензия" : ""]
    .filter(Boolean)
    .join(" и ");

  return (
    <>
      <Field label="Заказ">
        <div className={s.block}>
          <InfoRow label="Название" value={state.title.trim()} />
          {company && <InfoRow label="Компания" value={company} />}
          <InfoRow label="Начальная цена" value={state.sum ? `${state.sum} ₽` : "Не определено"} accent />
        </div>
      </Field>

      <Field label="Сроки">
        <div className={s.block}>
          <InfoRow label="Начало работ" value={formatDateRu(state.startDate)} />
          <InfoRow label="Окончание" value={formatDateRu(state.deadline)} />
          {state.responsesDeadline && (
            <InfoRow label="Приём откликов до (МСК)" value={formatMoscowDateTime(state.responsesDeadline)} />
          )}
        </div>
      </Field>

      <Field label="Требования">
        <div className={s.block}>
          <InfoRow label="Вид работ" value={getOrderWorkLabel(state.workType)} />
          <InfoRow label="Требуется" value={requirements} />
          {filesCount > 0 && <InfoRow label="Документы" value={`${filesCount} файл(ов)`} />}
        </div>
      </Field>

      {badgeCodes.length > 0 && (
        <Field label="Области аттестации">
          <div className={s.codes}>
            {badgeCodes.map((code) => (
              <span key={code} className={s.code}>
                {code}
              </span>
            ))}
          </div>
        </Field>
      )}

      {state.comment.trim() && (
        <Field label="Комментарий">
          <div className={s.commentBlock}>
            <p className={s.comment}>{state.comment.trim()}</p>
          </div>
        </Field>
      )}
    </>
  );
}
