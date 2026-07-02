import { useRef } from "react";
import { CompanySuggest } from "../company-suggest";
import type { Party, VatKind } from "../../model/api";
import { toKopecks, formatRub, formatDateRu } from "../../model/format";
import s from "../respond-sheet.module.scss";

const VAT_OPTIONS: { code: VatKind; label: string }[] = [
  { code: "NONE", label: "Без НДС" },
  { code: "VAT_5", label: "С НДС 5%" },
  { code: "VAT_7", label: "С НДС 7%" },
  { code: "VAT_22", label: "С НДС 22%" },
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
  const fileRef = useRef<HTMLInputElement>(null);
  const base = toKopecks(p.sum);
  const rate = VAT_RATE[p.vat];
  const vatAmount = Math.round((base * rate) / 100);

  return (
    <div className={s.step}>
      <div className={s.field}>
        <span className={s.fieldLab}>Срок начала выполнения работ</span>
        <button
          className={`${s.control} ${s.dateBtn} ${p.startDate ? "" : s.dateEmpty}`}
          onClick={() => p.onOpenDate("start")}
        >
          {p.startDate ? formatDateRu(p.startDate) : "Выберите дату"}<span>▾</span>
        </button>
      </div>
      <div className={s.field}>
        <span className={s.fieldLab}>Срок окончания выполнения работ</span>
        <button
          className={`${s.control} ${s.dateBtn} ${p.deadline ? "" : s.dateEmpty}`}
          onClick={() => p.onOpenDate("end")}
        >
          {p.deadline ? formatDateRu(p.deadline) : "Выберите дату"}<span>▾</span>
        </button>
      </div>

      <div className={s.field}>
        <span className={s.fieldLab}>Ваша оценка стоимости работ</span>
        <input
          className={s.control}
          inputMode="numeric"
          placeholder="Сумма в рублях"
          value={p.sum}
          onChange={(e) => p.onChangeSum(e.target.value)}
        />
      </div>

      <div className={s.field}>
        <span className={s.fieldLab}>НДС</span>
        <div className={s.vatGroup}>
          {VAT_OPTIONS.map((o) => (
            <button
              key={o.code}
              className={`${s.vat} ${p.vat === o.code ? s.vatOn : ""}`}
              onClick={() => p.onChangeVat(o.code)}
            >
              {o.label}
            </button>
          ))}
        </div>
        {base > 0 && (
          <div className={s.breakdown}>
            <div className={s.bd}><span>Стоимость работ</span><span>{formatRub(base)}</span></div>
            {p.vat !== "NONE" && (
              <div className={s.bd}><span>НДС {rate}%</span><span>{formatRub(vatAmount)}</span></div>
            )}
            <div className={s.bdTotal}><span>Итого</span><span>{formatRub(base + vatAmount)}</span></div>
          </div>
        )}
        <span className={s.note}>
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
          className={s.textarea}
          placeholder="Напишите комментарий для заказчика…"
          value={p.comment}
          onChange={(e) => p.onChangeComment(e.target.value)}
        />
      </div>

      <div className={s.field}>
        <span className={s.fieldLab}>Файлы к отклику (необязательно)</span>
        <input
          ref={fileRef}
          type="file"
          multiple
          hidden
          onChange={(e) => {
            p.onAddFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <button className={s.attach} onClick={() => fileRef.current?.click()}>+ Прикрепить файлы</button>
        {p.files.length > 0 && (
          <ul className={s.fileList}>
            {p.files.map((f, i) => (
              <li key={i} className={s.fileItem}>
                <span className={s.fileName}>{f.name}</span>
                <button className={s.fileRemove} onClick={() => p.onRemoveFile(i)} aria-label="Удалить файл">✕</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
