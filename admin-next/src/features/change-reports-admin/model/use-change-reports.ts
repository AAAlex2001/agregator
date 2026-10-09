"use client";

import { useEffect, useReducer } from "react";
import type { ChangeReport, ChangeReportStatus } from "@/entities/change-report";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { fetchChangeReports, setChangeReportStatus } from "../api/change-reports";
import { changeReportsReducer } from "./reducers";

/** Сигналы об устаревших разъяснениях: фильтр по статусу и смена статуса в строке. */
export const useChangeReports = () => {
  const toast = useToast();
  const [state, dispatch] = useReducer(changeReportsReducer, {
    filter: "",
    items: null,
    loading: true,
    failed: false,
    pendingId: null,
  });
  const { filter } = state;

  useEffect(() => {
    let active = true;

    fetchChangeReports(filter)
      .then((list) => {
        if (active) dispatch({ type: "load/success", items: list.items });
      })
      .catch(() => {
        if (active) dispatch({ type: "load/error" });
      });

    return () => {
      active = false;
    };
  }, [filter]);

  const changeFilter = (value: string) => dispatch({ type: "load/start", filter: value });

  const setStatus = async (report: ChangeReport, status: ChangeReportStatus) => {
    dispatch({ type: "request/start", id: report.id });

    try {
      dispatch({ type: "report/changed", report: await setChangeReportStatus(report.id, status) });
      toast("Статус обновлён");
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось изменить статус"), "error");
    } finally {
      dispatch({ type: "request/finish" });
    }
  };

  return { state, changeFilter, setStatus };
};
