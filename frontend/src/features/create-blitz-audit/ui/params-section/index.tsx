"use client";

import type { Dispatch } from "react";
import type { BlitzAuditCatalog } from "@/entities/blitz-order";
import { Field } from "@/shared/ui/field";
import { FormSection } from "@/shared/ui/form-section";
import { Select } from "@/shared/ui/select";
import { TextInput } from "@/shared/ui/text-input";
import { YesNoField } from "@/shared/ui/yes-no-field";
import { AUDIT_KINDS, AUDIT_STAGES } from "../../config/options";
import { pickMany, pickOne, toOptions } from "../../model/options";
import { asksSto } from "../../model/payload";
import type { CreateBlitzAuditAction, CreateBlitzAuditState } from "../../model/types";

/** Черновик, справочник и изменения. */
interface ParamsSectionProps {
  state: CreateBlitzAuditState;
  catalog: BlitzAuditCatalog;
  dispatch: Dispatch<CreateBlitzAuditAction>;
}

/** Что входит в аудит: этапы, тип, СТО организации или элементы для выборочного. */
export function ParamsSection({ state, catalog, dispatch }: ParamsSectionProps) {
  return (
    <FormSection
      title="Параметры аудита"
      hint="Если не знаете тип аудита, выберите консультацию — менеджер поможет определиться"
    >
      <Field label="Этапы">
        <Select
          multiple
          ariaLabel="Этапы аудита"
          placeholder="Выберите этапы"
          options={toOptions(catalog.stages)}
          value={state.stages}
          onChange={(stages) => dispatch({
            type: "stages/change",
            stages: pickMany(AUDIT_STAGES, stages),
          })}
        />
      </Field>
      <Field label="Тип аудита">
        <Select
          ariaLabel="Тип аудита"
          placeholder="Выберите тип"
          options={toOptions(catalog.kinds)}
          value={state.kind}
          onChange={(value) => {
            const kind = pickOne(AUDIT_KINDS, value);
            if (kind) {
              dispatch({ type: "kind/change", kind });
            }
          }}
        />
      </Field>
      {asksSto(state.kind) && (
        <Field label="Учитывать внутренние стандарты организации (СТО)">
          <YesNoField
            value={state.useSto}
            onChange={(useSto) => dispatch({ type: "sto/change", useSto })}
          />
        </Field>
      )}
      {asksSto(state.kind) && state.useSto && (
        <Field
          label="Наименование и реквизиты СТО"
          hint="Файл СТО приложите в разделе «Документы»"
        >
          <TextInput
            value={state.stoName}
            maxLength={1000}
            placeholder="СТО 12345-001-2024 «…»"
            onChange={(event) => dispatch({
              type: "field/change",
              field: "stoName",
              value: event.target.value,
            })}
          />
        </Field>
      )}
      {state.kind === "selective" && (
        <Field label="Направления выборочного аудита">
          <Select
            multiple
            ariaLabel="Направления выборочного аудита"
            placeholder="Выберите направления"
            options={toOptions(catalog.elements)}
            value={state.elements}
            onChange={(elements) => dispatch({ type: "elements/change", elements })}
          />
        </Field>
      )}
    </FormSection>
  );
}