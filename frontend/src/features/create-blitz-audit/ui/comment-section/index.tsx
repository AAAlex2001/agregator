"use client";

import type { Dispatch } from "react";
import { Field } from "@/shared/ui/field";
import { FormSection } from "@/shared/ui/form-section";
import { TextArea } from "@/shared/ui/text-area";
import type { CreateBlitzAuditAction } from "../../model/types";

/** Комментарий и изменения черновика. */
interface CommentSectionProps {
  comment: string;
  dispatch: Dispatch<CreateBlitzAuditAction>;
}

/** Что ещё важно знать аудитору: последний шаг перед отправкой. */
export function CommentSection({ comment, dispatch }: CommentSectionProps) {
  return (
    <FormSection
      title="Комментарий"
      hint="Необязательно. После отправки заявку увидят аудиторы платформы"
    >
      <Field label="Что ещё важно знать аудитору">
        <TextArea
          value={comment}
          rows={5}
          maxLength={4000}
          placeholder="Особенности объектов, пожелания к выезду"
          onChange={(event) => dispatch({
            type: "field/change",
            field: "comment",
            value: event.target.value,
          })}
        />
      </Field>
    </FormSection>
  );
}