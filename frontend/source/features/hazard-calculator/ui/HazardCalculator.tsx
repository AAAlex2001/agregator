"use client";

import Button from "@/source/shared/ui/Button";
import Loader from "@/source/shared/ui/Loader";
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

  return (
    <div className={s.wrap}>
      <div className={s.profiles}>
        <button
          className={profile === "rudnik" ? s.profileActive : s.profile}
          onClick={() => setProfile("rudnik")}
        >
          Рудник
        </button>
        <button
          className={profile === "shahta" ? s.profileActive : s.profile}
          onClick={() => setProfile("shahta")}
        >
          Шахта
        </button>
      </div>

      <div className={s.actions}>
        <input
          className={s.nameInput}
          value={reportName}
          onChange={(e) => setReportName(e.target.value)}
          placeholder="Название отчёта"
        />
        <Button variant="chat" onClick={calculate} isLoading={calculating}>
          Рассчитать
        </Button>
        <Button variant="primary" onClick={generate} isLoading={generating}>
          Сформировать PDF
        </Button>
      </div>

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

      {loading || !catalog ? (
        <Loader />
      ) : (
        <div className={s.groups}>
          {catalog.groups.map((group) => (
            <details key={group.group} className={s.group} open={group.group === "R0"}>
              <summary className={s.summary}>
                {group.group} · {group.title}
              </summary>
              <div className={s.factors}>
                {group.factors.map((factor) => (
                  <label key={factor.code} className={s.factor}>
                    <span className={s.name}>{factor.name}</span>
                    <select
                      className={s.select}
                      value={Math.max(0, factor.options.findIndex((o) => o.value === selections[factor.code]))}
                      onChange={(e) => select(factor.code, factor.options[Number(e.target.value)].value)}
                    >
                      {factor.options.map((option, index) => (
                        <option key={index} value={index}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
