import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";

const sourceRoot = new URL("../../", import.meta.url);

registerHooks({
  resolve(specifier, context, nextResolve) {
    const url = specifier.startsWith("@/") ? new URL(`${specifier.slice(2)}.ts`, sourceRoot) : null;

    return url && existsSync(url) ? nextResolve(url.href, context) : nextResolve(specifier, context);
  },
});

const { readApiError } = await import("../api/response-error.ts");
const { toStepError } = await import("./step-error.ts");

const places = [
  { path: "price", step: "price", label: "Цена" },
  { path: "company", step: "customer", label: "Реквизиты организации" },
  { path: "company.inn", step: "customer", label: "ИНН" },
  { path: "individual.passport_number", step: "customer", label: "Серия и номер паспорта" },
];
const titles = { price: "Цена", customer: "Заказчик" };
const titleOf = (step) => titles[step];

test("validation errors keep the field path without FastAPI service parts", async () => {
  const response = Response.json({
    detail: [
      { loc: ["body", "payload", "company", "inn"], msg: "Обязательное поле", type: "missing" },
      { loc: ["body", "price"], msg: "Должно быть больше 0", type: "greater_than" },
    ],
  }, { status: 422 });

  const error = await readApiError(response, "Не удалось");

  assert.equal(error.message, "Обязательное поле");
  assert.deepEqual(error.fields.map((field) => field.path), ["company.inn", "price"]);
  assert.deepEqual(toStepError(error, places, titleOf, "Не удалось"), {
    step: "customer",
    message: "Шаг «Заказчик»: ИНН: Обязательное поле",
  });
});

test("scenario error names its field and is shown without a second label", async () => {
  const response = Response.json({
    detail: "Серия и номер паспорта — 10 цифр",
    field: "individual.passport_number",
  }, { status: 422 });

  const located = toStepError(await readApiError(response, "Не удалось"), places, titleOf, "Не удалось");

  assert.deepEqual(located, {
    step: "customer",
    message: "Шаг «Заказчик»: Серия и номер паспорта — 10 цифр",
  });
});

test("unknown fields and network failures keep the plain message", async () => {
  const response = Response.json({ detail: "Нет активной подписки" }, { status: 402 });

  assert.deepEqual(toStepError(await readApiError(response, "Не удалось"), places, titleOf, "Не удалось"), {
    step: null,
    message: "Нет активной подписки",
  });
  assert.deepEqual(toStepError(new Error("Нет связи с сервером"), places, titleOf, "Не удалось"), {
    step: null,
    message: "Нет связи с сервером",
  });
  assert.deepEqual(toStepError("oops", places, titleOf, "Не удалось"), { step: null, message: "Не удалось" });
});