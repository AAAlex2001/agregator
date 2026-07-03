import cn from "classnames";
import { tapHaptic } from "@/shared/services/telegram";
import { ChevronDownIcon } from "@/shared/ui/icons/interface";
import { FilePicker } from "@/shared/ui";
import { Tabs } from "@/shared/ui/tabs";
import { CompanySuggest } from "@/entites/party";
import type { Party, VatKind } from "../../model/api";
import { toKopecks, formatRub, formatDateRu } from "@/shared/lib/format";
import s from "./offer-step.module.scss";
import c from "./common.module.scss";

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
    <div className={c.step}>
      <div className={s.field}>
        <span className={s.fieldLab}>Срок начала выполнения работ</span>
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
      </div>
      <div className={s.field}>
        <span className={s.fieldLab}>Срок окончания выполнения работ</span>
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
      </div>

      <div className={s.field}>
        <span className={s.fieldLab}>Ваша оценка стоимости работ</span>
        <input
          className={s.control}
          inputMode="numeric"
          placeholder="Сумма в рублях"
          value={p.sum}
          onFocus={() => tapHaptic()}
          onChange={(e) => p.onChangeSum(e.target.value)}
        />
      </div>

      <div className={s.field}>
        <span className={s.fieldLab}>Ставка НДС</span>
        <Tabs
          tabs={VAT_OPTIONS.map((o) => ({ key: o.code, label: o.label }))}
          active={p.vat}
          onChange={(k) => p.onChangeVat(k as VatKind)}
        />
        {base > 0 && (
          <div className={s.breakdown}>
            <div className={s.bd}><span>Стоимость работ</span><span>{formatRub(base)}</span></div>
            {p.vat !== "NONE" && (
              <div className={s.bd}><span>НДС {rate}%</span><span>{formatRub(vatAmount)}</span></div>
            )}
            <div className={s.bdTotal}><span>Итого</span><span>{formatRub(base + vatAmount)}</span></div>
          </div>
        )}
        <span className={c.note}>
          Сумма ориентировочная. Точная стоимость согласуется с заказчиком после изучения ТЗ.
        </span>
      </div>

      {p.requiresLicense && (
        <div className={s.field}>
          <span className={s.fieldLab}>Организация для заключения договора</span>
          <CompanySuggest value={p.companyName} onChangeText={p.onCompanyText} onPick={p.onCompanyPick} />
        </div>
      )}

      <div className={s.field}>
        <span className={s.fieldLab}>Комментарий для заказчика</span>
        <textarea
          className={c.textarea}
          placeholder="Напишите комментарий для заказчика…"
          value={p.comment}
          onFocus={() => tapHaptic()}
          onChange={(e) => p.onChangeComment(e.target.value)}
        />
      </div>

      <div className={s.field}>
        <span className={s.fieldLab}>Файлы к отклику (необязательно)</span>
        <FilePicker
          files={p.files}
          onAdd={p.onAddFiles}
          onRemove={p.onRemoveFile}
          note="PDF, JPG, PNG, DOC, XLS, ZIP · до 200 МБ"
        />
      </div>
    </div>
  );
}
