"use client";

import { useState } from "react";
import Button from "@/source/shared/ui/Button";
import { getLiningReportPdfUrl, type LiningReportItem } from "@/source/entities/lining";
import { LiningPdfViewer } from "./LiningPdfViewer";
import s from "./LiningReportCard.module.scss";

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

export function LiningReportCard({ item }: { item: LiningReportItem }) {
  const [viewing, setViewing] = useState(false);
  const pdfUrl = getLiningReportPdfUrl(item.id);

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
      </div>

      <div className={s.main}>
        <div className={s.info}>
          <div className={s.name}>{item.name}</div>
          <div className={s.caption}>Показатель риска на выработке · {shortCategory(item.overall_category)}</div>
        </div>
        <Ring percent={item.overall_r} />
      </div>

      <div className={s.figures}>
        <div className={s.figure}>
          <span className={s.figLabel}>До капремонта</span>
          <span className={s.figValue}>{item.final_capital.toFixed(1)} лет</span>
        </div>
        <div className={s.figure}>
          <span className={s.figLabel}>До аварии</span>
          <span className={s.figValue}>{item.final_emergency.toFixed(1)} лет</span>
        </div>
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

      {viewing && <LiningPdfViewer url={pdfUrl} title={item.name} onClose={() => setViewing(false)} />}
    </div>
  );
}
