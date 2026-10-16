"use client";

import { useState } from "react";
import { HazardReportForm } from "@/features/create-hazard-report";
import { Subtitle } from "@/shared/ui/subtitle";
import { Tabs } from "@/shared/ui/tabs";
import { Title } from "@/shared/ui/title";
import { HazardReports } from "../hazard-reports";
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
  "Расчёт показателей опасности (риска) аварий по факторам R0–R9 с формированием PDF-отчёта";

/** Страница анализа риска аварий: сертификат, калькулятор и история отчётов. */
export function HazardTool() {
  const [tab, setTab] = useState("calc");

  /** Открывает историю, где появился новый отчёт. */
  function openHistory() {
    setTab("history");
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.head}>
        <Title
          text="Анализ риска аварий"
          as="h1"
          className={styles.title}
        />
        <Subtitle
          text={SUBTITLE}
          className={styles.subtitle}
        />
        <p className={styles.certificate}>
          ПО сертифицировано: сертификат соответствия № РОСС RU.32001.04ИБФ1.ОСП28.48561
          от 04.03.2024, действует до 03.03.2027 (СДС «Промтехстандарт»).{" "}
          <a
            className={styles.certificateLink}
            href="/PDFnedra.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            Скачать сертификат (PDF)
          </a>
        </p>
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
          {tab === "calc" ? <HazardReportForm onCreated={openHistory} /> : <HazardReports />}
        </div>
      </div>

      <div className={styles.stub}>
        Для работы с инструментом откройте страницу с компьютера — на мобильных устройствах
        оценка опасности аварий недоступна.
      </div>
    </div>
  );
}
