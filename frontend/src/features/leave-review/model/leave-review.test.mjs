import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";

const sourceRoot = new URL("../../../", import.meta.url);
const reviewApi = new URL("entities/review/api/create-review.ts", sourceRoot);
const reactModule = `data:text/javascript,${encodeURIComponent(`
  export function useState(initial) {
    const runtime = globalThis.leaveReviewTest;
    const index = runtime.cursor++;
    runtime.state[index] ??= initial;
    return [runtime.state[index], value => { runtime.state[index] = value; }];
  }
`)}`;
const notificationsModule = `data:text/javascript,${encodeURIComponent(`
  export function useNotifications() {
    return {
      showError: message => globalThis.leaveReviewTest.errors.push(message),
      showSuccess: message => globalThis.leaveReviewTest.successes.push(message),
    };
  }
`)}`;

registerHooks({
  resolve(specifier, context, nextResolve) {
    const replacement = {
      react: reactModule,
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

const { useLeaveReview } = await import("./use-leave-review.ts");
const { createReview } = await import(reviewApi.href);

/** Создаёт отдельный черновик с настоящей отправкой через entity API. */
function createForm(responseId = 42) {
  const runtime = {
    cursor: 0,
    state: [],
    errors: [],
    successes: [],
    published: 0,
    closed: 0,
  };
  globalThis.leaveReviewTest = runtime;

  /** Повторяет рендер формы после изменения полей или состояния отправки. */
  function useTestForm() {
    runtime.cursor = 0;
    return useLeaveReview({
      publish: (rating, comment) => createReview({
        response_id: responseId,
        rating,
        comment,
      }),
      successMessage: "Отзыв успешно опубликован",
      onPublished: () => { runtime.published++; },
      onClose: () => { runtime.closed++; },
    });
  }

  return { runtime, render: useTestForm };
}

test("an unrated draft cannot be submitted", async (context) => {
  const requests = [];
  context.mock.method(globalThis, "fetch", async (...args) => {
    requests.push(args);
  });
  const form = createForm();
  form.render().changeComment("Draft");
  await form.render().submit();
  assert.equal(requests.length, 0);
  assert.equal(form.render().comment, "Draft");
});

test("publication keeps cookie transport, trims the comment and blocks closing while pending", async (context) => {
  let finish;
  const requests = [];
  context.mock.method(globalThis, "fetch", (url, options) => {
    requests.push({ url, options });
    return new Promise((resolve) => { finish = resolve; });
  });
  const form = createForm();
  form.render().changeRating(4);
  form.render().changeComment("  Good work  ");
  const sending = form.render().submit();
  await form.render().submit();
  form.render().close();
  assert.equal(form.runtime.closed, 0);
  assert.equal(requests.length, 1);
  assert.ok(requests[0].url.endsWith("/reviews"));
  assert.equal(requests[0].options.method, "POST");
  assert.equal(requests[0].options.credentials, "include");
  assert.equal(requests[0].options.headers["Content-Type"], "application/json");
  assert.deepEqual(JSON.parse(requests[0].options.body), {
    response_id: 42,
    rating: 4,
    comment: "Good work",
  });
  finish(new Response(null, { status: 200 }));
  await sending;
  assert.equal(form.runtime.published, 1);
  assert.equal(form.runtime.successes.length, 1);
  assert.equal(form.render().isSubmitting, false);
});

test("server failure preserves the draft and retry publishes it", async (context) => {
  let attempts = 0;
  context.mock.method(globalThis, "fetch", async () => {
    attempts++;
    return attempts === 1
      ? Response.json({ detail: "Try again" }, { status: 500 })
      : new Response(null, { status: 200 });
  });
  const form = createForm();
  form.render().changeRating(5);
  form.render().changeComment("Keep my review");
  await form.render().submit();
  assert.equal(form.render().rating, 5);
  assert.equal(form.render().comment, "Keep my review");
  assert.equal(form.render().isSubmitting, false);
  assert.equal(form.runtime.published, 0);
  assert.equal(form.runtime.closed, 0);
  assert.deepEqual(form.runtime.errors, ["Try again"]);
  await form.render().submit();
  assert.equal(form.runtime.published, 1);
  assert.equal(attempts, 2);
});

test("a newly mounted target starts with an empty review", () => {
  const first = createForm();
  first.render().changeRating(3);
  first.render().changeComment("Previous order");
  first.render().close();
  assert.equal(first.runtime.closed, 1);
  const next = createForm(52);
  assert.equal(next.render().rating, 0);
  assert.equal(next.render().comment, "");
  assert.equal(next.render().isSubmitting, false);
});
