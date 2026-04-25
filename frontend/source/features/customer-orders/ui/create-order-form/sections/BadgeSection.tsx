import { useState } from "react";
import type { BadgeOptionDto } from "../../../api/customer-orders.api";
import base from "./sectionBase.module.scss";
import s from "./badgeSection.module.scss";

interface Props {
  options: readonly BadgeOptionDto[];
  selectedBadgeVariants: string[];
  typicalNamesMap: Record<string, string>;
  onToggleBadge: (variant: string) => void;
  onChangeTypicalNames: (variant: string, value: string) => void;
}

const OPO_ROWS: string[][] = [
  ["1", "2", "3.1", "3.2", "4", "5"],
  ["6", "7", "8", "9", "10", "11", "12"],
  ["13", "14.1", "14.2", "14.3", "14.4", "15"],
];

function getColorClass(variant: string) {
  return s[variant.toLowerCase() as keyof typeof s] ?? s.gray;
}

function shortenLabel(text: string) {
  return text.replace(/^Э\d+\s+/i, "").trim() || text;
}

export function BadgeSection({
  options,
  selectedBadgeVariants,
  onToggleBadge,
}: Props) {
  const [selectedOpo, setSelectedOpo] = useState<string[]>([]);

  const toggleOpo = (code: string) => {
    setSelectedOpo((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  return (
    <>
      <section className={base.section}>
        <span className={base.label}>
          Выберите основной(-ые) объект(-ы) экспертизы
        </span>

        <div className={s.row}>
          {options.map((option) => {
            const active = selectedBadgeVariants.includes(option.variant);
            return (
              <button
                key={option.variant}
                type="button"
                className={`${s.mainBadge} ${getColorClass(option.variant)} ${active ? s.active : ""}`}
                onClick={() => onToggleBadge(option.variant)}
              >
                {shortenLabel(option.text)}
              </button>
            );
          })}
        </div>
      </section>

      <section className={base.section}>
        <span className={base.label}>
          Выберите тип(-ы) опасных производственных объектов
        </span>

        <div className={s.opoRows}>
          {OPO_ROWS.map((row, rowIdx) => (
            <div key={rowIdx} className={s.row}>
              {row.map((code) => {
                const active = selectedOpo.includes(code);
                return (
                  <button
                    key={code}
                    type="button"
                    className={`${s.opoBadge} ${active ? s.active : ""}`}
                    onClick={() => toggleOpo(code)}
                  >
                    {code}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
