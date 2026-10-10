export type DashboardCounter = {
  total: number;
  week: number;
  month: number;
};

export type DailyCount = {
  date: string;
  count: number;
};

export type Dashboard = {
  users: DashboardCounter;
  orders: DashboardCounter;
  responses: DashboardCounter;
  users_daily: DailyCount[];
  orders_daily: DailyCount[];
  responses_daily: DailyCount[];
  users_by_role: Record<string, number>;
  orders_by_status: Record<string, number>;
  responses_by_status: Record<string, number>;
};

export type DashboardState = {
  dashboard: Dashboard | null;
  failed: boolean;
};

export type DashboardAction = { type: "load/success"; dashboard: Dashboard } | { type: "load/error" };
