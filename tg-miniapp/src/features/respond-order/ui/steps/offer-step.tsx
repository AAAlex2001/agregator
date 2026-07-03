import cn from "classnames";
import { tapHaptic } from "@/shared/services/telegram";
import { ChevronDownIcon } from "@/shared/ui/icons/interface";
import { Field, FilePicker, TextArea, TextField } from "@/shared/ui";
import { Tabs } from "@/shared/ui/tabs";
import { CompanySuggest } from "@/entites/party";
import type { Party, VatKind } from "../../model/api";
import { toKopecks, formatRub, formatDateRu } from "@/shared/lib/format";
import s from "./offer-step.module.scss";

const VAT_OPTIONS: { code: VatKind; label: string }[] = [
  { code: "NONE", label: "Без НДС" },
  { code: "VAT_5", label: "5%" },
  { code: "VAT_7", label: "7%" },
  { code: "VAT_22", label: "22%" },
];
const VAT_RATE: Record<VatKind, number> = { NONE: 0, VAT_5: 5, VAT_7: 7, VAT_22: 22 };

interface Props {
  requiresLicense: boolean;
  startDate: string;
  deadline: string;
  sum: string;
  vat: VatKind;
  comment: string;
  companyName: string;
  files: File[];
  onOpenDate: (which: "start" | "end") => void;
  onChangeSum: (value: string) => void;
  onChangeVat: (value: VatKind) => void;
  onChangeComment: (value: string) => void;
  onCompanyText: (value: string) => void;
  onCompanyPick: (party: Party) => void;
  onAddFiles: (list: FileList | null) => void;
  onRemoveFile: (index: number) => void;
}

export function OfferStep(p: Props) {
  const base = toKopecks(p.sum);
  const rate = VAT_RATE[p.vat];
  const vatAmount = Math.round((base * rate) / 100);

  return (
    <>
      <Field label="Срок начала выполнения работ">
        <button
          type="button"
          className={cn(s.control, s.dateBtn, { [s.dateEmpty]: !p.startDate })}
          onClick={() => {
            tapHaptic();
            p.onOpenDate("start");
          }}
        >
          {p.startDate ? formatDateRu(p.startDate) : "Выберите дату"}
          <ChevronDownIcon className={s.chev} />
        </button>
      </Field>

      <Field label="Срок окончания выполнения работ">
        <button
          type="button"
          className={cn(s.control, s.dateBtn, { [s.dateEmpty]: !p.deadline })}
          onClick={() => {
            tapHaptic();
            p.onOpenDate("end");
          }}
        >
          {p.deadline ? formatDateRu(p.deadline) : "Выберите дату"}
          <ChevronDownIcon className={s.chev} />
        </button>
      </Field>

      <Field label="Ваша оценка стоимости работ">
        <TextField
          inputMode="numeric"
          placeholder="Сумма в рублях"
          value={p.sum}
          onFocus={() => tapHaptic()}
          onChange={(e) => p.onChangeSum(e.target.value)}
        />
      </Field>

      <Field
        label="Ставка НДС"
        hint="Сумма ориентировочная. Точная стоимость согласуется с заказчиком после изучения ТЗ."
      >
        <Tabs
          tabs={VAT_OPTIONS.map((o) => ({ key: o.code, label: o.label }))}
          active={p.vat}
          onChange={(k) => p.onChangeVat(k as VatKind)}
        />
        {base > 0 && (
          <div className={s.breakdown}>
            <div className={s.bd}>
              <span>Стоимость работ</span>
              <span>{formatRub(base)}</span>
            </div>
            {p.vat !== "NONE" && (
              <div className={s.bd}>
                <span>НДС {rate}%</span>
                <span>{formatRub(vatAmount)}</span>
              </div>
            )}
            <div className={s.bdTotal}>
              <span>Итого</span>
              <span>{formatRub(base + vatAmount)}</span>
            </div>
          </div>
        )}
      </Field>

      {p.requiresLicense && (
        <Field label="Организация для заключения договора">
          <CompanySuggest value={p.companyName} onChangeText={p.onCompanyText} onPick={p.onCompanyPick} />
        </Field>
      )}

      <Field label="Комментарий для заказчика">
        <TextArea
          placeholder="Напишите комментарий для заказчика…"
          value={p.comment}
          onFocus={() => tapHaptic()}
          onChange={(e) => p.onChangeComment(e.target.value)}
        />
      </Field>

      <Field label="Файлы к отклику (необязательно)">
        <FilePicker
          files={p.files}
          onAdd={p.onAddFiles}
          onRemove={p.onRemoveFile}
          note="PDF, JPG, PNG, DOC, XLS, ZIP · до 200 МБ"
        />
      </Field>
    </>
  );
}
