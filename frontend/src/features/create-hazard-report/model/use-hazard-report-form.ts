"use client";

import { useReducer } from "react";
import {
  createHazardReport,
  getDefaultSelections,
  useHazardCatalog,
} from "@/entities/hazard";
import { useNotifications } from "@/shared/ui/notifications";
import { hazardReportFormReducer, INITIAL_HAZARD_REPORT_FORM } from "./reducer";
import type { HazardHeaderField } from "./types";

/** Хранит черновик отчёта по справочнику профиля и отправляет отчёт в историю. */
export function useHazardReportForm(onCreated: () => void) {
  const [state, dispatch] = useReducer(hazardReportFormReducer, INITIAL_HAZARD_REPORT_FORM);
  const { catalog, isLoading, error } = useHazardCatalog(state.profile);
  const { showError, showSuccess } = useNotifications();
  const selections = catalog
    ? {
        ...getDefaultSelections(catalog),
        ...state.selections,
      }
    : state.selections;

  /** Переключает рудник или шахту. */
  function changeProfile(tabId: string) {
    dispatch({
      type: "profile/change",
      profile: tabId === "shahta" ? "shahta" : "rudnik",
    });
  }

  /** Запоминает выбранный вариант фактора. */
  function selectOption(code: string, value: number | null) {
    dispatch({
      type: "option/select",
      code,
      value,
    });
  }

  /** Включает группу в отчёт или исключает её. */
  function toggleGroup(group: string) {
    dispatch({
      type: "group/toggle",
      group,
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
  function changeHeader(field: HazardHeaderField, value: string) {
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
      await createHazardReport({
        ...state.header,
        profile: state.profile,
        selections,
        report_name: state.reportName,
        excluded_groups: state.excludedGroups,
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
    changeProfile,
    selectOption,
    toggleGroup,
    changeReportName,
    changeHeader,
    submit,
  };
}
