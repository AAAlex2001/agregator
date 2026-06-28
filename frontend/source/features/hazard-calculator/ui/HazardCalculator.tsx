"use client";

import { useState } from "react";
import Button from "@/source/shared/ui/Button";
import Loader from "@/source/shared/ui/Loader";
import Tabs from "@/source/shared/ui/Tabs";
import { Checkbox } from "@/source/shared/ui";
import { TextInput } from "@/source/shared/ui/Inputs";
import { ChatChevronDownIcon } from "@/source/shared/ui/icons";
import type { HazardProfile } from "@/source/entities/hazard";
import { useHazardCalculator } from "../model/useHazardCalculator";
import { FactorEditorModal } from "./FactorEditorModal";
import s from "./HazardCalculator.module.scss";

export function HazardCalculator() {
  const {
    profile,
    setProfile,
    catalog,
    selections,
    select,
    excludedGroups,
    toggleGroupExcluded,
    editing,
    setEditing,
    saveFactor,
    deleteFactor,
    addFactor,
    resetCatalog,
    result,
    reportName,
    setReportName,
    header,
    setHeaderField,
    loading,
    calculating,
    generating,
    calculate,
    generate,
  } = useHazardCalculator();
  const [activeGroup, setActiveGroup] = useState("R0");
  const [editMode, setEditMode] = useState(false);

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

        <details className={s.headerBlock}>
          <summary className={s.headerSummary}>
            <span>Шапка отчёта (для PDF)</span>
            <ChatChevronDownIcon className={s.headerChevron} />
          </summary>
          <div className={s.headerFields}>
            <label className={s.headerField}>
              <span className={s.headerLabel}>Автор</span>
              <TextInput
                value={header.author}
                onChange={(e) => setHeaderField("author", e.target.value)}
                placeholder="ФИО автора"
              />
            </label>
            <label className={s.headerField}>
              <span className={s.headerLabel}>Объект</span>
              <TextInput
                value={header.intro_line2}
                onChange={(e) => setHeaderField("intro_line2", e.target.value)}
                placeholder="на руднике / шахте …"
              />
            </label>
            <label className={s.headerField}>
              <span className={s.headerLabel}>Обоснование</span>
              <textarea
                className={s.headerArea}
                rows={3}
                value={header.justification}
                onChange={(e) => setHeaderField("justification", e.target.value)}
              />
            </label>
            <label className={s.headerField}>
              <span className={s.headerLabel}>Сертификат</span>
              <textarea
                className={s.headerArea}
                rows={2}
                value={header.certificate}
                onChange={(e) => setHeaderField("certificate", e.target.value)}
              />
            </label>
          </div>
        </details>

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

            <div className={s.groupHeader}>
              <h3 className={s.groupTitle}>
                {currentGroup.group} · {currentGroup.title}
              </h3>
              <div className={s.groupInclude}>
                <Checkbox
                  id={`include-${currentGroup.group}`}
                  checked={!excludedGroups.includes(currentGroup.group)}
                  onChange={() => toggleGroupExcluded(currentGroup.group)}
                >
                  Включать в отчёт
                </Checkbox>
              </div>
            </div>
            <div className={s.factors}>
              {currentGroup.factors.map((factor) => (
                <div key={factor.code} className={s.factor}>
                  <div className={s.factorInfo}>
                    <span className={s.name}>{factor.name}</span>
                    {editMode && (
                      <Button variant="outlineOrange" size="sm" className={s.editBtn} onClick={() => setEditing(factor)}>
                        Изменить
                      </Button>
                    )}
                  </div>
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
            <div className={s.editBar}>
              {editMode ? (
                <>
                  <Button variant="outlineOrange" onClick={() => addFactor(currentGroup.group)}>
                    Добавить фактор
                  </Button>
                  {catalog.customized && (
                    <Button variant="outlineOrange" onClick={resetCatalog}>
                      Сбросить факторы
                    </Button>
                  )}
                  <Button variant="primary" onClick={() => setEditMode(false)}>
                    Готово
                  </Button>
                </>
              ) : (
                <Button variant="outlineOrange" onClick={() => setEditMode(true)}>
                  Редактировать факторы
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      {editing && (
        <FactorEditorModal
          factor={editing}
          onSave={saveFactor}
          onDelete={deleteFactor}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
