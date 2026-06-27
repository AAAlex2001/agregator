"use client";

import { useState } from "react";
import { getHazardReportPdfUrl, type HazardReportItem } from "@/source/entities/hazard";
import s from "./HazardReportCard.module.scss";

const PROFILE_LABELS: Record<string, string> = { rudnik: "Рудник", shahta: "Шахта" };

function riskClass(category: string): string {
  if (category.startsWith("Низк") || category.startsWith("Умерен")) return s.green;
  if (category.startsWith("Средн") || category.startsWith("Значит")) return s.yellow;
  return s.red;
}

function shortCategory(category: string): string {
  return category.split(" уровень")[0];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Ring({ percent }: { percent: number }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const fraction = Math.max(0, Math.min(1, percent / 100));
  return (
    <div className={s.ring}>
      <svg width="60" height="60" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r={radius} fill="none" stroke="#ffe3bd" strokeWidth="5.5" />
        <circle
          cx="30"
          cy="30"
          r={radius}
          fill="none"
          stroke="#ff8a00"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - fraction)}
          transform="rotate(-90 30 30)"
        />
      </svg>
      <span className={s.ringNum}>
        {Math.round(percent)}
        <small>%</small>
      </span>
    </div>
  );
}

export function HazardReportCard({ item }: { item: HazardReportItem }) {
  const [viewing, setViewing] = useState(false);
  const pdfUrl = getHazardReportPdfUrl(item.id);

  return (
    <div className={s.card}>
      <div className={s.top}>
        <span className={s.date}>{formatDate(item.created_at)}</span>
        <span className={s.profile}>{PROFILE_LABELS[item.profile] ?? item.profile}</span>
      </div>

      <div className={s.main}>
        <div className={s.info}>
          <div className={s.name}>{item.name}</div>
          <div className={s.caption}>Показатель риска на объекте · {shortCategory(item.overall_category)}</div>
        </div>
        <Ring percent={item.overall_r} />
      </div>

      {item.blocks.length > 0 && (
        <div className={s.grid}>
          {item.blocks.map((block) => (
            <div key={block.group} className={s.row}>
              <span className={s.rowName}>{block.title}</span>
              <span className={`${s.badge} ${riskClass(block.category)}`}>
                {block.value.toFixed(1)}% · {shortCategory(block.category)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className={s.actions}>
        <button className={s.view} onClick={() => setViewing((value) => !value)}>
          {viewing ? "Скрыть" : "Посмотреть"}
        </button>
        <a className={s.download} href={pdfUrl} target="_blank" rel="noopener noreferrer">
          Скачать
        </a>
      </div>

      {viewing && <iframe className={s.viewer} src={pdfUrl} title={item.name} />}
    </div>
  );
}
