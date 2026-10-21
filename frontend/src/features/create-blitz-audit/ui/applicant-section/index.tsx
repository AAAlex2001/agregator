"use client";

import type { Dispatch } from "react";
import { Checkbox } from "@/shared/ui/checkbox";
import { EmailInput } from "@/shared/ui/email-input";
import { Field } from "@/shared/ui/field";
import { FormSection } from "@/shared/ui/form-section";
import { PhoneInput } from "@/shared/ui/phone-input";
import { TextInput } from "@/shared/ui/text-input";
import { APPLICANT_FIELDS } from "../../config/options";
import type { ApplicantDraft, CreateBlitzAuditAction } from "../../model/types";
import styles from "./style.module.scss";

/** Представитель и изменения черновика. */
interface ApplicantSectionProps {
  applicant: ApplicantDraft;
  dispatch: Dispatch<CreateBlitzAuditAction>;
}

/** Кто подаёт заявку: ФИО, должность, организация, ИНН, контакты и доверенность. */
export function ApplicantSection({ applicant, dispatch }: ApplicantSectionProps) {
  return (
    <FormSection
      title="Заявитель"
      hint="Контакты нужны аудитору для согласования Плана и выезда"
    >
      <div className={styles.grid}>
        {APPLICANT_FIELDS.map((item) => (
          <Field
            key={item.field}
            label={item.label}
          >
            <TextInput
              value={applicant[item.field]}
              placeholder={item.placeholder}
              onChange={(event) => dispatch({
                type: "applicant/change",
                field: item.field,
                value: event.target.value,
              })}
            />
          </Field>
        ))}
        <Field label="Телефон">
          <PhoneInput
            value={applicant.phone}
            onChange={(event) => dispatch({
              type: "applicant/change",
              field: "phone",
              value: event.target.value,
            })}
          />
        </Field>
        <Field label="Корпоративная почта">
          <EmailInput
            value={applicant.email}
            placeholder="safety@company.ru"
            onChange={(event) => dispatch({
              type: "applicant/change",
              field: "email",
              value: event.target.value,
            })}
          />
        </Field>
      </div>
      <Checkbox
        id="blitz-audit-proxy"
        checked={applicant.by_proxy}
        onChange={(byProxy) => dispatch({ type: "applicant/proxy", byProxy })}
      >
        Действую по доверенности — приложу её в разделе «Документы»
      </Checkbox>
    </FormSection>
  );
}