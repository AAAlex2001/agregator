import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";

const sourceRoot = new URL("../../../", import.meta.url);
const responseApi = new URL("entities/response/api/respond-to-order.ts", sourceRoot);
const offerModel = new URL("entities/response/model/offer.ts", sourceRoot);
const innModule = new URL("entities/company/model/is-valid-inn.ts", sourceRoot);
const reactModule = `data:text/javascript,${encodeURIComponent(`
  function slot(create) {
    const runtime = globalThis.respondFormTest;
    const index = runtime.cursor++;
    if (!(index in runtime.slots)) runtime.slots[index] = create();
    return index;
  }
  export function useReducer(reducer, initial, init) {
    const runtime = globalThis.respondFormTest;
    const index = slot(() => (init ? init(initial) : initial));
    return [runtime.slots[index], action => { runtime.slots[index] = reducer(runtime.slots[index], action); }];
  }
  export function useState(initial) {
    const runtime = globalThis.respondFormTest;
    const index = slot(() => initial);
    return [runtime.slots[index], value => { runtime.slots[index] = value; }];
  }
`)}`;
const responseModule = `data:text/javascript,${encodeURIComponent(`
  export { respondToOrder } from ${JSON.stringify(responseApi.href)};
  export * from ${JSON.stringify(offerModel.href)};
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

globalThis.window = { scrollTo() {} };

const { useRespondForm } = await import("./use-respond-form.ts");
const { getResponseTermsError, EMPTY_RESPONSE_OFFER } = await import(offerModel.href);
const order = {
  id: 42,
  start_date: "01.11.2026",
  date: "30.11.2026",
  sum_amount_raw: 1000000,
  requires_license: false,
};
const bounds = { startDate: order.start_date, deadline: order.date, budget: order.sum_amount_raw };
const validTerms = {
  ...EMPTY_RESPONSE_OFFER,
  startDate: "2026-11-01",
  deadline: "2026-11-30",
  cost: "10000",
};
const company = {
  value: "Company",
  unrestricted_value: "Full company name",
  data: { inn: "1234567890" },
};
const event = { preventDefault() {} };

/** Форма с настоящими шагами, проверками и HTTP-отправкой. */
function createForm(selectedOrder = order) {
  const runtime = {
    slots: {},
    cursor: 0,
    errors: [],
    succeeded: 0,
    subscriptionRequired: 0,
    attachments: {
      files: [new File(["bytes"], "offer.pdf")],
      items: [{ id: "offer.pdf", name: "offer.pdf", url: "blob:offer" }],
      addFiles() {},
    },
  };
  const callbacks = {
    onResponded: () => { runtime.succeeded++; },
    onSubscriptionRequired: () => { runtime.subscriptionRequired++; },
  };

  /** Повторяет рендер хука после изменения состояния. */
  function useTestForm() {
    globalThis.respondFormTest = runtime;
    runtime.cursor = 0;
    return useRespondForm(selectedOrder, callbacks);
  }

  /** Заполняет сроки и стоимость. */
  function fillTerms() {
    const render = useTestForm;

    render().dispatch({ type: "field/changed", field: "startDate", value: validTerms.startDate });
    render().dispatch({ type: "field/changed", field: "deadline", value: validTerms.deadline });
    render().dispatch({ type: "cost/changed", value: "10 000 ₽" });
  }

  const render = useTestForm;

  return { runtime, render, fillTerms, press: () => render().submit(event) };
}

test("terms check required fields, budget and dates in the customer's frame", () => {
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
    assert.equal(getResponseTermsError({ ...validTerms, ...changes }, bounds), error);
  }

  assert.equal(getResponseTermsError(validTerms, bounds), "");
  assert.equal(getResponseTermsError({ ...validTerms, cost: "999999" }, { ...bounds, budget: 0 }), "");
  assert.equal(getResponseTermsError(validTerms, { startDate: "", deadline: "", budget: 0 }), "");
});

test("company step appears only when the customer needs a license", () => {
  assert.deepEqual(createForm().render().keys, ["conditions", "terms", "comment"]);
  assert.deepEqual(
    createForm({ ...order, requires_license: true }).render().keys,
    ["conditions", "terms", "company", "comment"],
  );
});

test("each step is checked before the next opens and the draft is kept", async () => {
  const form = createForm();
  await form.press();
  assert.equal(form.render().steps.step, 1);
  await form.press();
  assert.equal(form.render().steps.step, 1);
  assert.equal(form.runtime.errors[0], "Укажите срок начала выполнения работ");
  form.fillTerms();
  assert.equal(form.render().offer.cost, "10000");
  await form.press();
  assert.equal(form.render().steps.step, 2);
  assert.equal(form.render().steps.isLast, true);
});

test("licensed order needs a company from the list and sends it with kopecks", async (context) => {
  let finish;
  const requests = [];
  context.mock.method(globalThis, "fetch", (url, options) => {
    requests.push(options);
    return new Promise((resolve) => { finish = resolve; });
  });
  const form = createForm({ ...order, requires_license: true });
  await form.press();
  form.fillTerms();
  await form.press();
  await form.press();
  assert.equal(form.render().steps.step, 2);
  assert.equal(form.runtime.errors.at(-1), "Выберите вашу компанию из списка");
  form.render().changeCompany("Manual", null);
  assert.equal(form.render().choice.name, "Manual");
  form.render().changeCompany("query", company);
  assert.equal(form.render().choice.name, "Company");
  await form.press();
  const sending = form.press();
  assert.equal(form.render().isSubmitting, true);
  await form.press();
  assert.equal(requests.length, 1);
  assert.equal(requests[0].body.get("proposed_sum_amount"), "1000000");
  assert.equal(requests[0].body.get("expert_inn"), company.data.inn);
  assert.deepEqual(JSON.parse(requests[0].body.get("expert_company_data")), company);
  finish(new Response(null, { status: 201 }));
  await sending;
  assert.equal(form.runtime.succeeded, 1);
  assert.equal(form.render().isSubmitting, false);
});

test("failed request keeps the draft and a subscription refusal leads to tariffs", async (context) => {
  let requests = 0;
  context.mock.method(globalThis, "fetch", async () => {
    requests++;
    return Response.json({ detail: "Нет активной подписки" }, { status: 402 });
  });
  const form = createForm();
  await form.press();
  form.fillTerms();
  await form.press();
  await form.press();
  assert.equal(requests, 1);
  assert.equal(form.runtime.errors.at(-1), "Нет активной подписки");
  assert.equal(form.runtime.subscriptionRequired, 1);
  assert.equal(form.runtime.succeeded, 0);
  assert.equal(form.render().offer.cost, "10000");
  assert.equal(form.render().files.length, 1);
});