"use client";

import { ACCOUNT_ROLE_LABELS } from "@/entities/account";
import { BreakdownList, DailyChart, StatCard, useDashboard } from "@/entities/dashboard";
import { ORDER_STATUS_LABELS, RESPONSE_STATUS_LABELS } from "@/entities/order";
import Loader from "@/shared/ui/loader";
import Message from "@/shared/ui/message";
import Page from "@/shared/ui/page";
import PageHeader from "@/shared/ui/page-header";
import styles from "./style.module.scss";

/** Дашборд: регистрации, заказы и отклики — итоги, динамика за 30 дней и распределения. */
const AdminDashboard = () => {
  const { dashboard, failed } = useDashboard();

  return (
    <Page>
      <PageHeader title="Дашборд" description="Что происходит на площадке" />

      {failed && <Message tone="error">Не удалось загрузить сводку.</Message>}

      {!dashboard && !failed && <Loader size="lg" />}

      {dashboard && (
        <>
          <div className={styles.grid}>
            <StatCard title="Учётные записи" counter={dashboard.users} />
            <StatCard title="Заказы" counter={dashboard.orders} />
            <StatCard title="Отклики" counter={dashboard.responses} />
          </div>

          <div className={styles.grid}>
            <DailyChart title="Регистрации" days={dashboard.users_daily} />
            <DailyChart title="Заказы" days={dashboard.orders_daily} />
            <DailyChart title="Отклики" days={dashboard.responses_daily} />
          </div>

          <div className={styles.grid}>
            <BreakdownList title="Учётные записи по ролям" counts={dashboard.users_by_role} labels={ACCOUNT_ROLE_LABELS} />
            <BreakdownList title="Заказы по статусам" counts={dashboard.orders_by_status} labels={ORDER_STATUS_LABELS} />
            <BreakdownList title="Отклики по статусам" counts={dashboard.responses_by_status} labels={RESPONSE_STATUS_LABELS} />
          </div>
        </>
      )}
    </Page>
  );
};

export default AdminDashboard;
