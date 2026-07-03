import { useState } from "react";
import cn from "classnames";
import { BottomSheet, Button } from "@/shared/ui";
import { Tabs } from "@/shared/ui/tabs";
import { CalendarPicker } from "@/shared/ui/calendar-picker";
import { ChevronDownIcon, CloseIcon, UploadIcon } from "@/shared/ui/icons/interface";
import { FileTypeIcon } from "@/shared/ui/file-icon";
import { tapHaptic } from "@/shared/services/telegram";
import { formatDateRu } from "@/shared/lib/format";
import type { ExpertResponse, VatKind } from "@/entites/response";
import { useEditResponse } from "../model/useEditResponse";
import s from "./edit-response-sheet.module.scss";

const VAT_OPTIONS: { code: VatKind; label: string }[] = [
  { code: "NONE", label: "Без НДС" },
  { code: "VAT_5", label: "5%" },
  { code: "VAT_7", label: "7%" },
  { code: "VAT_22", label: "22%" },
];

interface Props {
  response: ExpertResponse | null;
  onClose: () => void;
  onSaved: () => void;
}

export function EditResponseSheet({ response, onClose, onSaved }: Props) {
  const [calField, setCalField] = useState<"start" | "end" | null>(null);
  const form = useEditResponse(response, onSaved);

  return (
    <>
      <BottomSheet open={response !== null} full title="Редактирование отклика" onClose={onClose}>
        <div className={s.field}>
          <span className={s.lab}>Срок начала выполнения работ</span>
          <button
            type="button"
            className={cn(s.control, s.dateBtn, { [s.dateEmpty]: !form.startDate })}
            onClick={() => {
              tapHaptic();
              setCalField("start");
            }}
          >
            {form.startDate ? formatDateRu(form.startDate) : "Выберите дату"}
            <ChevronDownIcon className={s.chev} />
          </button>
        </div>

        <div className={s.field}>
          <span className={s.lab}>Срок окончания выполнения работ</span>
          <button
            type="button"
            className={cn(s.control, s.dateBtn, { [s.dateEmpty]: !form.deadline })}
            onClick={() => {
              tapHaptic();
              setCalField("end");
            }}
          >
            {form.deadline ? formatDateRu(form.deadline) : "Выберите дату"}
            <ChevronDownIcon className={s.chev} />
          </button>
        </div>

        <div className={s.field}>
          <span className={s.lab}>Ваша оценка стоимости работ</span>
          <input
            className={s.control}
            inputMode="numeric"
            placeholder="Сумма в рублях"
            value={form.sum}
            onChange={(e) => form.setSum(e.target.value)}
          />
        </div>

        <div className={s.field}>
          <span className={s.lab}>Ставка НДС</span>
          <Tabs
            tabs={VAT_OPTIONS.map((o) => ({ key: o.code, label: o.label }))}
            active={form.vat}
            onChange={(k) => form.setVat(k as VatKind)}
          />
        </div>

        <div className={s.field}>
          <span className={s.lab}>Комментарий для заказчика</span>
          <textarea
            className={s.textarea}
            placeholder="Напишите комментарий для заказчика…"
            value={form.comment}
            onChange={(e) => form.setComment(e.target.value)}
          />
        </div>

        <div className={s.field}>
          <span className={s.lab}>Файлы к отклику</span>
          <div className={s.attach}>
            <UploadIcon width={20} height={20} className={s.attachIcon} />
            <span className={s.attachText}>Прикрепить файлы</span>
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
          {form.keepFiles.map((url) => (
            <div key={url} className={s.file}>
              <FileTypeIcon name={url} className={s.fileIcon} />
              <span className={s.fileName}>{url.split("/").pop()}</span>
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
            </div>
          ))}
          {form.newFiles.map((f, i) => (
            <div key={`${f.name}-${i}`} className={s.file}>
              <FileTypeIcon name={f.name} className={s.fileIcon} />
              <span className={s.fileName}>{f.name}</span>
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
            </div>
          ))}
        </div>

        <Button className={s.save} disabled={!form.canSubmit} loading={form.busy} onClick={() => void form.submit()}>
          Сохранить
        </Button>
      </BottomSheet>

      <CalendarPicker
        open={calField !== null}
        value={calField === "start" ? form.startDate : form.deadline}
        onClose={() => setCalField(null)}
        onApply={(date) => (calField === "start" ? form.setStartDate(date) : form.setDeadline(date))}
      />
    </>
  );
}
