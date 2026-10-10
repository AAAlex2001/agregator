import type { DashboardAction, DashboardState } from "./types";

export const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case "load/success":
      return { dashboard: action.dashboard, failed: false };

    case "load/error":
      return { ...state, failed: true };

    default:
      return state;
  }
};
