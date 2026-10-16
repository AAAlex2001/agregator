import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";

const sourceRoot = new URL("../../../", import.meta.url);
const responseApi = new URL("entities/response/api/respond-to-order.ts", sourceRoot);
const innModule = new URL("entities/company/model/is-valid-inn.ts", sourceRoot);
const reactModule = `data:text/javascript,${encodeURIComponent(`
  export function useReducer(reducer, initial) {
    const runtime = globalThis.respondFormTest;
    runtime.fields ??= initial;
    return [runtime.fields, action => { runtime.fields = reducer(runtime.fields, action); }];
  }
  export function useState(initial) {
    const runtime = globalThis.respondFormTest;
    runtime.pending ??= initial;
    return [runtime.pending, value => { runtime.pending = value; }];
  }
`)}`;
const responseModule = `data:text/javascript,${encodeURIComponent(`
  export { respondToOrder } from ${JSON.stringify(responseApi.href)};
  export function useResponseFiles() { return globalThis.respondFormTest.attachments; }
`)}`;
const companyModule = `data:text/javascript,${encodeURIComponent(`
  export { isValidInn } from ${JSON.stringify(innModule.href)};
`)}`;
const notificationsModule = `data:text/javascript,${encodeURIComponent(`
  export function useNotifications() {
    return { showError: message => globalThis.respondFormTest.errors.push(message) };
  }
`)}`;

registerHooks({
  resolve(specifier, context, nextResolve) {
    const replacement = {
      react: reactModule,
      "@/entities/response": responseModule,
      "@/entities/company": companyModule,
      "@/shared/ui/notifications": notificationsModule,
    }[specifier];

    if (replacement) {
      return { url: replacement, shortCircuit: true };
    }

    let url;

    if (specifier.startsWith("@/")) {
      url = new URL(`${specifier.slice(2)}.ts`, sourceRoot);
    } else if (specifier.startsWith(".") && context.parentURL) {
      url = new URL(`${specifier}.ts`, context.parentURL);
    }

    return url && existsSync(url)
      ? nextResolve(url.href, context)
      : nextResolve(specifier, context);
  },
});

const { useRespondForm } = await import("./use-respond-form.ts");
const { validateOffer } = await import("./validate-offer.ts");
const { INITIAL_OFFER_FIELDS, offerReducer } = await import("./reducer.ts");
const { isValidInn } = await import(innModule.href);
const order = {
  id: 42,
  start_date: "01.11.2026",
  date: "30.11.2026",
  sum_amount_raw: 1000000,
  requires_license: false,
};
const validFields = {
  ...INITIAL_OFFER_FIELDS,
  startDate: "2026-11-01",
  deadline: "2026-11-30",
  cost: "10000",
  comment: "Keep my draft",
};
const company = {
  value: "Company",
  unrestricted_value: "Full company name",
  data: { inn: "1234567890" },
};

/** Создаёт форму с настоящими reducer, валидацией и HTTP-отправкой. */
function createForm(fields = validFields, selectedOrder = order) {
  const runtime = {
    fields: { ...fields },
    errors: [],
    succeeded: 0,
    subscriptionRequired: 0,
    attachments: {
      files: [new File(["bytes"], "offer.pdf")],
      items: [{ id: "offer.pdf", name: "offer.pdf", url: "blob:offer" }],
    },
  };
  globalThis.respondFormTest = runtime;
  const callbacks = {
    onResponded: () => { runtime.succeeded++; },
    onSubscriptionRequired: () => { runtime.subscriptionRequired++; },
  };

  /** Повторяет рендер хука после изменения черновика или состояния запроса. */
  function useTestForm() {
    return useRespondForm(selectedOrder, callbacks);
  }

  return {
    runtime,
    render: useTestForm,
  };
}

test("validation checks required fields, budget, dates and licensed company in source order", () => {
  const cases = [
    [{ startDate: "" }, "Укажите срок начала выполнения работ"],
    [{ deadline: "" }, "Укажите срок окончания выполнения работ"],
    [{ cost: "0" }, "Укажите стоимость работ"],
    [{ cost: "10001" }, "Стоимость не может превышать бюджет заказчика"],
    [{ startDate: "2026-10-31" }, "Срок начала выполнения работ не может быть раньше срока заказчика"],
    [{ deadline: "2026-12-01" }, "Срок окончания выполнения работ не может быть позже срока заказчика"],
    [{ startDate: "2026-11-20", deadline: "2026-11-10" }, "Срок начала выполнения работ не может быть позже срока окончания"],
  ];

  for (const [changes, error] of cases) {
    assert.equal(validateOffer(order, { ...validFields, ...changes }), error);
  }

  assert.equal(validateOffer(order, validFields), "");
  assert.equal(validateOffer({ ...order, sum_amount_raw: 0 }, { ...validFields, cost: "999999" }), "");
  assert.equal(validateOffer({ ...order, requires_license: true }, validFields), "Выберите вашу компанию из списка");
  assert.equal(validateOffer({ ...order, requires_license: true }, { ...validFields, company }), "");
  assert.equal(validateOffer({ ...order, start_date: "", date: "" }, validFields), "");
  assert.equal(validateOffer({ ...order, start_date: "2026-11-01", date: "2026-11-30" }, validFields), "");
});

test("company INN keeps the existing length and digit check", () => {
  for (const value of ["1234567890", "123456789012"]) {
    assert.equal(isValidInn(value), true);
  }

  for (const value of [null, undefined, "", "123456789", "12345678901", "1234567890123", "123456789x", " 123456789"]) {
    assert.equal(isValidInn(value), false);
  }
});

test("field handlers keep cost digits and reset the company after manual input", () => {
  const form = createForm();
  form.render().changeCost("12 345 ₽");
  assert.equal(form.render().fields.cost, "12345");
  form.render().changeCompany("query", company);
  assert.equal(form.render().fields.companyName, "Company");
  assert.equal(form.render().fields.company, company);
  form.render().changeCompany("Manual", null);
  assert.equal(form.render().fields.companyName, "Manual");
  assert.equal(form.render().fields.company, null);
  form.render().changeField("comment", "Updated");
  form.render().changeVatKind("VAT_7");
  assert.equal(form.render().fields.comment, "Updated");
  assert.equal(form.render().fields.vatKind, "VAT_7");
  assert.deepEqual(INITIAL_OFFER_FIELDS, offerReducer(INITIAL_OFFER_FIELDS, {
    type: "field/changed", field: "comment", value: "",
  }));
});

test("invalid draft does not send a request or remove files", async (context) => {
  let requests = 0;
  context.mock.method(globalThis, "fetch", async () => { requests++; });
  const form = createForm({ ...validFields, startDate: "" });
  await form.render().submit();
  assert.equal(requests, 0);
  assert.equal(form.runtime.errors[0], "Укажите срок начала выполнения работ");
  assert.equal(form.render().files.length, 1);
});

test("submission blocks a second rendered submit and sends kopecks with licensed company", async (context) => {
  let finish;
  const requests = [];
  context.mock.method(globalThis, "fetch", (url, options) => {
    requests.push(options);
    return new Promise((resolve) => { finish = resolve; });
  });
  const form = createForm({ ...validFields, company }, { ...order, requires_license: true });
  const sending = form.render().submit();
  assert.equal(form.render().isSubmitting, true);
  await form.render().submit();
  assert.equal(requests.length, 1);
  assert.equal(requests[0].body.get("proposed_sum_amount"), "1000000");
  assert.equal(requests[0].body.get("expert_inn"), company.data.inn);
  assert.deepEqual(JSON.parse(requests[0].body.get("expert_company_data")), company);
  finish(new Response(null, { status: 201 }));
  await sending;
  assert.equal(form.runtime.succeeded, 1);
  assert.equal(form.render().isSubmitting, false);
});

test("failed request preserves draft and files and can be retried successfully", async (context) => {
  let requests = 0;
  context.mock.method(globalThis, "fetch", async () => {
    requests++;
    return requests === 1
      ? Response.json({ detail: "Server failure" }, { status: 500 })
      : new Response(null, { status: 201 });
  });
  const form = createForm();
  const files = form.runtime.attachments.items;
  await form.render().submit();
  assert.equal(form.runtime.succeeded, 0);
  assert.deepEqual(form.render().fields, validFields);
  assert.equal(form.render().files, files);
  assert.equal(form.runtime.errors[0], "Server failure");
  await form.render().submit();
  assert.equal(form.runtime.succeeded, 1);
  assert.equal(requests, 2);
});

test("subscription message requests navigation and unlicensed offers omit stored company", async (context) => {
  let body;
  context.mock.method(globalThis, "fetch", async (url, options) => {
    body = options.body;
    return Response.json({ detail: "Нет активной подписки" }, { status: 402 });
  });
  const form = createForm({ ...validFields, company });
  await form.render().submit();
  assert.equal(body.get("expert_inn"), "");
  assert.equal(body.get("expert_company_data"), "{}");
  assert.equal(form.runtime.subscriptionRequired, 1);
  assert.equal(form.runtime.succeeded, 0);
  assert.deepEqual(form.render().fields.company, company);
});
