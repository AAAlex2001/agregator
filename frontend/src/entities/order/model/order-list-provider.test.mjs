import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";
import ts from "typescript";

const sourceRoot = new URL("../../../", import.meta.url);
const contextUrl = new URL("./order-list-context.ts", import.meta.url).href;
const reactModule = `data:text/javascript,${encodeURIComponent(`
  export function useReducer(reducer, initial, create) {
    const runtime = globalThis.orderProviderTest;
    runtime.state = create(initial);
    return [runtime.state, action => { runtime.state = reducer(runtime.state, action); }];
  }
  export function useRef(initial) { return { current: initial }; }
  export function useEffect(effect) { globalThis.orderProviderTest.effect = effect; }
`)}`;
const jsxModule = `data:text/javascript,${encodeURIComponent(`
  export function jsx(type, props, key) { return { type, props, key }; }
`)}`;
const contextModule = `data:text/javascript,${encodeURIComponent(`
  export const OrderListContext = { Provider: 'provider' };
`)}`;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "react") {
      return { url: reactModule, shortCircuit: true };
    }

    if (specifier === "react/jsx-runtime") {
      return { url: jsxModule, shortCircuit: true };
    }

    let url;

    if (specifier.startsWith("@/")) {
      url = new URL(`${specifier.slice(2)}.ts`, sourceRoot);
    } else if (specifier.startsWith(".") && context.parentURL) {
      url = new URL(`${specifier}.ts`, context.parentURL);
    }

    if (url?.href === contextUrl) {
      return { url: contextModule, shortCircuit: true };
    }

    return url && existsSync(url)
      ? nextResolve(url.href, context)
      : nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (!url.endsWith(".tsx")) {
      return nextLoad(url, context);
    }

    return {
      format: "module",
      shortCircuit: true,
      source: ts.transpileModule(readFileSync(new URL(url), "utf8"), {
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          jsx: ts.JsxEmit.ReactJSX,
          target: ts.ScriptTarget.ES2022,
        },
      }).outputText,
    };
  },
});

const { OrderListProvider } = await import("./order-list-provider.tsx");
const page = { items: [{ id: 42 }], has_more: true };

/** Выполняет настоящий эффект провайдера и сохраняет состояние его reducer. */
function mountProvider(initialPage, listType) {
  const runtime = {};
  globalThis.orderProviderTest = runtime;
  const element = OrderListProvider({ initialPage, listType, children: null });
  runtime.context = element.props.value;
  runtime.cleanup = runtime.effect();
  return runtime;
}

/** Дожидается обработки ответа настоящими HTTP-функциями и эффектом. */
async function flushRequest() {
  await new Promise(setImmediate);
}

test("server page renders immediately and performs no client request", async (context) => {
  let requests = 0;
  context.mock.method(globalThis, "fetch", async () => {
    requests++;
    return Response.json(page);
  });
  const list = mountProvider(page);
  await flushRequest();

  assert.equal(requests, 0);
  assert.deepEqual(list.state.items, page.items);
  assert.equal(list.state.operation, "idle");
});

test("client list starts loading and uses the authenticated first page", async (context) => {
  let request;
  let finish;
  context.mock.method(globalThis, "fetch", (url, options) => {
    request = { url, options };
    return new Promise((resolve) => { finish = resolve; });
  });
  const list = mountProvider();

  assert.equal(list.state.operation, "loading");
  assert.deepEqual(list.state.items, []);
  assert.ok(request.url.endsWith("/orders/?skip=0&limit=50"));
  assert.equal(request.options.credentials, "include");

  finish(Response.json(page));
  await flushRequest();

  assert.equal(list.state.operation, "idle");
  assert.deepEqual(list.state.items, page.items);
  assert.equal(list.state.hasMore, true);
});

test("client loading failure exposes the API error and stops the skeleton", async (context) => {
  context.mock.method(globalThis, "fetch", async () => (
    Response.json({ detail: "Load failed" }, { status: 503 })
  ));
  const list = mountProvider();
  await flushRequest();

  assert.equal(list.state.error, "Load failed");
  assert.equal(list.state.operation, "idle");
  assert.deepEqual(list.state.items, []);
});

test("account remount ignores the previous request and loads its own list", async (context) => {
  const requests = [];
  context.mock.method(globalThis, "fetch", () => new Promise((resolve) => {
    requests.push(resolve);
  }));
  const first = mountProvider();
  first.cleanup();
  const second = mountProvider();

  requests[1](Response.json(page));
  await flushRequest();
  requests[0](Response.json({ detail: "Old account" }, { status: 503 }));
  await flushRequest();

  assert.deepEqual(second.state.items, page.items);
  assert.equal(second.state.error, null);
  assert.deepEqual(first.state.items, []);
  assert.equal(first.state.error, null);
});

test("a newer sort prevents the initial request from replacing its results", async (context) => {
  let finish;
  context.mock.method(globalThis, "fetch", () => new Promise((resolve) => {
    finish = resolve;
  }));
  const list = mountProvider();
  list.context.requestVersionRef.current++;
  list.context.dispatch({
    type: "page/loaded",
    page: { items: [{ id: 44 }], has_more: false },
  });
  finish(Response.json(page));
  await flushRequest();

  assert.deepEqual(list.state.items, [{ id: 44 }]);
  assert.equal(list.state.hasMore, false);
});

test("returning from the editor loads saved orders without a version counter", async (context) => {
  const requests = [];
  context.mock.method(globalThis, "fetch", (url) => new Promise((resolve) => {
    requests.push({ url, resolve });
  }));
  const initialList = mountProvider();
  initialList.cleanup();
  const returnedList = mountProvider();
  const savedPage = {
    items: [{ id: 42, title: "Updated order" }],
    has_more: false,
  };

  requests[1].resolve(Response.json(savedPage));
  await flushRequest();
  requests[0].resolve(Response.json(page));
  await flushRequest();

  assert.equal(requests.length, 2);
  assert.ok(requests.every((request) => request.url.endsWith("/orders/?skip=0&limit=50")));
  assert.deepEqual(returnedList.state.items, savedPage.items);
  assert.deepEqual(initialList.state.items, []);
});

test("archive loads its endpoint and exposes the same page state", async (context) => {
  let request;
  context.mock.method(globalThis, "fetch", async (url, options) => {
    request = { url, options };
    return Response.json(page);
  });
  const list = mountProvider(undefined, "archive");
  await flushRequest();

  assert.ok(request.url.endsWith("/orders/archive?skip=0&limit=50"));
  assert.equal(request.options.credentials, "include");
  assert.equal(list.context.listType, "archive");
  assert.deepEqual(list.state.items, page.items);
  assert.equal(list.state.operation, "idle");
});

test("archive remount after a review reloads current data and ignores its old request", async (context) => {
  const requests = [];
  context.mock.method(globalThis, "fetch", (url) => new Promise((resolve) => {
    requests.push({ url, resolve });
  }));
  const first = mountProvider(undefined, "archive");
  first.cleanup();
  const second = mountProvider(undefined, "archive");
  const reviewedPage = {
    items: [{ id: 42, customer_has_review: true }],
    has_more: false,
  };
  requests[1].resolve(Response.json(reviewedPage));
  await flushRequest();
  requests[0].resolve(Response.json(page));
  await flushRequest();

  assert.equal(requests.length, 2);
  assert.ok(requests.every((request) => request.url.endsWith("/orders/archive?skip=0&limit=50")));
  assert.deepEqual(second.state.items, reviewedPage.items);
  assert.deepEqual(first.state.items, []);
});

test("archive HTTP failure keeps its specific fallback text", async (context) => {
  context.mock.method(globalThis, "fetch", async () => new Response(null, { status: 503 }));
  const list = mountProvider(undefined, "archive");
  await flushRequest();

  assert.equal(list.state.error, "Не удалось загрузить архив");
  assert.equal(list.state.operation, "idle");
});
