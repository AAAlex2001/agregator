import cn from "classnames";
import { tapHaptic } from "@/shared/services/telegram";
import { ChevronDownIcon, CloseIcon, PlusIcon, UploadIcon } from "@/shared/ui/icons/interface";
import { FileTypeIcon } from "@/shared/ui/file-icon";
import { CompanySuggest } from "../company-suggest";
import type { Party, VatKind } from "../../model/api";
import { toKopecks, formatRub, formatDateRu, formatSize } from "../../model/format";
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
          onChange={(e) => p.onChangeSum(e.target.value)}
        />
      </div>

      <div className={s.field}>
        <span className={s.fieldLab}>Ставка НДС</span>
        <div className={s.seg}>
          {VAT_OPTIONS.map((o) => (
            <button
              key={o.code}
              type="button"
              className={cn(s.segBtn, { [s.segBtnOn]: p.vat === o.code })}
              onClick={() => {
                tapHaptic();
                p.onChangeVat(o.code);
              }}
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
          onChange={(e) => p.onChangeComment(e.target.value)}
        />
      </div>

      <div className={s.field}>
        <span className={s.fieldLab}>Файлы к отклику (необязательно)</span>
        <label className={s.attach} onClick={() => tapHaptic()}>
          <input
            type="file"
            multiple
            className={s.fileInput}
            onChange={(e) => {
              p.onAddFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <span className={s.attachIcon}>
            <UploadIcon width={20} height={20} />
          </span>
          <span className={s.attachText}>Прикрепить файлы</span>
          <PlusIcon className={s.attachPlus} width={18} height={18} />
        </label>
        <span className={c.note}>PDF, JPG, PNG, DOC, XLS, ZIP · до 200 МБ</span>
        {p.files.length > 0 && (
          <ul className={s.fileList}>
            {p.files.map((f, i) => (
              <li key={i} className={s.fileItem}>
                <FileTypeIcon name={f.name} className={s.fileIcon} />
                <div className={s.fileMeta}>
                  <span className={s.fileName}>{f.name}</span>
                  <span className={s.fileSize}>{formatSize(f.size)}</span>
                </div>
                <button
                  type="button"
                  className={s.fileRemove}
                  onClick={() => {
                    tapHaptic();
                    p.onRemoveFile(i);
                  }}
                  aria-label="Удалить файл"
                >
                  <CloseIcon width={16} height={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
