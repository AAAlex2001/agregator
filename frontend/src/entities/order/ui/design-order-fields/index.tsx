"use client";

import type { ChangeEvent } from "react";
import { Field } from "@/shared/ui/field";
import { FieldStack } from "@/shared/ui/field-stack";
import { MultiSelect } from "@/shared/ui/multi-select";
import { RadioGroup } from "@/shared/ui/radio-group";
import { TextArea } from "@/shared/ui/text-area";
import { TextInput } from "@/shared/ui/text-input";
import type { OrderApplicant } from "../../model/details/applicant";
import type { DesignOrderDetails } from "../../model/details/design";
import type { OrderFieldOption } from "../../model/order-field-option";
import { OrderApplicantFields } from "../order-applicant-fields";

/** Объём проектирования, определяющий выбор разделов документации. */
const SCOPE_OPTIONS = [
  {
    value: "FULL",
    label: "Полный пакет документации",
    description: "Заявку увидят исполнители всех разделов проектной документации",
  },
  {
    value: "SECTIONS",
    label: "Отдельные разделы",
    description: "Укажите нужные разделы — заявка уйдёт специалистам по этим областям",
  },
];

/** Условия проектирования и варианты документации из справочника направления. */
interface DesignOrderFieldsProps {
  value: DesignOrderDetails;
  onChange: (value: DesignOrderDetails) => void;
  categoryOptions: OrderFieldOption[];
  kindOptions: OrderFieldOption[];
  sectionOptions: OrderFieldOption[];
  approvalOptions: OrderFieldOption[];
}

/** Показывает заявителя, объект, состав документации и необходимые согласования. */
export function DesignOrderFields({
  value,
  onChange,
  categoryOptions,
  kindOptions,
  sectionOptions,
  approvalOptions,
}: DesignOrderFieldsProps) {
  /** Обновляет заявителя, сохраняя условия проектирования. */
  function changeApplicant(applicant: OrderApplicant) {
    onChange({
      ...value,
      ...applicant,
    });
  }

  /** Меняет название объекта из задания на проектирование. */
  function changeObjectName(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      object_name: event.target.value,
    });
  }

  /** Меняет город строительства объекта. */
  function changeConstructionCity(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      construction_city: event.target.value,
    });
  }

  /** Обновляет направления разрабатываемой документации. */
  function changeCategories(categories: string[]) {
    onChange({
      ...value,
      doc_categories: categories,
    });
  }

  /** Обновляет необходимые виды документации. */
  function changeKinds(kinds: string[]) {
    onChange({
      ...value,
      documentation_kinds: kinds,
    });
  }

  /** Для полного пакета убирает отдельные разделы из условий заказа. */
  function changeScope(scope: string) {
    if (scope !== "FULL" && scope !== "SECTIONS") {
      return;
    }

    onChange({
      ...value,
      scope,
      sections: scope === "FULL" ? [] : value.sections,
    });
  }

  /** Обновляет выбранные разделы проектной документации. */
  function changeSections(sections: string[]) {
    onChange({
      ...value,
      sections,
    });
  }

  /** Обновляет необходимые согласования и экспертизы. */
  function changeApprovals(approvals: string[]) {
    onChange({
      ...value,
      approvals,
    });
  }

  /** Сохраняет дополнительные согласования в свободной форме. */
  function changeOtherApprovals(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange({
      ...value,
      approvals_other: event.target.value,
    });
  }

  return (
    <FieldStack>
      <Field label="Сведения о заявителе">
        <OrderApplicantFields
          value={value}
          onChange={changeApplicant}
        />
      </Field>
      <Field label="Наименование объекта">
        <TextInput
          value={value.object_name}
          onChange={changeObjectName}
          placeholder="Как объект называется в задании на проектирование"
        />
      </Field>
      <Field label="Город строительства">
        <TextInput
          value={value.construction_city}
          onChange={changeConstructionCity}
          placeholder="Город"
        />
      </Field>
      <Field label="Направление разрабатываемой документации">
        <MultiSelect
          id="design-order-categories"
          options={categoryOptions}
          value={value.doc_categories}
          onChange={changeCategories}
        />
      </Field>
      <Field label="Вид документации">
        <MultiSelect
          id="design-order-kinds"
          options={kindOptions}
          value={value.documentation_kinds}
          onChange={changeKinds}
        />
      </Field>
      <Field label="Объём разрабатываемой документации">
        <RadioGroup
          name="design-order-scope"
          value={value.scope}
          options={SCOPE_OPTIONS}
          onChange={changeScope}
        />
      </Field>
      {value.scope === "SECTIONS" && (
        <Field label="Разделы проектной документации">
          <MultiSelect
            id="design-order-sections"
            options={sectionOptions}
            value={value.sections}
            onChange={changeSections}
          />
        </Field>
      )}
      <Field label="Каким согласованиям и экспертизам подлежит">
        <MultiSelect
          id="design-order-approvals"
          options={approvalOptions}
          value={value.approvals}
          onChange={changeApprovals}
        />
      </Field>
      <Field label="Иные согласования и экспертизы">
        <TextArea
          value={value.approvals_other}
          onChange={changeOtherApprovals}
          placeholder="Заполните в свободной форме, если нужны другие согласования"
          maxLength={2000}
        />
      </Field>
    </FieldStack>
  );
}
