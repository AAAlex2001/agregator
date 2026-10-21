"use client";

import type { BlitzCatalog, BlitzDeadline } from "@/entities/blitz-order";
import { BLITZ_CATEGORIES, BLITZ_HAZARD_CLASSES } from "@/entities/blitz-order";
import { Field } from "@/shared/ui/field";
import { FormSection } from "@/shared/ui/form-section";
import { Select } from "@/shared/ui/select";
import { Tabs } from "@/shared/ui/tabs";
import { TextInput } from "@/shared/ui/text-input";
import {
  DEADLINE_TABS,
  DEADLINES,
  REQUIREMENT_TABS,
  REQUIREMENTS,
  UNKNOWN_OPTION,
} from "../../config/options";
import type { CreateBlitzOrderState, ExpertRequirement, OrderTextField } from "../../model/types";
import styles from "./style.module.scss";

/** Черновик, справочник и изменения полей «что проверить». */
interface SubjectSectionProps {
  state: CreateBlitzOrderState;
  catalog: BlitzCatalog;
  onObjectChange: (code: string) => void;
  onAreaChange: (code: string) => void;
  onRequirementChange: (requirement: ExpertRequirement) => void;
  onFieldChange: (field: OrderTextField, value: string) => void;
  onDeadlineChange: (deadline: BlitzDeadline) => void;
}

/** Требование к эксперту из вкладки. */
function toRequirement(id: string): ExpertRequirement {
  return REQUIREMENTS.find((item) => item === id) ?? "unknown";
}

/** Срок из вкладки. */
function toDeadline(id: string): BlitzDeadline {
  return DEADLINES.find((item) => item === id) ?? "any";
}

/** Что проверить: объект, область, требования к эксперту, вид договора, документация и срок. */
export function SubjectSection({
  state,
  catalog,
  onObjectChange,
  onAreaChange,
  onRequirementChange,
  onFieldChange,
  onDeadlineChange,
}: SubjectSectionProps) {
  const object = catalog.objects.find((item) => item.code === state.objectCode);
  const areas = catalog.areas.filter(
    (area) => !state.objectCode || area.objects.includes(state.objectCode),
  );
  const kinds = catalog.kinds.filter((kind) => object?.kinds.includes(kind.code));

  return (
    <FormSection title="Что проверить">
      <Field
        label="Наименование документации"
        hint="Как в проекте: оно попадёт в договор и заключение"
      >
        <TextInput
          value={state.objectName}
          maxLength={500}
          placeholder="Проект консервации котельной №2"
          onChange={(event) => onFieldChange("objectName", event.target.value)}
        />
      </Field>
      <div className={styles.grid}>
        <Field
          label="Объект экспертизы"
          hint={object?.description}
        >
          <Select
            ariaLabel="Объект экспертизы"
            options={[
              UNKNOWN_OPTION,
              ...catalog.objects.map((item) => ({
                value: item.code,
                label: `${item.code} — ${item.title}`,
              })),
            ]}
            value={state.objectCode}
            onChange={onObjectChange}
          />
        </Field>
        <Field label="Область аттестации">
          <Select
            ariaLabel="Область аттестации"
            options={[
              UNKNOWN_OPTION,
              ...areas.map((area) => ({
                value: area.code,
                label: `${area.code} — ${area.title}`,
              })),
            ]}
            value={state.areaCode}
            onChange={onAreaChange}
          />
        </Field>
      </div>
      {kinds.length > 1 && (
        <Field
          label="Вид договора"
          hint="Если не знаете, выберет эксперт"
        >
          <Select
            ariaLabel="Вид договора"
            options={[
              UNKNOWN_OPTION,
              ...kinds.map((kind) => ({ value: kind.code, label: kind.title })),
            ]}
            value={state.contractKind}
            onChange={(value) => onFieldChange("contractKind", value)}
          />
        </Field>
      )}
      <Field
        label="Требования к эксперту"
        hint="По классу опасности ОПО подберём нужную категорию"
      >
        <Tabs
          tabs={REQUIREMENT_TABS}
          activeTab={state.requirement}
          onTabChange={(id) => onRequirementChange(toRequirement(id))}
        />
        {state.requirement === "class" && (
          <Select
            ariaLabel="Класс опасности"
            placeholder="Выберите класс"
            options={BLITZ_HAZARD_CLASSES}
            value={state.hazardClass}
            onChange={(value) => onFieldChange("hazardClass", value)}
          />
        )}
        {state.requirement === "category" && (
          <Select
            ariaLabel="Категория эксперта"
            placeholder="Выберите категорию"
            options={BLITZ_CATEGORIES}
            value={state.category}
            onChange={(value) => onFieldChange("category", value)}
          />
        )}
      </Field>
      <Field label="Срок">
        <Tabs
          tabs={DEADLINE_TABS}
          activeTab={state.deadline}
          onTabChange={(id) => onDeadlineChange(toDeadline(id))}
        />
      </Field>
    </FormSection>
  );
}
