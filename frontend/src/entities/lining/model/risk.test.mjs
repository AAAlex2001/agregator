import assert from "node:assert/strict";
import test from "node:test";
import {
  getLiningRiskTone,
  getServiceLifeFraction,
  getShortLiningCategory,
} from "./risk.ts";

test("Цвет риска следует лингвистической категории сервера", () => {
  assert.equal(getLiningRiskTone("Низкий уровень опасности (риска)"), "low");
  assert.equal(getLiningRiskTone("Умеренный уровень опасности (риска)"), "low");
  assert.equal(getLiningRiskTone("Средний уровень опасности (риска)"), "medium");
  assert.equal(getLiningRiskTone("Значительный уровень опасности (риска)"), "medium");
  assert.equal(getLiningRiskTone("Высокий уровень опасности (риска)"), "high");
  assert.equal(getLiningRiskTone("Чрезвычайно высокий уровень опасности (риска)"), "high");
});

test("Короткая категория оставляет только название уровня", () => {
  assert.equal(getShortLiningCategory("Значительный уровень опасности (риска)"), "Значительный");
});

test("Шкала срока службы заполняется пропорционально двадцати годам", () => {
  assert.equal(getServiceLifeFraction(0), 0);
  assert.equal(getServiceLifeFraction(5), 0.25);
  assert.equal(getServiceLifeFraction(20), 1);
  assert.equal(getServiceLifeFraction(37.5), 1);
});
