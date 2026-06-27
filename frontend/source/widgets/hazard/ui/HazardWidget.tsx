"use client";

import { useState } from "react";
import Tabs from "@/source/shared/ui/Tabs";
import { HazardCalculator } from "@/source/features/hazard-calculator";
import { HazardReports } from "@/source/features/hazard-reports";
import s from "./HazardWidget.module.scss";

export function HazardWidget() {
  const [tab, setTab] = useState("calc");

  return (
    <section className={s.wrap}>
      <h1 className={s.title}>Оценка опасности аварий</h1>
      <p className={s.subtitle}>
        Расчёт показателей опасности (риска) аварий по факторам R0–R9 с формированием PDF-отчёта.
      </p>
      <Tabs
        variant="pill"
        activeTab={tab}
        onTabChange={setTab}
        tabs={[
          { id: "calc", label: "Калькулятор" },
          { id: "history", label: "История отчётов" },
        ]}
      />
      <div className={s.body}>
        {tab === "calc" ? <HazardCalculator /> : <HazardReports />}
      </div>
    </section>
  );
}
