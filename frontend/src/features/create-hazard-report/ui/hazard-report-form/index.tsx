"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Loader } from "@/shared/ui/loader";
import { Tabs } from "@/shared/ui/tabs";
import { TextInput } from "@/shared/ui/text-input";
import { useHazardReportForm } from "../../model/use-hazard-report-form";
import { HazardFactors } from "../hazard-factors";
import { HazardHeaderFields } from "../hazard-header-fields";
import styles from "./style.module.scss";

/** Профили объекта во вкладках калькулятора. */
const PROFILE_TABS = [
  {
    id: "rudnik",
    label: "Рудник",
  },
  {
    id: "shahta",
    label: "Шахта",
  },
];

/** Действие после сохранения отчёта в историю. */
interface HazardReportFormProps {
  onCreated: () => void;
}

/** Калькулятор опасности аварий: профиль, название, шапка PDF и факторы R0–R9. */
export function HazardReportForm({ onCreated }: HazardReportFormProps) {
  const form = useHazardReportForm(onCreated);
  const [activeGroup, setActiveGroup] = useState("R0");
  const { state } = form;

  return (
    <div className={styles.panel}>
      <div className={styles.head}>
        <Tabs
          variant="pill"
          activeTab={state.profile}
          onTabChange={form.changeProfile}
          tabs={PROFILE_TABS}
        />

        <div className={styles.actions}>
          <label
            className={styles.actionsLabel}
            htmlFor="hazard-report-name"
          >
            Название отчёта:
          </label>
          <div className={styles.actionsRow}>
            <TextInput
              id="hazard-report-name"
              value={state.reportName}
              onChange={(event) => form.changeReportName(event.target.value)}
              placeholder="Название отчёта"
              className={styles.nameInput}
            />
            <Button
              variant="primary"
              className={styles.submit}
              onClick={form.submit}
              isLoading={state.isSubmitting}
            >
              Сформировать отчёт
            </Button>
          </div>
        </div>

        <HazardHeaderFields
          header={state.header}
          onChange={form.changeHeader}
        />
      </div>

      <div className={styles.body}>
        {form.isLoading && (
          <div className={styles.loader}>
            <Loader
              label=""
              size="lg"
            />
          </div>
        )}
        {form.error && <p className={styles.error}>{form.error}</p>}
        {form.catalog && (
          <HazardFactors
            catalog={form.catalog}
            selections={form.selections}
            excludedGroups={state.excludedGroups}
            activeGroup={activeGroup}
            onGroupChange={setActiveGroup}
            onSelect={form.selectOption}
            onToggleGroup={form.toggleGroup}
          />
        )}
      </div>
    </div>
  );
}
