"use client";

import type { Dispatch } from "react";
import { parseBlitzPrice } from "@/entities/blitz-order";
import type { BlitzAuditCatalog } from "@/entities/blitz-order";
import { formatRub } from "@/shared/lib/format-rub";
import { CalendarInput } from "@/shared/ui/calendar-input";
import { Field } from "@/shared/ui/field";
import { FormSection } from "@/shared/ui/form-section";
import { Select } from "@/shared/ui/select";
import { Tabs } from "@/shared/ui/tabs";
import { TextInput } from "@/shared/ui/text-input";
import {
  AUDIT_BUDGETS,
  AUDIT_NEGOTIATIONS,
  AUDIT_TIMINGS,
  BUDGET_TABS,
} from "../../config/options";
import { pickOne, toOptions } from "../../model/options";
import type { CreateBlitzAuditAction, CreateBlitzAuditState } from "../../model/types";
import styles from "./style.module.scss";

/** Черновик, справочник и изменения. */
interface TermsSectionProps {
  state: CreateBlitzAuditState;
  catalog: BlitzAuditCatalog;
  dispatch: Dispatch<CreateBlitzAuditAction>;
}

/** Когда провести аудит, бюджет и можно ли обсуждать стоимость. */
export function TermsSection({ state, catalog, dispatch }: TermsSectionProps) {
  const amount = parseBlitzPrice(state.price);

  return (
    <FormSection
      title="Сроки и стоимость"
      hint={`Аванс 50 % — после договора, остаток — когда отчёт готов. `
        + `Минимальная стоимость — ${formatRub(catalog.min_price)}`}
    >
      <Field label="Когда провести аудит">
        <Select
          ariaLabel="Срок аудита"
          options={toOptions(catalog.timings)}
          value={state.timing}
          onChange={(value) => {
            const timing = pickOne(AUDIT_TIMINGS, value);
            if (timing) {
              dispatch({ type: "timing/change", timing });
            }
          }}
        />
      </Field>
      {state.timing === "custom" && (
        <div className={styles.grid}>
          <Field label="С">
            <CalendarInput
              value={state.timingStart}
              placeholder="ДД.ММ.ГГГГ"
              onChange={(value) => dispatch({ type: "field/change", field: "timingStart", value })}
            />
          </Field>
          <Field label="По">
            <CalendarInput
              value={state.timingEnd}
              placeholder="ДД.ММ.ГГГГ"
              onChange={(value) => dispatch({ type: "field/change", field: "timingEnd", value })}
            />
          </Field>
        </div>
      )}
      <Field label="Бюджет">
        <Tabs
          tabs={BUDGET_TABS}
          activeTab={state.budget}
          onTabChange={(id) => {
            const budget = pickOne(AUDIT_BUDGETS, id);
            if (budget) {
              dispatch({ type: "budget/change", budget });
            }
          }}
        />
      </Field>
      {state.budget === "custom" ? (
        <Field
          label="Ваша цена за аудит, ₽"
          hint={amount > 0 ? `Аванс: ${formatRub(Math.round(amount * 50) / 100)}` : undefined}
        >
          <TextInput
            value={state.price}
            inputMode="decimal"
            placeholder={`Не менее ${formatRub(catalog.min_price)}`}
            onChange={(event) => dispatch({
              type: "field/change",
              field: "price",
              value: event.target.value,
            })}
          />
          {catalog.tariff !== null && (
            <button
              type="button"
              className={styles.tariff}
              onClick={() => dispatch({
                type: "field/change",
                field: "price",
                value: String(catalog.tariff),
              })}
            >
              Ориентир по тарифу: {formatRub(catalog.tariff)} — подставить
            </button>
          )}
        </Field>
      ) : (
        <p className={styles.note}>
          Руководитель аудиторской группы рассчитает стоимость и предложит её вам
        </p>
      )}
      <Field label="Можно ли обсуждать стоимость">
        <Select
          ariaLabel="Обсуждение стоимости"
          options={toOptions(catalog.negotiations)}
          value={state.negotiation}
          onChange={(value) => {
            const negotiation = pickOne(AUDIT_NEGOTIATIONS, value);
            if (negotiation) {
              dispatch({ type: "negotiation/change", negotiation });
            }
          }}
        />
      </Field>
    </FormSection>
  );
}