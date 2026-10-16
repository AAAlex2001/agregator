import assert from "node:assert/strict";
import test from "node:test";
import { getHazardRiskTone, getShortHazardCategory } from "./risk.ts";

test("low and moderate categories are shown as low risk", () => {
  assert.equal(getHazardRiskTone("Низкий уровень опасности (риска)"), "low");
  assert.equal(getHazardRiskTone("Умеренный уровень опасности (риска)"), "low");
});

test("medium and significant categories are shown as medium risk", () => {
  assert.equal(getHazardRiskTone("Средний уровень опасности (риска)"), "medium");
  assert.equal(getHazardRiskTone("Значительный уровень опасности (риска)"), "medium");
});

test("high and extremely high categories are shown as high risk", () => {
  assert.equal(getHazardRiskTone("Высокий уровень опасности (риска)"), "high");
  assert.equal(getHazardRiskTone("Чрезвычайно высокий уровень опасности (риска)"), "high");
});

test("short category drops the level tail and keeps other text", () => {
  assert.equal(getShortHazardCategory("Средний уровень опасности (риска)"), "Средний");
  assert.equal(
    getShortHazardCategory("Чрезвычайно высокий уровень опасности (риска)"),
    "Чрезвычайно высокий",
  );
  assert.equal(getShortHazardCategory("Высокий"), "Высокий");
});
