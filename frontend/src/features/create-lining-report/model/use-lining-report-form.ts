"use client";

import { useReducer } from "react";
import {
  createLiningReport,
  getDefaultElementCategories,
  getDefaultExpertScores,
  getDefaultLiningSelections,
  useLiningCatalog,
} from "@/entities/lining";
import { useNotifications } from "@/shared/ui/notifications";
import { INITIAL_LINING_REPORT_FORM, liningReportFormReducer } from "./reducer";
import { cleanServiceLife, toServiceLifeYears } from "./service-life";
import type { LiningHeaderField } from "./types";

/** Хранит черновик оценки крепи поверх справочника и отправляет отчёт в историю. */
export function useLiningReportForm(onCreated: () => void) {
  const [state, dispatch] = useReducer(liningReportFormReducer, INITIAL_LINING_REPORT_FORM);
  const { catalog, isLoading, error } = useLiningCatalog();
  const { showError, showSuccess } = useNotifications();
  const selections = catalog
    ? {
        ...getDefaultLiningSelections(catalog),
        ...state.selections,
      }
    : state.selections;
  const elementCategories = catalog
    ? {
        ...getDefaultElementCategories(catalog),
        ...state.elementCategories,
      }
    : state.elementCategories;
  const expertScores = catalog
    ? {
        ...getDefaultExpertScores(catalog),
        ...state.expertScores,
      }
    : state.expertScores;

  /** Запоминает выбранный вариант фактора риска. */
  function selectOption(code: string, value: number | null) {
    dispatch({
      type: "option/select",
      code,
      value,
    });
  }

  /** Запоминает категорию технического состояния элемента крепи. */
  function selectElementCategory(elementId: number, category: number) {
    dispatch({
      type: "element/select",
      elementId,
      category,
    });
  }

  /** Запоминает экспертный балл условия надёжности. */
  function selectScore(criterionId: number, score: number) {
    dispatch({
      type: "score/select",
      criterionId,
      score,
    });
  }

  /** Меняет срок эксплуатации, оставляя только цифры и разделитель. */
  function changeServiceLife(value: string) {
    dispatch({
      type: "service-life/change",
      serviceLife: cleanServiceLife(value),
    });
  }

  /** Меняет название отчёта в истории и PDF. */
  function changeReportName(reportName: string) {
    dispatch({
      type: "report-name/change",
      reportName,
    });
  }

  /** Меняет строку шапки PDF, которую заполняет эксперт. */
  function changeHeader(field: LiningHeaderField, value: string) {
    dispatch({
      type: "header/change",
      field,
      value,
    });
  }

  /** Сохраняет отчёт и после успеха открывает историю. */
  async function submit() {
    dispatch({ type: "submit/start" });

    try {
      await createLiningReport({
        ...state.header,
        profile: "rudnik",
        selections,
        element_categories: elementCategories,
        service_life_years: toServiceLifeYears(state.serviceLife),
        expert_scores: expertScores,
        report_name: state.reportName,
      });
      showSuccess("Отчёт сформирован и сохранён в «Историю отчётов»");
      onCreated();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сформировать отчёт");
    } finally {
      dispatch({ type: "submit/finish" });
    }
  }

  return {
    state,
    catalog,
    isLoading,
    error,
    selections,
    elementCategories,
    expertScores,
    selectOption,
    selectElementCategory,
    selectScore,
    changeServiceLife,
    changeReportName,
    changeHeader,
    submit,
  };
}
