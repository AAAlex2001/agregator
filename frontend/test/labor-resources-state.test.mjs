import assert from "node:assert/strict";
import test from "node:test";
import { initialLaborResourcesState, laborResourcesReducer } from "../source/features/labor-resources/model/resources.reducer.ts";

test("Смена вкладки сразу убирает предыдущие заявки до нового ответа API", () => {
  const previous = { ...initialLaborResourcesState, loading: false, items: [{ id: 1 }], error: "Старая ошибка" };
  const next = laborResourcesReducer(previous, { type: "TAB", value: "mine" });
  assert.equal(next.tab, "mine");
  assert.deepEqual(next.items, []);
  assert.equal(next.loading, true);
  assert.equal(next.error, null);
  assert.deepEqual(previous.items, [{ id: 1 }]);
});

test("Повторный выбор текущей вкладки не запускает вечную загрузку", () => {
  const state = { ...initialLaborResourcesState, loading: false, items: [{ id: 1 }] };
  assert.equal(laborResourcesReducer(state, { type: "TAB", value: "browse" }), state);
});
