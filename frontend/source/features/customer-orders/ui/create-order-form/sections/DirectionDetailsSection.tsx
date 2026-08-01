"use client";

import type { UseFormReturn } from "react-hook-form";
import Button from "@/source/shared/ui/Button";
import { Checkbox } from "@/source/shared/ui/Checkbox";
import { TextArea, TextInput } from "@/source/shared/ui/Inputs";
import {
  EXECUTOR_REQUIREMENT_HINTS,
  ORDER_DETAILS_TITLES,
  orderDetailsFields,
  type OrderDetailField,
} from "@/source/entities/order";
import { KADASTR_SRO_REGISTRY_URL } from "@/source/shared/config/externalLinks";
import type { OrderFormValues } from "../../../model/schema";
import base from "./sectionBase.module.scss";
import s from "./directionDetailsSection.module.scss";

interface Props {
  form: UseFormReturn<OrderFormValues>;
}

export function DirectionDetailsSection({ form }: Props) {
  const { watch, setValue, formState } = form;
  const workType = watch("workType");
  const details = watch("details");
  const error = formState.errors.details?.message as string | undefined;

  const set = (field: string, value: unknown) =>
    setValue(
      "details",
      { ...details, [field]: value },
      { shouldDirty: true, shouldValidate: formState.isSubmitted },
    );

  const renderField = (field: OrderDetailField) => {
    if (field.kind === "flag") {
      return (
        <Checkbox
          key={field.key}
          id={`order-details-${field.key}`}
          checked={Boolean(details[field.key])}
          onChange={(checked) => set(field.key, checked)}
        >
          {field.label}
        </Checkbox>
      );
    }

    if (field.kind === "list") {
      const items = Array.isArray(details[field.key]) ? (details[field.key] as string[]) : [""];
      return (
        <div key={field.key} className={s.field}>
          <span className={s.label}>{field.label}</span>
          <span className={s.hint}>
            Например: {EXECUTOR_REQUIREMENT_HINTS.join(", ").toLowerCase()}
          </span>
          {items.map((item, index) => (
            <div key={index} className={s.requirementRow}>
              <TextInput
                value={item}
                onChange={(event) =>
                  set(
                    field.key,
                    items.map((prev, i) => (i === index ? event.target.value : prev)),
                  )
                }
                placeholder={EXECUTOR_REQUIREMENT_HINTS[index] ?? field.placeholder}
                className={s.requirementInput}
              />
              {items.length > 1 && (
                <button
                  type="button"
                  className={s.removeRequirement}
                  aria-label="Убрать требование"
                  onClick={() => set(field.key, items.filter((_, i) => i !== index))}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="transparent"
            size="sm"
            className={s.addRequirement}
            onClick={() => set(field.key, [...items, ""])}
          >
            + Добавить поле
          </Button>
        </div>
      );
    }

    const value = String(details[field.key] ?? "");
    return (
      <label key={field.key} className={s.field}>
        <span className={s.label}>{field.label}</span>
        {field.kind === "textarea" ? (
          <TextArea
            value={value}
            onChange={(event) => set(field.key, event.target.value)}
            placeholder={field.placeholder}
            maxLength={5000}
          />
        ) : (
          <TextInput
            value={value}
            onChange={(event) => set(field.key, event.target.value)}
            placeholder={field.placeholder}
          />
        )}
        {workType === "CADASTRAL" && field.key === "work_location" && (
          <a
            className={s.registryLink}
            href={KADASTR_SRO_REGISTRY_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Проверить кадастрового инженера по реестру СРО
          </a>
        )}
      </label>
    );
  };

  return (
    <section className={base.section}>
      <span className={`${base.label} ${s.title}`}>
        {ORDER_DETAILS_TITLES[workType] ?? "Поля направления"}
      </span>

      {orderDetailsFields(workType).map(renderField)}

      {error && <span className={base.error}>{error}</span>}
    </section>
  );
}
