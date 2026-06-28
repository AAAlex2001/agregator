"use client";

import { useState } from "react";
import Button from "@/source/shared/ui/Button";
import Loader from "@/source/shared/ui/Loader";
import Tabs from "@/source/shared/ui/Tabs";
import { Checkbox } from "@/source/shared/ui";
import { TextInput } from "@/source/shared/ui/Inputs";
import { ChatChevronDownIcon } from "@/source/shared/ui/icons";
import type { LiningCriterion } from "@/source/entities/lining";
import { useLiningCalculator } from "../model/useLiningCalculator";
import s from "./LiningCalculator.module.scss";

const ELEMENT_GROUP_ORDER = ["constructive", "mining", "geological"];

function shortCategory(description: string): string {
  return description.split(/[.,]/)[0];
}

function groupBySection(criteria: LiningCriterion[]): { title: string; items: LiningCriterion[] }[] {
  const sections: { title: string; items: LiningCriterion[] }[] = [];
  criteria.forEach((criterion) => {
    let section = sections.find((entry) => entry.title === criterion.section);
    if (!section) {
      section = { title: criterion.section, items: [] };
      sections.push(section);
    }
    section.items.push(criterion);
  });
  return sections;
}

export function LiningCalculator() {
  const {
    catalog,
    selections,
    select,
    elementCategories,
    setElementCategory,
    serviceLifeYears,
    setServiceLife,
    expertScores,
    setExpertScore,
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
  } = useLiningCalculator();
  const [section, setSection] = useState("elements");
  const [activeGroup, setActiveGroup] = useState("R0");
  const [lifeYears, setLifeYears] = useState(String(serviceLifeYears));

  const currentGroup = catalog?.groups.find((group) => group.group === activeGroup) ?? catalog?.groups[0];
  const scoreOptions = [1, 2, 3, 4, 5];

  return (
    <div className={s.panel}>
      <div className={s.head}>
        <div className={s.actions}>
          <label className={s.field}>
            <span className={s.label}>Название отчёта:</span>
            <TextInput value={reportName} onChange={(e) => setReportName(e.target.value)} className={s.nameInput} />
          </label>
          <label className={s.field}>
            <span className={s.label}>Срок эксплуатации t<sub>ф</sub>, лет:</span>
            <TextInput
              className={s.numInput}
              value={lifeYears}
              inputMode="decimal"
              placeholder="5"
              onChange={(e) => {
                const next = e.target.value.replace(/[^\d.,]/g, "");
                setLifeYears(next);
                setServiceLife(Number(next.replace(",", ".")) || 0);
              }}
            />
          </label>
          <Button variant="outlineOrange" className={s.actionBtn} onClick={calculate} isLoading={calculating}>
            Рассчитать
          </Button>
          <Button variant="primary" className={s.actionBtn} onClick={generate} isLoading={generating}>
            Сформировать PDF
          </Button>
        </div>

        <details className={s.headerBlock}>
          <summary className={s.headerSummary}>
            <span>Шапка отчёта (для PDF)</span>
            <ChatChevronDownIcon className={s.headerChevron} />
          </summary>
          <div className={s.headerFields}>
            <label className={s.headerField}>
              <span className={s.headerLabel}>Автор</span>
              <TextInput value={header.author} onChange={(e) => setHeaderField("author", e.target.value)} placeholder="ФИО автора" />
            </label>
            <label className={s.headerField}>
              <span className={s.headerLabel}>Объект (строка 2 шапки)</span>
              <TextInput value={header.intro_line2} onChange={(e) => setHeaderField("intro_line2", e.target.value)} placeholder="на руднике / шахте …" />
            </label>
            <label className={s.headerField}>
              <span className={s.headerLabel}>Обоснование</span>
              <textarea className={s.headerArea} rows={3} value={header.justification} onChange={(e) => setHeaderField("justification", e.target.value)} />
            </label>
          </div>
        </details>

        <Tabs
          variant="pill"
          className={s.sectionTabs}
          activeTab={section}
          onTabChange={setSection}
          tabs={[
            { id: "elements", label: "Элементы крепи" },
            { id: "factors", label: "Факторы риска" },
            { id: "expert", label: "Экспертная оценка" },
          ]}
        />
      </div>

      <div className={s.body}>
        {loading || !catalog ? (
          <div className={s.loaderWrap}>
            <Loader label="" size="lg" />
          </div>
        ) : (
          <>
            {result && (
              <div className={s.result}>
                <h3 className={s.resultTitle}>Результат оценки</h3>
                <div className={s.figures}>
                  <div className={s.figure}>
                    <span className={s.figLabel}>Срок до капитального ремонта</span>
                    <span className={s.figValue}>{result.final_capital.toFixed(1)} лет</span>
                  </div>
                  <div className={s.figure}>
                    <span className={s.figLabel}>Срок до аварийного состояния</span>
                    <span className={s.figValue}>{result.final_emergency.toFixed(1)} лет</span>
                  </div>
                  <div className={s.figure}>
                    <span className={s.figLabel}>Экспертная надёжность β</span>
                    <span className={s.figValue}>{result.beta.toFixed(2)}</span>
                  </div>
                </div>

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
                      <td>Показатель риска на выработке (R)</td>
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

                <table className={s.resultTable}>
                  <thead>
                    <tr>
                      <th>№</th>
                      <th>Элемент крепи</th>
                      <th>Кат.</th>
                      <th>λ</th>
                      <th>Срок до капремонта, лет</th>
                      <th>Срок до аварии, лет</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.elements.map((element) => (
                      <tr key={element.element_id}>
                        <td className={s.center}>{element.element_id}</td>
                        <td>{element.name}</td>
                        <td className={s.center}>{element.category}</td>
                        <td className={s.center}>{element.lam.toFixed(4)}</td>
                        <td className={s.center}>{element.t_capital === null ? "Не требует" : element.t_capital.toFixed(3)}</td>
                        <td className={s.center}>{element.t_emergency === null ? "Не требует" : element.t_emergency.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {section === "elements" && (
              <div className={s.sectionBody}>
                <p className={s.hint}>
                  Выберите категорию технического состояния (1 — нормальное, 5 — аварийное) для каждого элемента крепи.
                </p>
                {ELEMENT_GROUP_ORDER.map((groupKey) => {
                  const elements = catalog.elements.filter((element) => element.group === groupKey);
                  if (elements.length === 0) return null;
                  return (
                    <div key={groupKey} className={s.elementGroup}>
                      <h4 className={s.subhead}>{catalog.element_group_titles[groupKey]}</h4>
                      <div className={s.factors}>
                        {elements.map((element) => (
                          <div key={element.id} className={s.factor}>
                            <span className={s.name}>{element.name}</span>
                            <div className={s.options}>
                              {catalog.damage_categories.map((category) => (
                                <Checkbox
                                  key={category.id}
                                  id={`el-${element.id}-${category.id}`}
                                  checked={elementCategories[String(element.id)] === category.id}
                                  onChange={() => setElementCategory(element.id, category.id)}
                                >
                                  {category.id}. {shortCategory(category.description)}
                                </Checkbox>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {section === "factors" && currentGroup && (
              <div className={s.sectionBody}>
                <Tabs
                  className={s.groupTabs}
                  activeTab={currentGroup.group}
                  onTabChange={setActiveGroup}
                  tabs={catalog.groups.map((group) => ({ id: group.group, label: group.group }))}
                />
                <h4 className={s.subhead}>
                  {currentGroup.group} · {currentGroup.title}
                </h4>
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
              </div>
            )}

            {section === "expert" && (
              <div className={s.sectionBody}>
                <p className={s.hint}>
                  Оцените каждое условие надёжности баллом от 1 (неприемлемо) до 5 (отлично). Сумма удельных весов условий равна 1.
                </p>
                {groupBySection(catalog.expert_criteria).map((expertSection) => (
                  <div key={expertSection.title} className={s.elementGroup}>
                    <h4 className={s.subhead}>{expertSection.title}</h4>
                    <div className={s.factors}>
                      {expertSection.items.map((criterion) => (
                        <div key={criterion.id} className={s.factor}>
                          <span className={s.name}>
                            {criterion.name}
                            <span className={s.weight}>удельный вес {criterion.weight.toFixed(2)}</span>
                          </span>
                          <div className={s.scoreRow}>
                            {scoreOptions.map((score) => (
                              <Checkbox
                                key={score}
                                id={`crit-${criterion.id}-${score}`}
                                checked={expertScores[String(criterion.id)] === score}
                                onChange={() => setExpertScore(criterion.id, score)}
                              >
                                {score}
                              </Checkbox>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
