"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Loader } from "@/shared/ui/loader";
import { Tabs } from "@/shared/ui/tabs";
import { TextInput } from "@/shared/ui/text-input";
import { useLiningReportForm } from "../../model/use-lining-report-form";
import { ExpertAssessment } from "../expert-assessment";
import { LiningElements } from "../lining-elements";
import { LiningFactors } from "../lining-factors";
import { LiningHeaderFields } from "../lining-header-fields";
import styles from "./style.module.scss";

/** Разделы калькулятора оценки крепи. */
const SECTION_TABS = [
  {
    id: "elements",
    label: "Элементы крепи",
  },
  {
    id: "factors",
    label: "Факторы риска",
  },
  {
    id: "expert",
    label: "Экспертная оценка",
  },
];

/** Действие после сохранения отчёта в историю. */
interface LiningReportFormProps {
  onCreated: () => void;
}

/** Калькулятор оценки крепи: название, срок, шапка PDF и три раздела оценки. */
export function LiningReportForm({ onCreated }: LiningReportFormProps) {
  const form = useLiningReportForm(onCreated);
  const [section, setSection] = useState("elements");
  const [activeGroup, setActiveGroup] = useState("R0");
  const { state, catalog } = form;

  return (
    <div className={styles.panel}>
      <div className={styles.head}>
        <div className={styles.actions}>
          <label className={styles.field}>
            <span className={styles.label}>Название отчёта:</span>
            <TextInput
              value={state.reportName}
              onChange={(event) => form.changeReportName(event.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>
              Срок эксплуатации t<sub>ф</sub>, лет:
            </span>
            <TextInput
              value={state.serviceLife}
              onChange={(event) => form.changeServiceLife(event.target.value)}
              inputMode="decimal"
              placeholder="5"
              className={styles.input}
            />
          </label>
          <Button
            variant="primary"
            className={styles.submit}
            onClick={form.submit}
            isLoading={state.isSubmitting}
          >
            Сформировать отчёт
          </Button>
        </div>

        <LiningHeaderFields
          header={state.header}
          onChange={form.changeHeader}
        />

        <Tabs
          variant="pill"
          className={styles.tabs}
          activeTab={section}
          onTabChange={setSection}
          tabs={SECTION_TABS}
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
        {catalog && section === "elements" && (
          <LiningElements
            catalog={catalog}
            categories={form.elementCategories}
            onSelect={form.selectElementCategory}
          />
        )}
        {catalog && section === "factors" && (
          <LiningFactors
            catalog={catalog}
            selections={form.selections}
            activeGroup={activeGroup}
            onGroupChange={setActiveGroup}
            onSelect={form.selectOption}
          />
        )}
        {catalog && section === "expert" && (
          <ExpertAssessment
            catalog={catalog}
            scores={form.expertScores}
            onSelect={form.selectScore}
          />
        )}
      </div>
    </div>
  );
}
