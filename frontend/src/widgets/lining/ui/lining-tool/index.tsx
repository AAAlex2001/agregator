"use client";

import { useState } from "react";
import { LiningReportForm } from "@/features/create-lining-report";
import { Subtitle } from "@/shared/ui/subtitle";
import { Tabs } from "@/shared/ui/tabs";
import { Title } from "@/shared/ui/title";
import { LiningReports } from "../lining-reports";
import styles from "./style.module.scss";

/** Вкладки калькулятора и истории отчётов. */
const TOOL_TABS = [
  {
    id: "calc",
    label: "Калькулятор",
  },
  {
    id: "history",
    label: "История отчётов",
  },
];

/** Пояснение под заголовком страницы. */
const SUBTITLE =
  "Расчёт срока службы анкерной крепи по факторам риска и категориям повреждений "
  + "с формированием PDF-отчёта";

/** Страница расчёта остаточного ресурса крепи: калькулятор и история отчётов. */
export function LiningTool() {
  const [tab, setTab] = useState("calc");

  /** Открывает историю, где появился новый отчёт. */
  function openHistory() {
    setTab("history");
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.head}>
        <Title
          text="Расчёт остаточного ресурса"
          as="h1"
          className={styles.title}
        />
        <Subtitle
          text={SUBTITLE}
          className={styles.subtitle}
        />
      </div>

      <div className={styles.content}>
        <Tabs
          variant="pill"
          className={styles.tabs}
          activeTab={tab}
          onTabChange={setTab}
          tabs={TOOL_TABS}
        />
        <div className={styles.body}>
          {tab === "calc" ? <LiningReportForm onCreated={openHistory} /> : <LiningReports />}
        </div>
      </div>

      <div className={styles.stub}>
        Для работы с инструментом откройте страницу с компьютера — на мобильных устройствах
        оценка крепи недоступна.
      </div>
    </div>
  );
}
