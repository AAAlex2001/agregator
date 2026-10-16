import type { ChangeEvent } from "react";
import type { LeadDirection } from "@/entities/lead";
import { Select } from "@/shared/ui/select";
import { TextArea } from "@/shared/ui/text-area";
import { TextInput } from "@/shared/ui/text-input";
import type { LeadFormFields, LeadTextField } from "../../model/types";
import { LeadField } from "../lead-field";

/** Задача посетителя и варианты работ выбранного направления. */
interface TaskFieldsProps {
  fields: LeadFormFields;
  direction: LeadDirection;
  onChange: (field: LeadTextField, value: string) => void;
  onKindsChange: (workKinds: string[]) => void;
}

/** Показывает объект, сроки, виды работ, бюджет и описание задачи. */
export function TaskFields({
  fields,
  direction,
  onChange,
  onKindsChange,
}: TaskFieldsProps) {
  const workOptions = direction.kinds.map((kind) => ({
    value: kind,
    label: kind,
  }));

  /** Обновляет название или описание объекта работ. */
  function changeObjectName(event: ChangeEvent<HTMLInputElement>) {
    onChange("objectName", event.target.value);
  }

  /** Обновляет желаемый срок выполнения задачи. */
  function changeDeadline(event: ChangeEvent<HTMLInputElement>) {
    onChange("deadline", event.target.value);
  }

  /** Обновляет ориентировочный бюджет. */
  function changeBudget(event: ChangeEvent<HTMLInputElement>) {
    onChange("budget", event.target.value);
  }

  /** Обновляет свободное описание задачи. */
  function changeTask(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange("task", event.target.value);
  }

  return (
    <>
      <LeadField label="Объект">
        <TextInput
          placeholder={direction.objectPlaceholder}
          value={fields.objectName}
          onChange={changeObjectName}
        />
      </LeadField>
      <LeadField label="Желаемый срок">
        <TextInput
          placeholder="Например: до конца месяца"
          value={fields.deadline}
          onChange={changeDeadline}
        />
      </LeadField>
      <LeadField
        as="div"
        label="Что нужно сделать"
      >
        <Select
          multiple
          ariaLabel="Виды работ"
          placeholder="Выберите виды работ"
          options={workOptions}
          value={fields.workKinds}
          onChange={onKindsChange}
        />
      </LeadField>
      <LeadField label="Ориентировочный бюджет">
        <TextInput
          placeholder="Если известен"
          value={fields.budget}
          onChange={changeBudget}
        />
      </LeadField>
      <LeadField
        label="Задача *"
        wide
      >
        <TextArea
          required
          rows={3}
          placeholder={direction.taskPlaceholder}
          value={fields.task}
          onChange={changeTask}
        />
      </LeadField>
    </>
  );
}
