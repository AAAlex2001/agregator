"use client";

import { useId } from "react";
import type { ChangeEvent } from "react";
import { Field } from "@/shared/ui/field";
import { FieldStack } from "@/shared/ui/field-stack";
import { TextArea } from "@/shared/ui/text-area";
import type { LaboratoryProfileValues } from "../../model/types";

/** Поля лаборатории, общие для регистрации и настройки анкеты. */
interface LaboratoryProfileFieldsProps {
  value: LaboratoryProfileValues;
  disabled?: boolean;
  onChange: (value: LaboratoryProfileValues) => void;
}

/** Область аккредитации и дополнительные сведения о лаборатории. */
export function LaboratoryProfileFields({
  value,
  disabled = false,
  onChange,
}: LaboratoryProfileFieldsProps) {
  const accreditationId = useId();
  const commentId = useId();

  /** Передаёт область аккредитации в черновик анкеты. */
  function changeAccreditation(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange({
      ...value,
      accreditation_area: event.target.value,
    });
  }

  /** Передаёт дополнительные сведения в черновик анкеты. */
  function changeComment(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange({
      ...value,
      comment: event.target.value,
    });
  }

  return (
    <FieldStack>
      <Field
        label="Область аккредитации лаборатории"
        htmlFor={accreditationId}
      >
        <TextArea
          id={accreditationId}
          value={value.accreditation_area}
          disabled={disabled}
          onChange={changeAccreditation}
          placeholder="Виды исследований и испытаний из области аккредитации"
          maxLength={5000}
        />
      </Field>

      <Field
        label="Комментарий"
        htmlFor={commentId}
      >
        <TextArea
          id={commentId}
          value={value.comment}
          disabled={disabled}
          onChange={changeComment}
          placeholder="Дополнительные сведения о лаборатории"
          maxLength={5000}
        />
      </Field>
    </FieldStack>
  );
}
