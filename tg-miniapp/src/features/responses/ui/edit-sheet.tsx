import { useState } from "react";
import { Button, FullSheet, SheetHero } from "@/shared/ui";
import { CalendarPicker } from "@/shared/ui/calendar-picker";
import { tapHaptic } from "@/shared/services/telegram";
import type { ExpertResponse } from "@/entites/response";
import { useEditResponse } from "../model/useEditResponse";
import { EditForm } from "./edit-form";

interface Props {
  response: ExpertResponse | null;
  onClose: () => void;
  onSaved: () => void;
}

export function EditResponseSheet({ response, onClose, onSaved }: Props) {
  const open = response !== null;
  const [calField, setCalField] = useState<"start" | "end" | null>(null);
  const form = useEditResponse(response, onSaved);

  const close = () => {
    tapHaptic();
    onClose();
  };

  return (
    <FullSheet
      open={open}
      onClose={close}
      hero={
        <SheetHero
          light="/respond-order/step-5-light.webp"
          dark="/respond-order/step-5-dark.webp"
          label="Редактирование"
          title="Ваше предложение"
          desc="Обновите условия отклика"
          onClose={close}
        />
      }
      footer={
        <>
          <Button variant="outline" onClick={close}>Отмена</Button>
          <Button disabled={!form.canSubmit} loading={form.busy} onClick={() => void form.submit()}>
            Сохранить
          </Button>
        </>
      }
    >
      {response && (
        <>
          <EditForm form={form} onOpenDate={setCalField} />
          <CalendarPicker
            open={calField !== null}
            value={calField === "start" ? form.startDate : form.deadline}
            onClose={() => setCalField(null)}
            onApply={(date) => (calField === "start" ? form.setStartDate(date) : form.setDeadline(date))}
          />
        </>
      )}
    </FullSheet>
  );
}
