import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import test from "node:test";
import ts from "typescript";
import { LEAD_DIRECTIONS } from "../../../entities/lead/config/directions.ts";
import { readResponseError } from "../../../shared/api/response-error.ts";
import { createLeadFormState, leadFormReducer } from "./reducer.ts";

/** Подключает модуль к контролируемым запросам и React-состоянию формы. */
function loadModule(file, dependencies, globals = {}) {
  const source = readFileSync(new URL(file, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
    },
  }).outputText;
  const context = {
    exports: {},
    Error,
    ...globals,
    require(name) {
      assert.ok(name in dependencies, name);
      return dependencies[name];
    },
  };

  runInNewContext(compiled, context);
  return context.exports;
}

/** Выполняет настоящий API заявки с подставленным ответом сервера. */
function createApi(fetch) {
  return loadModule("../../../entities/lead/api/submit-lead.ts", {
    "@/shared/config/api": { API_URL: "https://api.example.test" },
    "@/shared/api/response-error": { readResponseError },
  }, { fetch }).submitLead;
}

/** Сохраняет reducer между рендерами настоящего hook формы. */
function createForm(submitLead) {
  let state;
  const errors = [];
  const { useLeadForm } = loadModule("./use-lead-form.ts", {
    react: {
      useReducer(reducer, direction, initialize) {
        state ??= initialize(direction);

        return [
          state,
          (action) => {
            state = reducer(state, action);
          },
        ];
      },
    },
    "@/entities/lead": { LEAD_DIRECTIONS, submitLead },
    "@/shared/ui/notifications": {
      useNotifications: () => ({
        showError: (message) => errors.push(message),
      }),
    },
    "./reducer": { createLeadFormState, leadFormReducer },
  }, {
    window: {
      location: {
        href: "https://example.test/blog/article?from=test",
      },
    },
  });

  return {
    errors,
    get state() {
      return state;
    },
    render: useLeadForm,
  };
}

test("Смена направления сбрасывает виды работ и сохраняет контакты и задачу", () => {
  const form = createForm(async () => {});
  form.render("DESIGN").changeField("name", "Посетитель");
  form.render().changeField("task", "Описание задачи");
  form.render().changeKinds(["Первый вид работ", "Второй вид работ"]);
  form.render().changeDirection("ECOLOGY");

  assert.equal(form.state.fields.direction, "ECOLOGY");
  assert.deepEqual(form.state.fields.workKinds, []);
  assert.equal(form.state.fields.name, "Посетитель");
  assert.equal(form.state.fields.task, "Описание задачи");
  assert.equal(form.render("FORENSIC").direction.value, "ECOLOGY");
});

test("Отправка передаёт все поля API и блокирует повтор до ответа", async () => {
  let complete;
  const requests = [];
  const submitLead = createApi((url, options) => {
    requests.push({ url, options });
    return new Promise((resolve) => {
      complete = resolve;
    });
  });
  const form = createForm(submitLead);
  const values = {
    name: "Посетитель",
    phone: "+7-999-000-00-00",
    email: "mail@example.test",
    company: "Компания",
    inn: "1234567890",
    region: "Регион",
    objectName: "Здание",
    task: "Описание работ",
    deadline: "Октябрь",
    budget: "10000",
  };

  form.render("SURVEY");
  for (const [field, value] of Object.entries(values)) {
    form.render().changeField(field, value);
  }
  form.render().changeKinds(["Первый вид работ", "Второй вид работ"]);
  let prevented = false;
  const pending = form.render().submit({
    preventDefault() {
      prevented = true;
    },
  });
  await form.render().submit({ preventDefault() {} });

  assert.equal(prevented, true);
  assert.equal(requests.length, 1);
  assert.equal(form.state.isSending, true);
  assert.equal(requests[0].url, "https://api.example.test/public/leads");
  assert.equal(requests[0].options.method, "POST");
  assert.equal(requests[0].options.credentials, undefined);
  assert.deepEqual(JSON.parse(requests[0].options.body), {
    direction: "SURVEY",
    name: values.name,
    phone: values.phone,
    email: values.email,
    company: values.company,
    inn: values.inn,
    region: values.region,
    work_kinds: "Первый вид работ, Второй вид работ",
    object_name: values.objectName,
    task: values.task,
    deadline: values.deadline,
    budget: values.budget,
    source_url: "https://example.test/blog/article?from=test",
  });

  complete(Response.json({ ok: true }));
  await pending;
  assert.equal(form.state.isSending, false);
  assert.equal(form.state.isSent, true);
  await form.render().submit({ preventDefault() {} });
  assert.equal(requests.length, 1);
});

test("Ошибка API сохраняет черновик и допускает повторную отправку", async () => {
  let attempts = 0;
  const form = createForm(createApi(async () => {
    attempts += 1;
    return attempts === 1
      ? Response.json({ detail: [{ msg: "Value error, Уточните задачу" }] }, {
          status: 422,
        })
      : Response.json({ ok: true });
  }));
  form.render("CADASTRAL").changeField("task", "Мой черновик");
  await form.render().submit({ preventDefault() {} });

  assert.equal(form.state.isSent, false);
  assert.equal(form.state.isSending, false);
  assert.equal(form.state.fields.task, "Мой черновик");
  assert.deepEqual(form.errors, ["Уточните задачу"]);

  await form.render().submit({ preventDefault() {} });
  assert.equal(attempts, 2);
  assert.equal(form.state.isSent, true);
});

test("Публичный 401 не обновляет сессию и не повторяет POST", async () => {
  let requests = 0;
  const submit = createApi(async () => {
    requests += 1;
    return Response.json({ detail: "Запрос отклонён" }, { status: 401 });
  });

  await assert.rejects(submit({}), /Запрос отклонён/);
  assert.equal(requests, 1);
});
