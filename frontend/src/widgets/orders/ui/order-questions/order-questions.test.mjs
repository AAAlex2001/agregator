import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";

const sourceRoot = new URL("../../../../", import.meta.url);
const entityRoot = new URL("entities/order-question/", sourceRoot);
const providerUrl = new URL("model/questions-provider.ts", entityRoot).href;
const reactModule = `data:text/javascript,${encodeURIComponent(`
  export function useState(initial) {
    return globalThis.questionFormsTest.useState(initial);
  }
`)}`;
const contextModule = `data:text/javascript,${encodeURIComponent(`
  export function useOrderQuestionsContext() {
    return globalThis.questionFormsTest.context;
  }
  export function useOrderQuestions() {
    return globalThis.questionFormsTest.context.state;
  }
`)}`;
const entityModule = `data:text/javascript,${encodeURIComponent(`
  export { useOrderQuestions } from "${contextModule}";
  export { useAskOrderQuestion } from "${new URL("model/use-ask-order-question.ts", entityRoot)}";
  export { useUpdateOrderQuestion } from "${new URL("model/use-update-order-question.ts", entityRoot)}";
  export { useAnswerOrderQuestion } from "${new URL("model/use-answer-order-question.ts", entityRoot)}";
`)}`;
const notificationsModule = `data:text/javascript,${encodeURIComponent(`
  export function useNotifications() {
    return globalThis.questionFormsTest.notifications;
  }
`)}`;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "react") {
      return { url: reactModule, shortCircuit: true };
    }

    if (specifier === "@/entities/order-question") {
      return { url: entityModule, shortCircuit: true };
    }

    if (specifier === "@/shared/ui/notifications") {
      return { url: notificationsModule, shortCircuit: true };
    }

    let url;

    if (specifier.startsWith("@/")) {
      url = new URL(`${specifier.slice(2)}.ts`, sourceRoot);
    } else if (specifier.startsWith(".") && context.parentURL) {
      url = new URL(`${specifier}.ts`, context.parentURL);
    }

    if (url?.href === providerUrl) {
      return { url: contextModule, shortCircuit: true };
    }

    return url && existsSync(url)
      ? nextResolve(url.href, context)
      : nextResolve(specifier, context);
  },
});

const { createOrderQuestionsState, orderQuestionsReducer } = await import(
  "../../../../entities/order-question/model/questions-state.ts"
);
const { getOrderQuestions } = await import(
  "../../../../entities/order-question/api/get-order-questions.ts"
);
const { useAskQuestionForm } = await import(
  "../../../../features/ask-order-question/model/use-ask-question-form.ts"
);
const { useEditQuestionForm } = await import(
  "../../../../features/edit-order-question/model/use-edit-question-form.ts"
);
const { useAnswerQuestionForm } = await import(
  "../../../../features/answer-order-question/model/use-answer-question-form.ts"
);

const question = {
  id: 17,
  order_id: 42,
  expert_id: 9,
  expert_name: "Expert",
  expert_avatar_url: null,
  question: "Original question",
  answer: null,
  asked_at: "2026-10-01T12:00:00Z",
  answered_at: null,
  is_anonymous: true,
};

/** Связывает настоящие формы, HTTP-операции и reducer, заменяя только React context. */
function createForm(action) {
  const formHooks = {
    ask: useAskQuestionForm,
    edit: useEditQuestionForm,
    answer: useAnswerQuestionForm,
  };
  const useForm = formHooks[action];
  const values = [];
  const errors = [];
  let cursor = 0;
  let saved = 0;
  let state = orderQuestionsReducer(createOrderQuestionsState(), {
    type: "load/succeeded",
    items: action === "ask" ? [] : [question],
  });
  const runtime = {
    context: {
      orderId: 42,
      get state() {
        return state;
      },
      dispatch(event) {
        state = orderQuestionsReducer(state, event);
      },
    },
    notifications: {
      showError(message) {
        errors.push(message);
      },
    },
    useState(initial) {
      const index = cursor++;

      if (!(index in values)) {
        values[index] = initial;
      }

      return [values[index], (value) => { values[index] = value; }];
    },
  };

  return {
    errors,
    get state() {
      return state;
    },
    get saved() {
      return saved;
    },
    render: function useFormUnderTest() {
      cursor = 0;
      globalThis.questionFormsTest = runtime;

      return useForm(question, () => { saved++; });
    },
  };
}

test("question list preserves its endpoint and authenticated transport", async (context) => {
  let request;
  context.mock.method(globalThis, "fetch", async (url, options) => {
    request = { url, options };
    return Response.json({ items: [question], total: 1 });
  });

  const result = await getOrderQuestions(42);

  assert.deepEqual(result, { items: [question], total: 1 });
  assert.ok(request.url.endsWith("/orders/42/questions"));
  assert.equal(request.options.credentials, "include");
});

test("failed question keeps text and visibility, successful retry adds one item", async (context) => {
  const requests = [];
  context.mock.method(globalThis, "fetch", async (url, options) => {
    requests.push({ url, options });
    return requests.length === 1
      ? Response.json({ detail: "Try again" }, { status: 503 })
      : Response.json({ ...question, question: "New question", is_anonymous: false });
  });
  const form = createForm("ask");

  assert.equal(form.render().isAnonymous, true);
  form.render().changeText("  New question  ");
  form.render().changeAnonymity(false);
  await form.render().submit();

  assert.equal(form.render().text, "  New question  ");
  assert.equal(form.render().isAnonymous, false);
  assert.equal(form.render().isSubmitting, false);
  assert.deepEqual(form.state.items, []);
  assert.deepEqual(form.errors, ["Try again"]);

  await form.render().submit();

  assert.equal(form.render().text, "");
  assert.equal(form.state.items.length, 1);
  assert.equal(requests.length, 2);
  assert.ok(requests[1].url.endsWith("/orders/42/questions"));
  assert.equal(requests[1].options.method, "POST");
  assert.deepEqual(JSON.parse(requests[1].options.body), {
    question: "New question",
    is_anonymous: false,
  });
});

for (const action of ["edit", "answer"]) {
  test(`${action} keeps the editor and saved data on failure, closes after retry`, async (context) => {
    const requests = [];
    const result = action === "edit"
      ? { ...question, question: "Updated text" }
      : { ...question, answer: "Updated text" };
    context.mock.method(globalThis, "fetch", async (url, options) => {
      requests.push({ url, options });
      return requests.length === 1
        ? Response.json({ detail: "Try again" }, { status: 409 })
        : Response.json(result);
    });
    const form = createForm(action);
    form.render().changeText("  Updated text  ");
    await form.render().submit();

    assert.equal(form.render().text, "  Updated text  ");
    assert.equal(form.render().isSubmitting, false);
    assert.deepEqual(form.state.items, [question]);
    assert.deepEqual(form.errors, ["Try again"]);
    assert.equal(form.saved, 0);

    await form.render().submit();

    assert.equal(form.saved, 1);
    assert.deepEqual(form.state.items, [result]);
    assert.equal(requests[1].options.method, "PATCH");
    assert.ok(requests[1].url.endsWith(
      action === "edit" ? "/questions/17" : "/questions/17/answer",
    ));
    assert.deepEqual(JSON.parse(requests[1].options.body),
      action === "edit" ? { question: "Updated text" } : { answer: "Updated text" },
    );
  });
}

test("empty text and a pending request do not submit another question", async (context) => {
  let requests = 0;
  let finish;
  context.mock.method(globalThis, "fetch", () => {
    requests++;
    return new Promise((resolve) => { finish = resolve; });
  });

  for (const action of ["ask", "edit", "answer"]) {
    const form = createForm(action);
    form.render().changeText("   ");
    await form.render().submit();
  }

  assert.equal(requests, 0);

  const form = createForm("ask");
  form.render().changeText("New question");
  const pending = form.render().submit();

  assert.equal(form.render().isSubmitting, true);
  await form.render().submit();
  assert.equal(requests, 1);

  finish(Response.json(question));
  await pending;
  assert.equal(form.render().isSubmitting, false);
});
