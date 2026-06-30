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
import s from "./HazardCalculator.module.scss";

export function HazardCalculator({ onSaved }: { onSaved?: () => void }) {
  const {
    profile,
    setProfile,
    catalog,
    selections,
    select,
    excludedGroups,
    toggleGroupExcluded,
    reportName,
    setReportName,
    header,
    setHeaderField,
    loading,
    saving,
    save,
  } = useHazardCalculator(onSaved);
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
            <div className={s.btnGroup}>
              <Button variant="primary" className={s.actionBtn} onClick={save} isLoading={saving}>
                Сформировать отчёт
              </Button>
            </div>
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
                placeholder="Введите объект — например, на руднике «Мир» / в шахте «Северная»"
              />
            </label>
            <label className={s.headerField}>
              <span className={s.headerLabel}>Обоснование</span>
              <textarea
                className={s.headerArea}
                rows={3}
                value={header.justification}
                onChange={(e) => setHeaderField("justification", e.target.value)}
                placeholder="Опишите обоснование безопасности объекта и проводимых работ"
              />
            </label>
            <label className={s.headerField}>
              <span className={s.headerLabel}>Сертификат</span>
              <textarea
                className={s.headerArea}
                rows={2}
                value={header.certificate}
                readOnly
              />
            </label>
          </div>
        </details>

      </div>

      <div className={s.body}>
        {loading || !catalog || !currentGroup ? (
          <div className={s.loaderWrap}>
            <Loader label="" size="lg" />
          </div>
        ) : (
          <>
            <Tabs
              className={s.groupTabs}
              activeTab={currentGroup.group}
              onTabChange={setActiveGroup}
              tabs={catalog.groups.map((group) => ({ id: group.group, label: group.group }))}
            />
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
          </>
        )}
      </div>
    </div>
  );
}
