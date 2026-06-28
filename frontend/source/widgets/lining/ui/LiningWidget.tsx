"use client";

import { useState } from "react";
import Tabs from "@/source/shared/ui/Tabs";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { LiningCalculator } from "@/source/features/lining-calculator";
import { LiningReports } from "@/source/features/lining-reports";
import s from "./LiningWidget.module.scss";

export function LiningWidget() {
  const [tab, setTab] = useState("calc");

  return (
    <div className={s.wrapper}>
      <div className={s.pageHead}>
        <Title text="Оценка крепи горных выработок" as="h1" className={s.pageTitle} />
        <Subtitle
          text="Расчёт срока службы анкерной крепи по факторам риска и категориям повреждений с формированием PDF-отчёта"
          className={s.pageSubtitle}
        />
      </div>

      <div className={s.contentArea}>
        <Tabs
          variant="pill"
          className={s.tabs}
          activeTab={tab}
          onTabChange={setTab}
          tabs={[
            { id: "calc", label: "Калькулятор" },
            { id: "history", label: "История отчётов" },
          ]}
        />
        <div className={s.contentBody}>
          {tab === "calc" ? <LiningCalculator onSaved={() => setTab("history")} /> : <LiningReports />}
        </div>
      </div>

      <div className={s.stub}>
        Для работы с инструментом откройте страницу с компьютера — на мобильных устройствах оценка крепи недоступна.
      </div>
    </div>
  );
}
