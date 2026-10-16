import assert from "node:assert/strict";
import test from "node:test";
import { INITIAL_LINING_REPORT_FORM, liningReportFormReducer } from "./reducer.ts";
import { cleanServiceLife, toServiceLifeYears } from "./service-life.ts";

test("Срок эксплуатации принимает только цифры и десятичный разделитель", () => {
  assert.equal(cleanServiceLife("7,5 лет"), "7,5");
  assert.equal(cleanServiceLife("12.25"), "12.25");
  assert.equal(cleanServiceLife("abc"), "");
});

test("Срок с запятой переводится в годы, пустой ввод даёт 0", () => {
  assert.equal(toServiceLifeYears("7,5"), 7.5);
  assert.equal(toServiceLifeYears("5"), 5);
  assert.equal(toServiceLifeYears(""), 0);
  assert.equal(toServiceLifeYears("1,2,3"), 0);
});

test("Категория элемента и балл условия хранятся по id", () => {
  const withCategory = liningReportFormReducer(INITIAL_LINING_REPORT_FORM, {
    type: "element/select",
    elementId: 2,
    category: 4,
  });
  const withScore = liningReportFormReducer(withCategory, {
    type: "score/select",
    criterionId: 7,
    score: 5,
  });

  assert.deepEqual(withScore.elementCategories, { 2: 4 });
  assert.deepEqual(withScore.expertScores, { 7: 5 });
});

test("Вариант фактора без оценки сохраняется как null", () => {
  const state = liningReportFormReducer(INITIAL_LINING_REPORT_FORM, {
    type: "option/select",
    code: "R2-1",
    value: null,
  });

  assert.equal(state.selections["R2-1"], null);
});

test("Правка шапки меняет только выбранную строку", () => {
  const state = liningReportFormReducer(INITIAL_LINING_REPORT_FORM, {
    type: "header/change",
    field: "author",
    value: "Иванов И. И.",
  });

  assert.equal(state.header.author, "Иванов И. И.");
  assert.equal(state.header.intro_line2, "");
});
