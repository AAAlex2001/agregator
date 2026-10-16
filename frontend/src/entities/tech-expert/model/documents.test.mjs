import assert from "node:assert/strict";
import test from "node:test";
import {
  formatTechExpertDate,
  getTechExpertAccessLabel,
  getTechExpertDocumentMeta,
} from "./documents.ts";

test("Дата фонда показывается по-русски, неполная остаётся как есть", () => {
  assert.equal(formatTechExpertDate("2024-03-05"), "05.03.2024");
  assert.equal(formatTechExpertDate("2024"), "2024");
  assert.equal(formatTechExpertDate(null), "");
});

test("Реквизиты собираются через точку без пустых значений", () => {
  const document = {
    id: 1,
    name: "ГОСТ Р 12.0.001",
    status: null,
    doctype: "ГОСТ",
    number: null,
    date: "2013-11-01",
    department: "Росстандарт",
    access: "full",
  };

  assert.equal(getTechExpertDocumentMeta(document), "ГОСТ · 01.11.2013 · Росстандарт");
});

test("Уровень доступа получает русскую подпись", () => {
  assert.equal(getTechExpertAccessLabel("full"), "Полный доступ");
  assert.equal(getTechExpertAccessLabel("card"), "Карточка");
  assert.equal(getTechExpertAccessLabel("restricted"), "Ограничен");
  assert.equal(getTechExpertAccessLabel("demo"), "demo");
});
