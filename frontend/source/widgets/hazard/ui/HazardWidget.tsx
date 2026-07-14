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
        <Title text="Анализ риска аварий" as="h1" className={s.pageTitle} />
        <Subtitle
          text="Расчёт показателей опасности (риска) аварий по факторам R0–R9 с формированием PDF-отчёта"
          className={s.pageSubtitle}
        />
        <p className={s.cert}>
          ПО сертифицировано: сертификат соответствия № РОСС RU.32001.04ИБФ1.ОСП28.48561 от 04.03.2024,
          действует до 03.03.2027 (СДС «Промтехстандарт»).{" "}
          <a className={s.certLink} href="/PDFnedra.pdf" target="_blank" rel="noopener noreferrer" download>
            Скачать сертификат (PDF)
          </a>
        </p>
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
          {tab === "calc" ? <HazardCalculator onSaved={() => setTab("history")} /> : <HazardReports />}
        </div>
      </div>

      <div className={s.stub}>
        Для работы с инструментом откройте страницу с компьютера — на мобильных устройствах оценка опасности аварий недоступна.
      </div>
    </div>
  );
}
