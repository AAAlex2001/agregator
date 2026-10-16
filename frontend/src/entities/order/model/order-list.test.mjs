import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";

const sourceRoot = new URL("../../../", import.meta.url);
const contextUrl = new URL("./order-list-context.ts", import.meta.url).href;
const contextModule = `data:text/javascript,${encodeURIComponent(`
  export function useOrderListContext() {
    return globalThis.orderListTestContext;
  }
`)}`;

registerHooks({
  resolve(specifier, context, nextResolve) {
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
});

const { createOrderListState, orderListReducer } = await import("./order-list-state.ts");
const { useChangeOrderSort } = await import("./use-change-order-sort.ts");
const { useLoadMoreOrders } = await import("./use-load-more-orders.ts");
const { getOrdersOnServer } = await import("../api/get-orders-on-server.ts");

const initialPage = { items: [{ id: 1 }, { id: 2 }], has_more: true };
const dateSort = { field: "created_at", direction: "desc" };
const priceSort = { field: "sum_amount", direction: "asc" };
const defaultSort = { field: null, direction: null };

/** Соединяет реальные операции с reducer; заменяется только доступ к React context. */
function createList(page = initialPage, hasServerPage = true, listType = "orders") {
  let state = createOrderListState(page);
  const context = {
    get state() {
      return state;
    },
    initialPage: hasServerPage ? page : undefined,
    listType,
    requestVersionRef: { current: 0 },
    dispatch(action) {
      state = orderListReducer(state, action);
    },
  };

  return {
    get state() {
      return state;
    },
    actions: function useListActions() {
      globalThis.orderListTestContext = context;

      return {
        changeSort: useChangeOrderSort(),
        loadMore: useLoadMoreOrders(),
      };
    },
  };
}

test("server list keeps no-store, page size and default order query", async (context) => {
  let request;
  context.mock.method(globalThis, "fetch", async (url, options) => {
    request = { url: new URL(url), options };
    return Response.json(initialPage);
  });

  const page = await getOrdersOnServer({ skip: 0, limit: 50, sort: defaultSort });

  assert.deepEqual(page, initialPage);
  assert.equal(request.url.pathname.endsWith("/orders/"), true);
  assert.equal(request.url.search, "?skip=0&limit=50");
  assert.equal(request.options.cache, "no-store");
});

test("initial page and repeated default selection do not request data", async (context) => {
  let requests = 0;
  context.mock.method(globalThis, "fetch", async () => {
    requests++;
    return Response.json(initialPage);
  });
  const list = createList();

  await list.actions().changeSort(defaultSort);

  assert.equal(requests, 0);
  assert.deepEqual(list.state.items, initialPage.items);
  assert.equal(list.state.operation, "idle");
});

test("latest sorting wins even when a previous page returns later", async (context) => {
  const requests = [];
  context.mock.method(globalThis, "fetch", (url) => new Promise((resolve) => {
    requests.push({ url, resolve });
  }));
  const list = createList();
  const first = list.actions().changeSort(dateSort);

  assert.deepEqual(list.state.items, []);
  assert.equal(list.state.operation, "loading");
  const second = list.actions().changeSort(priceSort);
  assert.equal(requests.length, 2);
  assert.ok(requests[1].url.endsWith("?skip=0&limit=50&sort_by=sum_amount&sort_dir=asc"));

  requests[1].resolve(Response.json({ items: [{ id: 4 }], has_more: false }));
  await second;
  requests[0].resolve(Response.json({ items: [{ id: 3 }], has_more: true }));
  await first;

  assert.deepEqual(list.state.items, [{ id: 4 }]);
  assert.equal(list.state.hasMore, false);
  assert.deepEqual(list.state.sort, priceSort);
  assert.equal(list.state.operation, "idle");

  await list.actions().changeSort(priceSort);
  assert.equal(requests.length, 2);
});

test("reset restores initial page and ignores an obsolete request failure", async (context) => {
  let finish;
  let requests = 0;
  context.mock.method(globalThis, "fetch", () => {
    requests++;
    return new Promise((resolve) => { finish = resolve; });
  });
  const list = createList();
  const pending = list.actions().changeSort(dateSort);

  await list.actions().changeSort(defaultSort);
  finish(Response.json({ detail: "Old request failed" }, { status: 503 }));
  await pending;

  assert.equal(requests, 1);
  assert.deepEqual(list.state, createOrderListState(initialPage));
});

test("pagination uses loaded count and never appends to a changed sort", async (context) => {
  const requests = [];
  context.mock.method(globalThis, "fetch", (url) => new Promise((resolve) => {
    requests.push({ url, resolve });
  }));
  const list = createList();
  const nextPage = list.actions().loadMore();

  assert.ok(requests[0].url.endsWith("?skip=2&limit=50"));
  assert.equal(list.state.operation, "loading-more");
  await list.actions().loadMore();
  assert.equal(requests.length, 1);

  const sortedPage = list.actions().changeSort(priceSort);
  requests[0].resolve(Response.json({ items: [{ id: 3 }], has_more: true }));
  await nextPage;
  assert.deepEqual(list.state.items, []);
  assert.equal(list.state.operation, "loading");

  requests[1].resolve(Response.json({ items: [{ id: 4 }], has_more: false }));
  await sortedPage;
  await list.actions().loadMore();
  assert.equal(requests.length, 2);
  assert.deepEqual(list.state.items, [{ id: 4 }]);
});

test("failed pagination retains existing cards and can retry the same offset", async (context) => {
  const offsets = [];
  context.mock.method(globalThis, "fetch", async (url) => {
    offsets.push(new URL(url, "https://example.test").searchParams.get("skip"));

    return offsets.length === 1
      ? Response.json({ detail: "Try again" }, { status: 503 })
      : Response.json({ items: [{ id: 3 }], has_more: false });
  });
  const list = createList();

  await list.actions().loadMore();
  assert.deepEqual(list.state.items, initialPage.items);
  assert.equal(list.state.error, "Try again");
  assert.equal(list.state.operation, "idle");

  await list.actions().loadMore();
  assert.deepEqual(offsets, ["2", "2"]);
  assert.deepEqual(list.state.items, [{ id: 1 }, { id: 2 }, { id: 3 }]);
  assert.equal(list.state.error, null);
  assert.equal(list.state.hasMore, false);
});

test("client sort reset reloads current orders instead of restoring a deleted card", async (context) => {
  const requests = [];
  context.mock.method(globalThis, "fetch", async (url, options) => {
    requests.push({ url, options });
    return Response.json({ items: [{ id: 2 }], has_more: false });
  });
  const list = createList(initialPage, false);
  await list.actions().changeSort(priceSort);
  await list.actions().changeSort(defaultSort);

  assert.equal(requests.length, 2);
  assert.ok(requests[1].url.endsWith("/orders/?skip=0&limit=50"));
  assert.equal(requests[1].options.credentials, "include");
  assert.deepEqual(list.state.items, [{ id: 2 }]);
  assert.deepEqual(list.state.sort, defaultSort);
});

test("archive pagination stays on the archive endpoint and uses loaded count", async (context) => {
  const requests = [];
  context.mock.method(globalThis, "fetch", async (url, options) => {
    requests.push({ url, options });
    return Response.json({ items: [{ id: 3 }], has_more: false });
  });
  const list = createList(initialPage, false, "archive");
  await list.actions().loadMore();

  assert.equal(requests.length, 1);
  assert.ok(requests[0].url.endsWith("/orders/archive?skip=2&limit=50"));
  assert.equal(requests[0].options.credentials, "include");
  assert.deepEqual(list.state.items, [{ id: 1 }, { id: 2 }, { id: 3 }]);
  assert.equal(list.state.hasMore, false);
});
