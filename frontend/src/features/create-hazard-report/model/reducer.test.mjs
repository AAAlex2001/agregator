import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(".") && !specifier.endsWith(".ts")) {
      return nextResolve(`${specifier}.ts`, context);
    }

    return nextResolve(specifier, context);
  },
});

const { INITIAL_HAZARD_REPORT_FORM, hazardReportFormReducer } = await import("./reducer.ts");
const { getDefaultSelections } = await import(
  "../../../entities/hazard/model/selections.ts"
);

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
          options: [
            {
              value: 0,
              label: "От 51 до 100% (0,00)",
            },
            {
              value: null,
              label: "Нет (без оценки)",
            },
          ],
        },
      ],
    },
    {
      group: "R1",
      title: "Пожары",
      factors: [
        {
          code: "R1-1",
          group: "R1",
          name: "Запас горючих материалов",
          max_score: 0.22,
          default_value: null,
          options: [
            {
              value: 0.22,
              label: "Есть (0,22)",
            },
            {
              value: null,
              label: "Нет (без оценки)",
            },
          ],
        },
      ],
    },
  ],
};

test("Значения по умолчанию берутся из справочника для каждого фактора", () => {
  assert.deepEqual(getDefaultSelections(catalog), {
    "R0-1": 0,
    "R1-1": null,
  });
});

test("Другой профиль начинает выбор факторов и групп заново", () => {
  const state = hazardReportFormReducer({
    ...INITIAL_HAZARD_REPORT_FORM,
    selections: {
      "R0-1": 0.11,
    },
    excludedGroups: ["R1"],
  }, {
    type: "profile/change",
    profile: "shahta",
  });

  assert.equal(state.profile, "shahta");
  assert.deepEqual(state.selections, {});
  assert.deepEqual(state.excludedGroups, []);
});

test("Повторное переключение группы возвращает её в отчёт", () => {
  const excluded = hazardReportFormReducer(INITIAL_HAZARD_REPORT_FORM, {
    type: "group/toggle",
    group: "R2",
  });
  const included = hazardReportFormReducer(excluded, {
    type: "group/toggle",
    group: "R2",
  });

  assert.deepEqual(excluded.excludedGroups, ["R2"]);
  assert.deepEqual(included.excludedGroups, []);
});

test("Вариант без оценки сохраняется как null", () => {
  const state = hazardReportFormReducer(INITIAL_HAZARD_REPORT_FORM, {
    type: "option/select",
    code: "R0-1",
    value: null,
  });

  assert.equal(state.selections["R0-1"], null);
});

test("Правка шапки не меняет строки сертификата", () => {
  const state = hazardReportFormReducer(INITIAL_HAZARD_REPORT_FORM, {
    type: "header/change",
    field: "intro_line2",
    value: "на руднике «Мир»",
  });

  assert.equal(state.header.intro_line2, "на руднике «Мир»");
  assert.equal(state.header.certificate, INITIAL_HAZARD_REPORT_FORM.header.certificate);
});
