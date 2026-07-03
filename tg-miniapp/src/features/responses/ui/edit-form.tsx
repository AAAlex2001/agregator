import cn from "classnames";
import { Tabs } from "@/shared/ui/tabs";
import { ChevronDownIcon, CloseIcon, PlusIcon, UploadIcon } from "@/shared/ui/icons/interface";
import { FileTypeIcon } from "@/shared/ui/file-icon";
import { tapHaptic } from "@/shared/services/telegram";
import type { VatKind } from "@/entites/response";
import { formatDateRu, formatSize } from "@/shared/lib/format";
import type { useEditResponse } from "../model/useEditResponse";
import s from "./edit-form.module.scss";

const VAT_OPTIONS: { code: VatKind; label: string }[] = [
  { code: "NONE", label: "Без НДС" },
  { code: "VAT_5", label: "5%" },
  { code: "VAT_7", label: "7%" },
  { code: "VAT_22", label: "22%" },
];

interface Props {
  form: ReturnType<typeof useEditResponse>;
  onOpenDate: (which: "start" | "end") => void;
}

export function EditForm({ form, onOpenDate }: Props) {
  return (
    <>
      <div className={s.field}>
        <span className={s.fieldLab}>Срок начала выполнения работ</span>
        <button
          type="button"
          className={cn(s.control, s.dateBtn, { [s.dateEmpty]: !form.startDate })}
          onClick={() => {
            tapHaptic();
            onOpenDate("start");
          }}
        >
          {form.startDate ? formatDateRu(form.startDate) : "Выберите дату"}
          <ChevronDownIcon className={s.chev} />
        </button>
      </div>
      <div className={s.field}>
        <span className={s.fieldLab}>Срок окончания выполнения работ</span>
        <button
          type="button"
          className={cn(s.control, s.dateBtn, { [s.dateEmpty]: !form.deadline })}
          onClick={() => {
            tapHaptic();
            onOpenDate("end");
          }}
        >
          {form.deadline ? formatDateRu(form.deadline) : "Выберите дату"}
          <ChevronDownIcon className={s.chev} />
        </button>
      </div>

      <div className={s.field}>
        <span className={s.fieldLab}>Ваша оценка стоимости работ</span>
        <input
          className={s.control}
          inputMode="numeric"
          placeholder="Сумма в рублях"
          value={form.sum}
          onFocus={() => tapHaptic()}
          onChange={(e) => form.setSum(e.target.value)}
        />
      </div>

      <div className={s.field}>
        <span className={s.fieldLab}>Ставка НДС</span>
        <Tabs
          tabs={VAT_OPTIONS.map((o) => ({ key: o.code, label: o.label }))}
          active={form.vat}
          onChange={(k) => form.setVat(k as VatKind)}
        />
      </div>

      <div className={s.field}>
        <span className={s.fieldLab}>Комментарий для заказчика</span>
        <textarea
          className={s.textarea}
          placeholder="Напишите комментарий для заказчика…"
          value={form.comment}
          onFocus={() => tapHaptic()}
          onChange={(e) => form.setComment(e.target.value)}
        />
      </div>

      <div className={s.field}>
        <span className={s.fieldLab}>Файлы к отклику</span>
        <div className={s.attach}>
          <span className={s.attachIcon}>
            <UploadIcon width={20} height={20} />
          </span>
          <span className={s.attachText}>Прикрепить файлы</span>
          <PlusIcon className={s.attachPlus} width={18} height={18} />
          <input
            type="file"
            multiple
            className={s.attachInput}
            onClick={() => tapHaptic()}
            onChange={(e) => {
              form.addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
        {(form.keepFiles.length > 0 || form.newFiles.length > 0) && (
          <ul className={s.fileList}>
            {form.keepFiles.map((url) => (
              <li key={url} className={s.fileItem}>
                <FileTypeIcon name={url} className={s.fileIcon} />
                <span className={s.fileName}>{url.split("/").pop() || "файл"}</span>
                <button
                  type="button"
                  className={s.fileRemove}
                  onClick={() => {
                    tapHaptic();
                    form.removeKeepFile(url);
                  }}
                  aria-label="Удалить файл"
                >
                  <CloseIcon width={16} height={16} />
                </button>
              </li>
            ))}
            {form.newFiles.map((f, i) => (
              <li key={`${f.name}-${i}`} className={s.fileItem}>
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
                    form.removeNewFile(i);
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
    </>
  );
}
