"use client";

import type { Dispatch } from "react";
import type { BlitzAuditCatalog } from "@/entities/blitz-order";
import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import { FormSection } from "@/shared/ui/form-section";
import { Select } from "@/shared/ui/select";
import { TextInput } from "@/shared/ui/text-input";
import { YesNoField } from "@/shared/ui/yes-no-field";
import { AUDIT_SCOPES } from "../../config/options";
import { pickOne, toOptions } from "../../model/options";
import type { CreateBlitzAuditAction, CreateBlitzAuditState } from "../../model/types";
import { ObjectCard } from "../object-card";
import styles from "./style.module.scss";

/** Черновик, справочник и изменения. */
interface ObjectsSectionProps {
  state: CreateBlitzAuditState;
  catalog: BlitzAuditCatalog;
  dispatch: Dispatch<CreateBlitzAuditAction>;
}

/** Что проверяем: один ОПО, выборочные с добавлением в список или все ОПО организации. */
export function ObjectsSection({ state, catalog, dispatch }: ObjectsSectionProps) {
  const isSelected = state.scope === "selected";

  return (
    <FormSection title="Объекты аудита">
      <Field label="Масштаб аудита">
        <Select
          ariaLabel="Масштаб аудита"
          options={toOptions(catalog.scopes)}
          value={state.scope}
          onChange={(value) => {
            const scope = pickOne(AUDIT_SCOPES, value);
            if (scope) {
              dispatch({ type: "scope/change", scope });
            }
          }}
        />
      </Field>
      {state.scope === "all" ? (
        <div className={styles.grid}>
          <Field label="Сколько ОПО">
            <TextInput
              value={state.fleet.count}
              inputMode="numeric"
              placeholder="Например, 12"
              onChange={(event) => dispatch({
                type: "fleet/change",
                field: "count",
                value: event.target.value,
              })}
            />
          </Field>
          <Field label="Отраслевой профиль">
            <TextInput
              value={state.fleet.profile}
              placeholder="Нефтегазодобыча"
              onChange={(event) => dispatch({
                type: "fleet/change",
                field: "profile",
                value: event.target.value,
              })}
            />
          </Field>
          <Field label="Есть ОПО в разных субъектах РФ">
            <YesNoField
              value={state.fleet.multi_region}
              onChange={(multiRegion) => dispatch({ type: "fleet/multi-region", multiRegion })}
            />
          </Field>
        </div>
      ) : (
        <div className={styles.objects}>
          {state.objects.map((item, index) => (
            <ObjectCard
              key={index}
              item={item}
              index={index}
              catalog={catalog}
              isRemovable={isSelected && state.objects.length > 1}
              dispatch={dispatch}
            />
          ))}
          {isSelected && (
            <div className={styles.add}>
              <Button
                size="field"
                variant="outline"
                onClick={() => dispatch({ type: "object/add" })}
              >
                Добавить ОПО
              </Button>
            </div>
          )}
        </div>
      )}
    </FormSection>
  );
}