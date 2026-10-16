import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { DISABLED_EMAIL_PREFERENCES } from "../config/email-preferences.ts";

const source = readFileSync(
  new URL("./use-disable-notifications.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
  },
}).outputText;

/** Запускает настоящий сценарий с контролируемыми ответами двух операций сущности. */
function createForm(role, failure = null, disabled = false) {
  const calls = [];
  const applied = [];
  const busy = [];
  const errors = [];
  const successes = [];
  const context = {
    exports: {},
    Error,
    require(path) {
      if (path === "../config/email-preferences") {
        return { DISABLED_EMAIL_PREFERENCES };
      }

      if (path === "@/shared/ui/notifications") {
        return {
          useNotifications: () => ({
            showError: (message) => errors.push(message),
            showSuccess: (message) => successes.push(message),
          }),
        };
      }

      assert.equal(path, "@/entities/user");
      return {
        useUser: () => ({ role }),
        useUpdateEmailPreferences: () => ({
          isSaving: false,
          async savePreferences(preferences) {
            calls.push("email");
            assert.equal(Object.keys(preferences).length, 10);
            assert.ok(Object.values(preferences).every((value) => value === false));
            if (failure === "email") throw new Error("Ошибка событий");
            applied.push("email");
          },
        }),
        useUpdateOrderNotifications: () => ({
          isSaving: false,
          async saveOrderTypes(orderTypes) {
            calls.push("orders");
            assert.equal(orderTypes.length, 0);
            if (failure === "orders") throw new Error("Ошибка фильтра");
            applied.push("orders");
          },
        }),
      };
    },
  };

  runInNewContext(compiled, context);
  const form = context.exports.useDisableNotifications({
    disabled,
    onBusyChange: (value) => busy.push(value),
  });

  return { form, calls, applied, busy, errors, successes };
}

test("Заказчику отключаются только почтовые события", async () => {
  const state = createForm("CUSTOMER");
  await state.form.disableAll();

  assert.deepEqual(state.calls, ["email"]);
  assert.deepEqual(state.applied, ["email"]);
  assert.deepEqual(state.busy, [true, false]);
  assert.deepEqual(state.successes, ["Все почтовые уведомления отключены"]);
});

test("Исполнителю последовательно отключаются события и новые заказы", async () => {
  const state = createForm("EXPERT");
  await state.form.disableAll();

  assert.deepEqual(state.calls, ["email", "orders"]);
  assert.deepEqual(state.applied, ["email", "orders"]);
  assert.deepEqual(state.busy, [true, false]);
  assert.equal(state.successes.length, 1);
});

test("Ошибка первого запроса не запускает второй и снимает блокировку", async () => {
  const state = createForm("EXPERT", "email");
  await state.form.disableAll();

  assert.deepEqual(state.calls, ["email"]);
  assert.deepEqual(state.applied, []);
  assert.deepEqual(state.errors, ["Ошибка событий"]);
  assert.deepEqual(state.busy, [true, false]);
  assert.equal(state.successes.length, 0);
});

test("Ошибка фильтра сохраняет уже применённые настройки событий", async () => {
  const state = createForm("EXPERT", "orders");
  await state.form.disableAll();

  assert.deepEqual(state.calls, ["email", "orders"]);
  assert.deepEqual(state.applied, ["email"]);
  assert.deepEqual(state.errors, ["Ошибка фильтра"]);
  assert.deepEqual(state.busy, [true, false]);
  assert.equal(state.successes.length, 0);
});

test("Общая блокировка не разрешает новую последовательность запросов", async () => {
  const state = createForm("EXPERT", null, true);
  await state.form.disableAll();

  assert.deepEqual(state.calls, []);
  assert.deepEqual(state.busy, []);
});
