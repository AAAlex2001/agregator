import { useEffect, useState } from "react";
import cn from "classnames";
import { tapHaptic } from "@/shared/services/telegram";
import { Button, FullSheet, SheetHero } from "@/shared/ui";
import { Tabs } from "@/shared/ui/tabs";
import { CalendarPicker } from "@/shared/ui/calendar-picker";
import { FileTypeIcon } from "@/shared/ui/file-icon";
import { CloseIcon, UploadIcon, PlusIcon } from "@/shared/ui/icons/interface";
import { fileName } from "@/shared/lib/files";
import { formatDateRu, formatRub, formatSize, toKopecks } from "@/shared/lib/format";
import { VAT_LABEL, type ExpertResponse, type VatKind } from "@/entites/response";
import { useEditResponse } from "../model/use-edit-response";
import s from "./edit-response-sheet.module.scss";

const TOTAL = 3;
const VAT_OPTIONS: VatKind[] = ["NONE", "VAT_5", "VAT_7", "VAT_22"];

const STEPS: Record<number, { title: string; desc: string }> = {
  1: { title: "Сроки работ", desc: "Когда начнёте и закончите" },
  2: { title: "Стоимость", desc: "Цена и ставка НДС" },
  3: { title: "Комментарий и файлы", desc: "Пояснения и вложения" },
};

interface Props {
  response: ExpertResponse | null;
  onClose: () => void;
  onSaved: () => void;
}

export function EditResponseSheet({ response, onClose, onSaved }: Props) {
  const [step, setStep] = useState(1);
  const [calField, setCalField] = useState<"start" | "end" | null>(null);
  const { state, canSubmit, submit, dispatch } = useEditResponse(response, onSaved);

  useEffect(() => {
    if (response) setStep(1);
  }, [response]);

  const close = () => {
    tapHaptic();
    onClose();
  };

  const meta = STEPS[step];
  const base = toKopecks(state.sum);

  const footer = (
    <>
      {step > 1 && (
        <Button variant="outline" onClick={() => setStep(step - 1)}>
          Назад
        </Button>
      )}
      {step < TOTAL ? (
        <Button onClick={() => setStep(step + 1)}>Далее</Button>
      ) : (
        <Button disabled={!canSubmit} loading={state.busy} onClick={() => void submit()}>
          Сохранить
        </Button>
      )}
    </>
  );

  return (
    <FullSheet
      open={response !== null}
      onClose={close}
      scrollKey={step}
      hero={
        <SheetHero
          light="/respond-order/step-5-light.webp"
          dark="/respond-order/step-5-dark.webp"
          label={`Шаг ${step} из ${TOTAL}`}
          title={meta.title}
          desc={meta.desc}
          step={step}
          total={TOTAL}
          onClose={close}
        />
      }
      footer={footer}
    >
      {response && (
        <div className={s.body}>
          {step === 1 && (
            <>
              <div className={s.field}>
                <span className={s.lab}>Срок начала выполнения работ</span>
                <button
                  type="button"
                  className={cn(s.control, { [s.empty]: !state.startDate })}
                  onClick={() => {
                    tapHaptic();
                    setCalField("start");
                  }}
                >
                  {state.startDate ? formatDateRu(state.startDate) : "Выберите дату"}
                </button>
              </div>
              <div className={s.field}>
                <span className={s.lab}>Срок окончания выполнения работ</span>
                <button
                  type="button"
                  className={cn(s.control, { [s.empty]: !state.deadline })}
                  onClick={() => {
                    tapHaptic();
                    setCalField("end");
                  }}
                >
                  {state.deadline ? formatDateRu(state.deadline) : "Выберите дату"}
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className={s.field}>
                <span className={s.lab}>Оценка стоимости работ</span>
                <input
                  className={s.control}
                  inputMode="numeric"
                  placeholder="Сумма в рублях"
                  value={state.sum}
                  onFocus={() => tapHaptic()}
                  onChange={(e) => dispatch({ type: "sum", value: e.target.value })}
                />
              </div>
              <div className={s.field}>
                <span className={s.lab}>Ставка НДС</span>
                <Tabs
                  tabs={VAT_OPTIONS.map((code) => ({ key: code, label: VAT_LABEL[code] }))}
                  active={state.vat}
                  onChange={(key) => dispatch({ type: "vat", value: key as VatKind })}
                />
                {base > 0 && <span className={s.total}>Итого: {formatRub(base)}</span>}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className={s.field}>
                <span className={s.lab}>Комментарий для заказчика</span>
                <textarea
                  className={s.textarea}
                  placeholder="Напишите комментарий для заказчика…"
                  value={state.comment}
                  onFocus={() => tapHaptic()}
                  onChange={(e) => dispatch({ type: "comment", value: e.target.value })}
                />
              </div>
              <div className={s.field}>
                <span className={s.lab}>Файлы к отклику</span>
                <label className={s.attach}>
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
                      dispatch({ type: "addFiles", files: e.target.files ? Array.from(e.target.files) : [] });
                      e.target.value = "";
                    }}
                  />
                </label>

                {(state.keepFiles.length > 0 || state.newFiles.length > 0) && (
                  <ul className={s.fileList}>
                    {state.keepFiles.map((url) => (
                      <li key={url} className={s.fileItem}>
                        <FileTypeIcon name={url} className={s.fileIcon} />
                        <span className={s.fileName}>{fileName(url)}</span>
                        <button
                          type="button"
                          className={s.fileRemove}
                          onClick={() => {
                            tapHaptic();
                            dispatch({ type: "removeKeep", url });
                          }}
                          aria-label="Удалить файл"
                        >
                          <CloseIcon width={16} height={16} />
                        </button>
                      </li>
                    ))}
                    {state.newFiles.map((file, i) => (
                      <li key={`new-${i}`} className={s.fileItem}>
                        <FileTypeIcon name={file.name} className={s.fileIcon} />
                        <div className={s.fileMeta}>
                          <span className={s.fileName}>{file.name}</span>
                          <span className={s.fileSize}>{formatSize(file.size)}</span>
                        </div>
                        <button
                          type="button"
                          className={s.fileRemove}
                          onClick={() => {
                            tapHaptic();
                            dispatch({ type: "removeNew", index: i });
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
          )}

          <CalendarPicker
            open={calField !== null}
            value={calField === "start" ? state.startDate : state.deadline}
            onClose={() => setCalField(null)}
            onApply={(date) =>
              dispatch(calField === "start" ? { type: "startDate", value: date } : { type: "deadline", value: date })
            }
          />
        </div>
      )}
    </FullSheet>
  );
}
