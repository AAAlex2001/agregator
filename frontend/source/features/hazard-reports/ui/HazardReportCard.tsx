"use client";

import { useState } from "react";
import Button from "@/source/shared/ui/Button";
import { getHazardReportPdfUrl, type HazardReportItem } from "@/source/entities/hazard";
import { HazardPdfViewer } from "./HazardPdfViewer";
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
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const fraction = Math.max(0, Math.min(1, percent / 100));
  return (
    <div className={s.ring}>
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="#ffe3bd" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="#ff8a00"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - fraction)}
          transform="rotate(-90 32 32)"
        />
      </svg>
      <span className={s.ringNum}>{percent.toFixed(1)}%</span>
    </div>
  );
}

export function HazardReportCard({ item }: { item: HazardReportItem }) {
  const [viewing, setViewing] = useState(false);
  const pdfUrl = getHazardReportPdfUrl(item.id);

  const download = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${item.name}.pdf`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

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
        <Button variant="outlineOrange" fullWidth onClick={() => setViewing(true)}>
          Посмотреть
        </Button>
        <Button variant="primary" fullWidth onClick={download}>
          Скачать
        </Button>
      </div>

      {viewing && <HazardPdfViewer url={pdfUrl} title={item.name} onClose={() => setViewing(false)} />}
    </div>
  );
}
