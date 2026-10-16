import assert from "node:assert/strict";
import test from "node:test";
import { getCriteriaSections } from "./criteria.ts";
import {
  getDefaultElementCategories,
  getDefaultExpertScores,
  getDefaultLiningSelections,
} from "./defaults.ts";

const catalog = {
  profile: "rudnik",
  groups: [
    {
      group: "R0",
      title: "Человеческий фактор",
      factors: [
        {
          code: "R0-1",
          group: "R0",
          name: "Укомплектованность",
          max_score: 0.11,
          default_value: 0,
          options: [],
        },
        {
          code: "R0-2",
          group: "R0",
          name: "Квалификация",
          max_score: 0.22,
          default_value: null,
          options: [],
        },
      ],
    },
  ],
  elements: [
    {
      id: 1,
      group: "constructive",
      name: "Стержень (трос)",
    },
    {
      id: 2,
      group: "constructive",
      name: "Гайка",
    },
  ],
  element_group_titles: {
    constructive: "Конструктивные параметры (элементы крепи)",
  },
  damage_categories: [],
  expert_criteria: [
    {
      id: 1,
      section: "Проектирование",
      name: "Соответствие паспорту",
      weight: 0.2,
    },
    {
      id: 2,
      section: "Монтаж",
      name: "Натяжение анкеров",
      weight: 0.5,
    },
    {
      id: 3,
      section: "Проектирование",
      name: "Расчёт нагрузок",
      weight: 0.3,
    },
  ],
  expert_score_labels: {},
};

test("Факторы риска берут значения по умолчанию из справочника", () => {
  assert.deepEqual(getDefaultLiningSelections(catalog), {
    "R0-1": 0,
    "R0-2": null,
  });
});

test("Элементы крепи начинают с первой категории, условия — с балла 1", () => {
  assert.deepEqual(getDefaultElementCategories(catalog), { 1: 1, 2: 1 });
  assert.deepEqual(getDefaultExpertScores(catalog), { 1: 1, 2: 1, 3: 1 });
});

test("Условия собираются в разделы по порядку первого появления", () => {
  const sections = getCriteriaSections(catalog.expert_criteria);

  assert.deepEqual(sections.map((section) => section.title), ["Проектирование", "Монтаж"]);
  assert.deepEqual(sections[0].criteria.map((criterion) => criterion.id), [1, 3]);
  assert.deepEqual(sections[1].criteria.map((criterion) => criterion.id), [2]);
});
