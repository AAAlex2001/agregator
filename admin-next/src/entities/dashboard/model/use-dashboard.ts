"use client";

import { useEffect, useReducer } from "react";
import { fetchDashboard } from "../api/dashboard";
import { dashboardReducer } from "./reducers";

/** Сводка платформы, загружается при открытии дашборда. */
export const useDashboard = () => {
  const [state, dispatch] = useReducer(dashboardReducer, { dashboard: null, failed: false });

  useEffect(() => {
    fetchDashboard()
      .then((dashboard) => dispatch({ type: "load/success", dashboard }))
      .catch(() => dispatch({ type: "load/error" }));
  }, []);

  return state;
};
