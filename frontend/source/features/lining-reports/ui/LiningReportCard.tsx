"use client";

import { useState } from "react";
import Button from "@/source/shared/ui/Button";
import { getLiningReportPdfUrl, type LiningReportItem } from "@/source/entities/lining";
import { LiningPdfViewer } from "./LiningPdfViewer";
import s from "./LiningReportCard.module.scss";

function riskColor(category: string): string {
  if (category.startsWith("Низк") || category.startsWith("Умерен")) return "#2fb344";
  if (category.startsWith("Средн") || category.startsWith("Значит")) return "#f5a524";
  return "#e5484d";
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

function Gauge({ display, unit, label, fraction, color }: {
  display: string;
  unit: string;
  label: string;
  fraction: number;
  color: string;
}) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const filled = Math.max(0, Math.min(1, fraction));
  return (
    <div className={s.gauge}>
      <div className={s.ring}>
        <svg width="78" height="78" viewBox="0 0 78 78">
          <circle cx="39" cy="39" r={radius} fill="none" stroke="#eef0f4" strokeWidth="6" />
          <circle
            cx="39"
            cy="39"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - filled)}
            transform="rotate(-90 39 39)"
          />
        </svg>
        <span className={s.ringValue}>
          {display}
          {unit && <span className={s.ringUnit}>{unit}</span>}
        </span>
      </div>
      <span className={s.gaugeLabel}>{label}</span>
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

      <div className={s.name}>{item.name}</div>

      <div className={s.gauges}>
        <Gauge
          display={item.overall_r.toFixed(1)}
          unit="%"
          label={`Риск · ${shortCategory(item.overall_category)}`}
          fraction={item.overall_r / 100}
          color={riskColor(item.overall_category)}
        />
        <Gauge
          display={item.final_capital.toFixed(1)}
          unit="лет"
          label="До капремонта"
          fraction={Math.min(item.final_capital / 20, 1)}
          color="#ff8a00"
        />
        <Gauge
          display={item.final_emergency.toFixed(1)}
          unit="лет"
          label="До аварии"
          fraction={Math.min(item.final_emergency / 20, 1)}
          color="#e5484d"
        />
      </div>

      {item.blocks.length > 0 && (
        <div className={s.grid}>
          {item.blocks.map((block) => (
            <div key={block.group} className={s.row}>
              <span className={s.rowName}>{block.title}</span>
              <span className={`${s.badge} ${riskClassName(block.category)}`}>
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

function riskClassName(category: string): string {
  if (category.startsWith("Низк") || category.startsWith("Умерен")) return s.green;
  if (category.startsWith("Средн") || category.startsWith("Значит")) return s.yellow;
  return s.red;
}
