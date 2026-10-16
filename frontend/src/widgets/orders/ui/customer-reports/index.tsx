"use client";

import { OrderListProvider } from "@/entities/order";
import { CustomerReportsList } from "../customer-reports-list";
import styles from "./style.module.scss";

/** Отчёты заказчика по завершённым тендерам. */
export function CustomerReports() {
  return (
    <div className={styles.wrapper}>
      <OrderListProvider listType="reports">
        <CustomerReportsList />
      </OrderListProvider>
    </div>
  );
}
