import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";

const sourceRoot = new URL("../../../", import.meta.url);
const providerUrl = new URL("./order-form-provider.tsx", import.meta.url).href;
const providerModule = `data:text/javascript,${encodeURIComponent(`
  export function useOrderFormContext() {
    return globalThis.orderFormContext;
  }
`)}`;
const notificationsModule = `data:text/javascript,${encodeURIComponent(`
  export function useNotifications() {
    return globalThis.orderFormNotifications;
  }
`)}`;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "@/shared/ui/notifications") {
      return { url: notificationsModule, shortCircuit: true };
    }

    let url;

    if (specifier.startsWith("@/")) {
      url = new URL(`${specifier.slice(2)}.ts`, sourceRoot);
    } else if (specifier.startsWith(".") && context.parentURL) {
      url = new URL(`${specifier}.ts`, context.parentURL);
    }

    if (url?.href.replace(/\.ts$/, ".tsx") === providerUrl) {
      return { url: providerModule, shortCircuit: true };
    }

    return url && existsSync(url)
      ? nextResolve(url.href, context)
      : nextResolve(specifier, context);
  },
});

const { createOrderFormValues } = await import("./create-order-form-values.ts");
const { orderFormReducer } = await import("./order-form-reducer.ts");
const { getOrderFormDirection } = await import("./order-form-direction.ts");
const { useOrderFormFiles } = await import("./use-order-form-files.ts");
const { countOrderFormFiles } = await import("./order-form-files.ts");
const {
  getOrderPreviewCard,
  getOrderPreviewDocuments,
} = await import("./order-preview.ts");
const {
  getOrderDocumentsRequest,
  getOrderRequest,
} = await import("./order-form-request.ts");
const {
  findOrderFormProblem,
  getOrderFormSteps,
  getOrderStepError,
} = await import("./order-form-steps.ts");

const customer = {
  first_name: "Иван",
  last_name: "Иванов",
  inn: "1234567890",
  phone: "+79990000000",
  email: "user@example.test",
  company_data: { value: "ООО Пример" },
  directions: ["DESIGN", "AUDIT_SUPB"],
};
const source = {
  customer,
  badgeCodes: [],
  copySourceOrderId: null,
};

/** Соединяет настоящие операции с reducer; заменяется только React context. */
function createForm(initialValues = createOrderFormValues(source)) {
  let values = initialValues;
  let previewCount = 0;
  const errors = [];
  const removedPreviews = [];
  const context = {
    get values() {
      return values;
    },
    dispatch(action) {
      values = orderFormReducer(values, action);
    },
    createFilePreview(file) {
      return { file, previewUrl: `blob:test-${++previewCount}` };
    },
    removeFilePreview(selected) {
      removedPreviews.push(selected.previewUrl);
    },
  };

  return {
    get values() {
      return values;
    },
    errors,
    removedPreviews,
    dispatch: context.dispatch,
    useFormActions() {
      globalThis.orderFormContext = context;
      globalThis.orderFormNotifications = {
        showError: (message) => errors.push(message),
      };
      return useOrderFormFiles();
    },
  };
}

test("new forms use direction priority and do not share mutable defaults", () => {
  const first = createOrderFormValues(source);
  const second = createOrderFormValues(source);

  assert.equal(first.workType, "AUDIT_SUPB");
  assert.equal(first.details.applicant_email, customer.email);
  assert.equal(first.details.applicant_full_name, "Иванов Иван");
  first.details.opo_items[0].name = "Объект";
  first.details.audit_areas.push("NEW");
  first.files.other.push({
    file: new File(["x"], "test.txt"),
    previewUrl: "blob:test",
  });
  assert.equal(second.details.opo_items[0].name, "");
  assert.deepEqual(second.details.audit_areas, []);
  assert.deepEqual(second.files.other, []);
});

test("copy and edit initialization preserve dates, raw documents and saved details", () => {
  const template = {
    id: 12,
    title: "Заказ",
    company: "Компания образца",
    start_date: "21.10.2026",
    date: "30.10.2026",
    responses_deadline: "2026-10-20T09:00:00Z",
    sum_amount_raw: 123450,
    comment: "Комментарий",
    work_type: "DESIGN",
    requires_expert: true,
    requires_license: false,
    details: { object_name: "Корпус", applicant_full_name: "Заявитель образца" },
    documents: { technical: ["uploads/task.pdf"], contract: [], company: [], other: [] },
  };
  const values = createOrderFormValues({
    ...source,
    template,
    badgeCodes: ["E1"],
    copySourceOrderId: template.id,
  });

  assert.equal(values.company, "ООО Пример");
  assert.equal(values.workType, "DESIGN");
  assert.equal(values.startDate, "2026-10-21");
  assert.equal(values.deadline, "2026-10-30");
  assert.equal(values.responsesDeadline, template.responses_deadline);
  assert.equal(values.budget, "1234.5");
  assert.equal(values.details.object_name, "Корпус");
  assert.equal(values.details.applicant_full_name, "Заявитель образца");
  assert.deepEqual(values.details.approvals, []);
  assert.equal(values.copySourceOrderId, 12);
  assert.equal(values.notifyResponders, true);
  assert.deepEqual(getOrderDocumentsRequest(values).existing.technical, ["uploads/task.pdf"]);
});

test("changing direction preserves general conditions and documents while clearing direction fields", () => {
  const form = createForm();
  const file = new File(["brief"], "task.pdf");
  form.dispatch({ type: "field/changed", field: "title", value: "Условия" });
  form.dispatch({ type: "badges/changed", codes: ["E1"] });
  form.dispatch({ type: "license/changed", isRequired: true });
  form.useFormActions().addFile("technical", file);
  form.dispatch({
    type: "details/changed",
    workType: "AUDIT_SUPB",
    details: { ...form.values.details, applicant_position: "Главный инженер" },
  });
  form.dispatch({ type: "direction/changed", workType: "DESIGN" });

  assert.equal(form.values.title, "Условия");
  assert.equal(form.values.files.technical.file, file);
  assert.equal(form.values.details.applicant_position, "Главный инженер");
  assert.equal(form.values.details.scope, "FULL");
  assert.equal("opo_items" in form.values.details, false);
  assert.equal(form.values.requiresExpert, true);
  assert.equal(form.values.requiresLicense, false);
  assert.deepEqual(form.values.badgeCodes, []);
});

test("file count includes saved documents, replacement preserves count and other files fill remaining slots", () => {
  const values = createOrderFormValues(source);
  values.documents.technical = ["uploads/old.pdf"];
  values.documents.other = ["uploads/one.pdf", "uploads/two.pdf"];
  const form = createForm(values);
  const replacement = new File(["new"], "new.pdf");
  const files = [1, 2, 3, 4].map((number) => new File([String(number)], `${number}.pdf`));
  form.useFormActions().addFile("technical", replacement);
  assert.deepEqual(form.values.documents.technical, []);
  form.useFormActions().addOtherFiles(files);
  assert.equal(countOrderFormFiles(form.values), 6);
  assert.deepEqual(form.values.files.other.map((selected) => selected.file), files.slice(0, 3));
  assert.equal(getOrderDocumentsRequest(form.values).files.technical, replacement);
  assert.match(form.errors[0], /не более 6 файлов/);
  form.useFormActions().addFile("contract", files[3]);
  assert.equal(form.values.files.contract, null);
  form.useFormActions().removeFile(replacement);
  form.useFormActions().removeOtherDocument("uploads/one.pdf");
  assert.equal(countOrderFormFiles(form.values), 4);
  assert.deepEqual(form.values.documents.other, ["uploads/two.pdf"]);
});

test("oversized additions retain current files and preserve the existing replacement size rule", () => {
  const form = createForm();
  const file = new File(["large"], "large.pdf");
  Object.defineProperty(file, "size", { value: 60 * 1024 * 1024 });
  form.useFormActions().addFile("technical", file);
  form.useFormActions().addFile("technical", file);
  form.useFormActions().addOtherFiles([file]);

  assert.equal(form.values.files.technical.file, file);
  assert.deepEqual(form.values.files.other, []);
  assert.equal(form.errors.length, 2);
  assert.match(form.errors[0], /не должен превышать 100 МБ/);
});

test("validation goes step by step and request conversion keeps kopecks and raw documents", () => {
  const form = createForm();
  assert.equal(form.values.requiresExpert, true);
  assert.equal(getOrderStepError("work", form.values), "");
  assert.deepEqual(findOrderFormProblem(form.values), {
    step: "main",
    message: "Укажите название заказа",
  });
  form.dispatch({ type: "field/changed", field: "title", value: "  Название  " });
  assert.match(findOrderFormProblem(form.values).message, /срок начала/);
  form.dispatch({ type: "field/changed", field: "startDate", value: "2026-10-21" });
  assert.match(findOrderFormProblem(form.values).message, /срок окончания/);
  form.dispatch({ type: "field/changed", field: "deadline", value: "2026-10-30" });
  form.dispatch({ type: "direction/changed", workType: "DESIGN" });
  assert.deepEqual(findOrderFormProblem(form.values), {
    step: "documents",
    message: "Приложите задание на проектирование",
  });
  form.useFormActions().addFile("technical", new File(["task"], "task.pdf"));
  form.dispatch({ type: "field/changed", field: "budget", value: "1234.5" });
  assert.equal(findOrderFormProblem(form.values), null);
  assert.equal(getOrderRequest(form.values).sum_amount, 123450);
  assert.equal(getOrderRequest(form.values).title, "Название");
});

test("expertise asks for executor or license and keeps the attestation step", () => {
  const form = createForm();
  form.dispatch({ type: "direction/changed", workType: "EXPERTISE" });
  form.dispatch({ type: "expert/changed", isRequired: false });
  form.dispatch({ type: "license/changed", isRequired: false });
  assert.match(getOrderStepError("work", form.values), /исполнитель и\/или лицензия/);
  assert.deepEqual(getOrderFormSteps(form.values), [
    "work",
    "main",
    "details",
    "experts",
    "documents",
    "comment",
  ]);
});

test("replacement releases its preview and removal releases every occurrence of the same File", () => {
  const form = createForm();
  const first = new File(["first"], "first.pdf");
  const replacement = new File(["replacement"], "replacement.pdf");
  form.useFormActions().addFile("technical", first);
  const firstUrl = form.values.files.technical.previewUrl;
  form.useFormActions().addFile("technical", replacement);
  const replacementUrl = form.values.files.technical.previewUrl;

  assert.deepEqual(form.removedPreviews, [firstUrl]);
  form.useFormActions().addOtherFiles([replacement]);
  const duplicateUrl = form.values.files.other[0].previewUrl;
  form.useFormActions().removeFile(replacement);

  assert.equal(form.values.files.technical, null);
  assert.deepEqual(form.values.files.other, []);
  assert.deepEqual(form.removedPreviews, [firstUrl, replacementUrl, duplicateUrl]);
});

test("preview follows all direction transitions without retaining previous direction fields", () => {
  const expectedFields = {
    AUDIT_SUPB: "audit_scale",
    CADASTRAL: "work_purpose",
    DESIGN: "object_name",
    ECOLOGY: "work_types",
    FORENSIC: "expertise_purpose",
    LABORATORY: "equipment_requirements",
    RESEARCH: "executor_requirements",
    SURVEY: "kinds",
    TECH_DIAG: "purpose",
  };
  const directions = ["EXPERTISE", ...Object.keys(expectedFields)];

  for (const initialDirection of directions) {
    for (const nextDirection of directions) {
      const form = createForm(createOrderFormValues({
        ...source,
        customer: { ...customer, directions: [initialDirection] },
      }));

      form.dispatch({ type: "direction/changed", workType: nextDirection });
      const preview = getOrderFormDirection(form.values);
      assert.equal(preview.work_type, nextDirection);

      if (nextDirection === "EXPERTISE") {
        assert.equal(preview.details, null);
        continue;
      }

      assert.equal(preview.details.applicant_email, customer.email);
      assert.equal(expectedFields[nextDirection] in preview.details, true);

      for (const [direction, field] of Object.entries(expectedFields)) {
        assert.equal(field in preview.details, direction === nextDirection);
      }

      form.dispatch({
        type: "details/changed",
        workType: nextDirection,
        details: { ...form.values.details, applicant_position: "Директор" },
      });
      assert.equal(getOrderFormDirection(form.values).details.applicant_position, "Директор");
    }
  }
});

test("late audit details do not replace conditions of another direction", () => {
  const form = createForm();
  const auditDetails = {
    ...form.values.details,
    sto_file: { name: "СТО.pdf", url: "/uploads/sto.pdf" },
  };

  form.dispatch({ type: "direction/changed", workType: "DESIGN" });
  const designValues = form.values;
  form.dispatch({
    type: "details/changed",
    workType: "AUDIT_SUPB",
    details: auditDetails,
  });

  assert.equal(form.values, designValues);
  assert.equal(form.values.details.scope, "FULL");
  assert.equal("sto_file" in form.values.details, false);
});

test("audit document updates preserve fields edited during upload", () => {
  const form = createForm();
  const document = { name: "СТО.pdf", url: "/uploads/sto.pdf" };

  for (const field of ["sto_file", "registration_certificate"]) {
    form.dispatch({
      type: "details/changed",
      workType: "AUDIT_SUPB",
      details: { ...form.values.details, comments: `Изменено для ${field}` },
    });
    form.dispatch({ type: "audit-document/changed", field, document });

    assert.equal(form.values.details[field], document);
    assert.equal(form.values.details.comments, `Изменено для ${field}`);
    form.dispatch({ type: "audit-document/changed", field, document: null });
    assert.equal(form.values.details[field], null);
    assert.equal(form.values.details.comments, `Изменено для ${field}`);
  }

  form.dispatch({ type: "direction/changed", workType: "DESIGN" });
  const designValues = form.values;
  form.dispatch({ type: "audit-document/changed", field: "sto_file", document });
  assert.equal(form.values, designValues);
});

test("preview formats current conditions and reuses existing file previews without mutating paths", () => {
  const values = createOrderFormValues(source);
  const rawPath = "uploads/original.pdf";
  const selected = {
    file: new File(["file"], "План #1.pdf"),
    previewUrl: "blob:existing-preview",
  };
  values.title = "  Новое название  ";
  values.company = "  Компания  ";
  values.startDate = "2026-10-21";
  values.deadline = "invalid";
  values.budget = "1234.5";
  values.documents.technical = [rawPath];
  values.files.technical = selected;
  const badges = [{ text: "1 ЭПБ", variant: "orange" }];
  const card = getOrderPreviewCard(values, "1234567890", badges);

  assert.equal(card.title, "Новое название");
  assert.equal(card.company, "Компания");
  assert.equal(card.customer_inn, "1234567890");
  assert.equal(card.start_date, "21.10.2026");
  assert.equal(card.date, "—");
  assert.equal(card.sum, `${(1234.5).toLocaleString("ru-RU")} ₽`);
  assert.equal(card.badges, badges);
  assert.equal(card.created_at_display, "");
  assert.equal(card.responses_deadline, null);
  assert.deepEqual(getOrderPreviewDocuments(values).technical, [
    rawPath,
    `blob:existing-preview#name=${encodeURIComponent(selected.file.name)}`,
  ]);
  assert.deepEqual(values.documents.technical, [rawPath]);
});
