"use client";

import { useState } from "react";
import { Checkbox } from "@/source/shared/ui";
import { AREA_OPTIONS } from "../model/data";
import s from "./ExpertiseAreasPicker.module.scss";

interface ExpertiseAreasPickerProps {
  value: string[];
  onChange: (area: string, checked: boolean) => void;
  idPrefix?: string;
}

export function ExpertiseAreasPicker({
  value,
  onChange,
  idPrefix = "expertise-area",
}: ExpertiseAreasPickerProps) {
  const [mobileHelpArea, setMobileHelpArea] =
    useState<string | null>(null);
  const mobileHelp = AREA_OPTIONS.find(
    (option) => option.value === mobileHelpArea,
  );

  return (
    <div className={s.picker}>
      <div
        className={s.grid}
        role="group"
        aria-label="Области аттестации"
      >
        {AREA_OPTIONS.map((option) => {
          const tooltipId = `${idPrefix}-${option.value}-description`;

          return (
            <div key={option.value} className={s.option}>
              <Checkbox
                id={`${idPrefix}-${option.value}`}
                checked={value.includes(option.value)}
                onChange={(checked) =>
                  onChange(option.value, checked)
                }
              >
                {option.value}
              </Checkbox>

              <span
                className={s.desktopHelp}
                aria-label={`Что означает ${option.value}`}
                aria-describedby={tooltipId}
                tabIndex={0}
              >
                i
                <span
                  id={tooltipId}
                  className={s.desktopTooltip}
                  role="tooltip"
                >
                  {option.name}
                </span>
              </span>

              <button
                type="button"
                className={s.mobileHelpButton}
                aria-label={`Что означает ${option.value}`}
                aria-expanded={mobileHelpArea === option.value}
                onClick={() =>
                  setMobileHelpArea(
                    mobileHelpArea === option.value
                      ? null
                      : option.value,
                  )
                }
              >
                i
              </button>
            </div>
          );
        })}
      </div>

      {mobileHelp && (
        <p className={s.mobileDescription} aria-live="polite">
          <strong>{mobileHelp.value}:</strong> {mobileHelp.name}
        </p>
      )}
    </div>
  );
}
