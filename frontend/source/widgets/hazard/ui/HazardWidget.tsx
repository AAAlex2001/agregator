"use client";

import { useState } from "react";
import Tabs from "@/source/shared/ui/Tabs";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { HazardCalculator } from "@/source/features/hazard-calculator";
import { HazardReports } from "@/source/features/hazard-reports";
import s from "./HazardWidget.module.scss";

export function HazardWidget() {
  const [tab, setTab] = useState("calc");

  return (
    <div className={s.wrapper}>
      <div className={s.pageHead}>
        <Title text="Оценка опасности аварий" as="h1" className={s.pageTitle} />
        <Subtitle
          text="Расчёт показателей опасности (риска) аварий по факторам R0–R9 с формированием PDF-отчёта"
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
          {tab === "calc" ? <HazardCalculator /> : <HazardReports />}
        </div>
      </div>
    </div>
  );
}
