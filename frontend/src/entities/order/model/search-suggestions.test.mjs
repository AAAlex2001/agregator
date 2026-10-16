import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";

const reactModule = `data:text/javascript,${encodeURIComponent(`
  export function useState(initial) {
    const runtime = globalThis.orderSearchTest;
    const index = runtime.index++;
    if (!(index in runtime.state)) runtime.state[index] = initial;
    return [runtime.state[index], value => { runtime.state[index] = value; }];
  }
  export function useEffect(effect, dependencies) {
    const runtime = globalThis.orderSearchTest;
    if (runtime.dependencies?.every((value, index) => value === dependencies[index])) return;
    runtime.cleanup?.();
    runtime.dependencies = dependencies;
    runtime.effect = effect;
  }
`)}`;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "react") {
      return { url: reactModule, shortCircuit: true };
    }

    let url;

    if (specifier.startsWith("@/")) {
      url = new URL(`../../../${specifier.slice(2)}.ts`, import.meta.url);
    } else if (specifier.startsWith(".") && context.parentURL) {
      url = new URL(`${specifier}.ts`, context.parentURL);
    }

    return url && existsSync(url)
      ? nextResolve(url.href, context)
      : nextResolve(specifier, context);
  },
});

const { searchOrders } = await import("../api/search-orders.ts");
const { useOrderSearchSuggestions: runSearchSuggestions } = await import("./use-order-search-suggestions.ts");

/** Запускает настоящий хук с управляемым временем и сохранением состояния между вводами. */
function createSearch(context) {
  const runtime = { state: [], index: 0 };
  const timers = new Map();
  let timerId = 0;

  globalThis.orderSearchTest = runtime;
  globalThis.window = {
    setTimeout(callback, delay) {
      assert.equal(delay, 220);
      timers.set(++timerId, callback);
      return timerId;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
  };
  context.after(() => {
    runtime.cleanup?.();
    delete globalThis.window;
    delete globalThis.orderSearchTest;
  });

  return {
    timers,
    render(query, badgeCode = "") {
      runtime.index = 0;
      const result = runSearchSuggestions(query, badgeCode);

      if (runtime.effect) {
        runtime.cleanup = runtime.effect();
        runtime.effect = null;
      }

      return result;
    },
    startRequest() {
      assert.equal(timers.size, 1);
      const [id, callback] = timers.entries().next().value;
      timers.delete(id);
      return callback();
    },
  };
}

test("search API preserves query, badge code, pagination and cookie transport", async (context) => {
  const requests = [];
  const page = { items: [{ id: 1, public_id: "order-1" }], has_more: false };
  context.mock.method(globalThis, "fetch", async (url, options) => {
    requests.push({ url, options });
    return Response.json(page);
  });

  assert.deepEqual(await searchOrders("газ & нефть", "Э3.1 КЛ/ТП", 6), page);
  const url = new URL(requests[0].url, "https://example.test");
  assert.equal(url.pathname, "/api/orders/search");
  assert.deepEqual(Object.fromEntries(url.searchParams), {
    skip: "0",
    limit: "6",
    q: "газ & нефть",
    badge_code: "Э3.1 КЛ/ТП",
  });
  assert.equal(requests[0].options.credentials, "include");
  assert.equal(requests[0].options.cache, "no-store");

  await searchOrders("", "", 6);
  assert.equal(new URL(requests[1].url, "https://example.test").search, "?skip=0&limit=6");
});

test("typing replaces the pending timer and an empty query makes no request", async (context) => {
  const requests = [];
  context.mock.method(globalThis, "fetch", async (url) => {
    requests.push(url);
    return Response.json({ items: [], has_more: false });
  });
  const search = createSearch(context);

  assert.deepEqual(search.render("   ", "Э1 ТУ"), {
    items: [],
    isLoading: false,
    hasQuery: false,
  });
  assert.equal(search.timers.size, 0);
  search.render("first");
  search.render("  second  ", "Э1 ТУ");
  assert.equal(requests.length, 0);
  await search.startRequest();
  assert.equal(requests.length, 1);
  assert.equal(new URL(requests[0], "https://example.test").searchParams.get("q"), "second");
  assert.equal(search.render("second", "Э1 ТУ").isLoading, false);
});

test("late responses cannot replace results for a changed query or badge", async (context) => {
  const responses = [];
  context.mock.method(globalThis, "fetch", () => (
    new Promise((resolve) => responses.push(resolve))
  ));
  const search = createSearch(context);
  search.render("pipe", "Э1 ТУ");
  const first = search.startRequest();
  search.render("pipe", "Э2 ТУ");
  const second = search.startRequest();
  const currentItems = [{ id: 2, public_id: "current-order" }];

  responses[1](Response.json({ items: currentItems, has_more: false }));
  await second;
  responses[0](Response.json({ items: [{ id: 1 }], has_more: false }));
  await first;
  assert.deepEqual(search.render("pipe", "Э2 ТУ").items, currentItems);
  assert.equal(search.render("pipe", "Э2 ТУ").isLoading, false);
});

test("failed lookup clears suggestions; clearing the query hides an unfinished lookup", async (context) => {
  let finish;
  context.mock.method(globalThis, "fetch", () => (
    new Promise((resolve) => { finish = resolve; })
  ));
  const search = createSearch(context);
  search.render("old");
  const first = search.startRequest();
  finish(Response.json({ items: [{ id: 1 }], has_more: false }));
  await first;

  search.render("failed");
  const failed = search.startRequest();
  assert.equal(search.render("failed").isLoading, true);
  assert.equal(search.render("failed").items.length, 1);
  finish(Response.json({ detail: "Unavailable" }, { status: 503 }));
  await failed;
  assert.deepEqual(search.render("failed").items, []);

  search.render("pending");
  const pending = search.startRequest();
  assert.deepEqual(search.render(""), {
    items: [],
    isLoading: false,
    hasQuery: false,
  });
  finish(Response.json({ items: [{ id: 3 }], has_more: false }));
  await pending;
  assert.deepEqual(search.render("").items, []);
});
