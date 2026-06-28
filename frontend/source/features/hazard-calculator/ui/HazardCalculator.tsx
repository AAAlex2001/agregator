"use client";

import { useState } from "react";
import Button from "@/source/shared/ui/Button";
import Loader from "@/source/shared/ui/Loader";
import Tabs from "@/source/shared/ui/Tabs";
import { Checkbox } from "@/source/shared/ui";
import { TextInput } from "@/source/shared/ui/Inputs";
import type { HazardProfile } from "@/source/entities/hazard";
import { useHazardCalculator } from "../model/useHazardCalculator";
import s from "./HazardCalculator.module.scss";

export function HazardCalculator() {
  const {
    profile,
    setProfile,
    catalog,
    selections,
    select,
    result,
    reportName,
    setReportName,
    loading,
    calculating,
    generating,
    calculate,
    generate,
  } = useHazardCalculator();
  const [activeGroup, setActiveGroup] = useState("R0");

  const currentGroup = catalog?.groups.find((group) => group.group === activeGroup) ?? catalog?.groups[0];

  return (
    <div className={s.panel}>
      <div className={s.head}>
        <Tabs
          variant="pill"
          activeTab={profile}
          onTabChange={(value) => setProfile(value as HazardProfile)}
          tabs={[
            { id: "rudnik", label: "Рудник" },
            { id: "shahta", label: "Шахта" },
          ]}
        />

        <div className={s.actions}>
          <label className={s.actionsLabel}>Название отчёта:</label>
          <div className={s.actionsRow}>
            <TextInput
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="Название отчёта"
              className={s.nameInput}
            />
            <Button variant="outlineOrange" className={s.actionBtn} onClick={calculate} isLoading={calculating}>
              Рассчитать
            </Button>
            <Button variant="primary" className={s.actionBtn} onClick={generate} isLoading={generating}>
              Сформировать PDF
            </Button>
          </div>
        </div>

        {currentGroup && (
          <Tabs
            className={s.groupTabs}
            activeTab={currentGroup.group}
            onTabChange={setActiveGroup}
            tabs={(catalog?.groups ?? []).map((group) => ({ id: group.group, label: group.group }))}
          />
        )}
      </div>

      <div className={s.body}>
        {loading || !catalog || !currentGroup ? (
          <div className={s.loaderWrap}>
            <Loader label="" size="lg" />
          </div>
        ) : (
          <>
            {result && (
              <div className={s.result}>
                <h3 className={s.resultTitle}>Результат оценки</h3>
                <table className={s.resultTable}>
                  <thead>
                    <tr>
                      <th>Показатель</th>
                      <th>Значение, %</th>
                      <th>Категория риска</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{result.r0.title}</td>
                      <td className={s.center}>{result.r0.value.toFixed(1)}</td>
                      <td>{result.r0.category}</td>
                    </tr>
                    {result.blocks.map((block) => (
                      <tr key={block.group}>
                        <td>{block.title}</td>
                        <td className={s.center}>{block.value.toFixed(1)}</td>
                        <td>{block.category}</td>
                      </tr>
                    ))}
                    <tr className={s.bold}>
                      <td>Показатель риска на объекте (R)</td>
                      <td className={s.center}>{result.overall_r.toFixed(1)}</td>
                      <td>{result.overall_r_category}</td>
                    </tr>
                    <tr>
                      <td>Интегральный показатель (Rᶦⁿᵗ)</td>
                      <td className={s.center}>{result.r_int.toFixed(1)}</td>
                      <td>{result.r_int_category}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <h3 className={s.groupTitle}>
              {currentGroup.group} · {currentGroup.title}
            </h3>
            <div className={s.factors}>
              {currentGroup.factors.map((factor) => (
                <div key={factor.code} className={s.factor}>
                  <span className={s.name}>{factor.name}</span>
                  <div className={s.options}>
                    {factor.options.map((option, index) => (
                      <Checkbox
                        key={index}
                        id={`${factor.code}-${index}`}
                        checked={selections[factor.code] === option.value}
                        onChange={() => select(factor.code, option.value)}
                      >
                        {option.label}
                      </Checkbox>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
