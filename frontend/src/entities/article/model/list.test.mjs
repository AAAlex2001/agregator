import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";

const sourceRoot = new URL("../../../", import.meta.url);
const contextUrl = new URL("list-context.ts", import.meta.url).href;
const contextModule = `data:text/javascript,${encodeURIComponent(`
  export function useArticleListContext() {
    return globalThis.articleListContext;
  }
`)}`;
const notificationsModule = `data:text/javascript,${encodeURIComponent(`
  export function useNotifications() {
    return { showError: (message) => globalThis.articleListErrors.push(message) };
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

    if (url?.href === contextUrl) {
      return { url: contextModule, shortCircuit: true };
    }

    return url && existsSync(url)
      ? nextResolve(url.href, context)
      : nextResolve(specifier, context);
  },
});

const { articleListReducer, createArticleListState } = await import("./list-state.ts");
const { useFilterArticles } = await import("./use-filter-articles.ts");
const { useLoadMoreArticles } = await import("./use-load-more-articles.ts");
const { getArticlesOnServer } = await import("../api/get-articles-on-server.ts");
const { getArticleOnServer } = await import("../api/get-article-on-server.ts");
const { getArticleSitemap } = await import("../api/get-article-sitemap.ts");

const initialPage = {
  items: [{ id: 1 }, { id: 2 }],
  has_more: true,
};

/** Соединяет реальные операции и reducer с управляемым контекстом списка. */
function createList(offset = 0) {
  let state = createArticleListState({ page: initialPage, offset });
  const errors = [];
  const context = {
    kind: "news",
    requestVersionRef: { current: 0 },
    get state() {
      return state;
    },
    dispatch(action) {
      state = articleListReducer(state, action);
    },
  };

  return {
    errors,
    get state() {
      return state;
    },
    actions: function useListActions() {
      globalThis.articleListContext = context;
      globalThis.articleListErrors = errors;

      return {
        filter: useFilterArticles(),
        loadMore: useLoadMoreArticles(),
      };
    },
  };
}

test("server articles preserve the query and disable response caching", async (context) => {
  let request;
  context.mock.method(globalThis, "fetch", async (url, options) => {
    request = { url: new URL(url), options };
    return Response.json(initialPage);
  });

  assert.deepEqual(await getArticlesOnServer({
    kind: "news",
    limit: 24,
    offset: 48,
    tag: "Тег & слово",
    direction: "ECOLOGY",
  }), initialPage);
  assert.equal(request.url.pathname.endsWith("/public/articles"), true);
  assert.equal(request.url.searchParams.get("offset"), "48");
  assert.equal(request.url.searchParams.get("limit"), "24");
  assert.equal(request.url.searchParams.get("tag"), "Тег & слово");
  assert.equal(request.options.cache, "no-store");
});

test("initial articles do not refetch and pagination includes the server offset", async (context) => {
  const requests = [];
  context.mock.method(globalThis, "fetch", async (url) => {
    requests.push(new URL(url, "https://example.test"));
    return Response.json({ items: [{ id: 3 }], has_more: false });
  });
  const list = createList(48);

  list.actions();
  assert.equal(requests.length, 0);
  assert.equal(list.state.offset, 50);
  await list.actions().loadMore();
  assert.equal(requests[0].searchParams.get("offset"), "50");
  assert.equal(requests[0].searchParams.get("limit"), "12");
  assert.deepEqual(list.state.items, [{ id: 1 }, { id: 2 }, { id: 3 }]);
  await list.actions().loadMore();
  assert.equal(requests.length, 1);
});

test("the latest filter wins and a late failure does not show an unrelated error", async (context) => {
  const requests = [];
  context.mock.method(globalThis, "fetch", (url) => new Promise((resolve) => {
    requests.push({ url, resolve });
  }));
  const list = createList();
  const old = list.actions().filter({ tag: "old", direction: "" });
  const current = list.actions().filter({ tag: "new", direction: "DESIGN" });

  requests[1].resolve(Response.json({ items: [{ id: 4 }], has_more: false }));
  await current;
  requests[0].resolve(Response.json({}, { status: 503 }));
  await old;

  assert.deepEqual(list.state.items, [{ id: 4 }]);
  assert.deepEqual(list.state.filters, { tag: "new", direction: "DESIGN" });
  assert.equal(list.state.offset, 1);
  assert.equal(list.state.operation, "idle");
  assert.deepEqual(list.errors, []);
});

test("pagination cannot append old articles after the filters change", async (context) => {
  const requests = [];
  context.mock.method(globalThis, "fetch", (url) => new Promise((resolve) => {
    requests.push({ url, resolve });
  }));
  const list = createList();
  const nextPage = list.actions().loadMore();
  await list.actions().loadMore();
  assert.equal(requests.length, 1);
  const filteredPage = list.actions().filter({ tag: "new", direction: "" });

  requests[0].resolve(Response.json({ items: [{ id: 3 }], has_more: true }));
  await nextPage;
  assert.equal(list.state.operation, "filtering");
  requests[1].resolve(Response.json({ items: [{ id: 4 }], has_more: false }));
  await filteredPage;
  assert.deepEqual(list.state.items, [{ id: 4 }]);
});

test("failed pagination preserves articles and retries the same offset", async (context) => {
  const offsets = [];
  context.mock.method(globalThis, "fetch", async (url) => {
    offsets.push(new URL(url, "https://example.test").searchParams.get("offset"));
    return offsets.length === 1
      ? Response.json({}, { status: 503 })
      : Response.json({ items: [{ id: 3 }], has_more: false });
  });
  const list = createList(24);

  await list.actions().loadMore();
  assert.deepEqual(list.state.items, initialPage.items);
  assert.equal(list.state.operation, "idle");
  assert.equal(list.errors.length, 1);
  await list.actions().loadMore();
  assert.deepEqual(offsets, ["26", "26"]);
});

test("missing articles return null while server failures remain errors", async (context) => {
  let status = 404;
  context.mock.method(globalThis, "fetch", async () => Response.json({}, { status }));
  assert.equal(await getArticleOnServer("missing"), null);
  status = 503;
  await assert.rejects(getArticleOnServer("missing"), /503/);
});

test("article sitemap preserves its section and no-store policy", async (context) => {
  let request;
  const items = [{ slug: "article", updated_at: "2026-10-16" }];
  context.mock.method(globalThis, "fetch", async (url, options) => {
    request = { url: new URL(url), options };
    return Response.json(items);
  });

  assert.deepEqual(await getArticleSitemap("blog"), items);
  assert.equal(request.url.pathname.endsWith("/public/articles/sitemap"), true);
  assert.equal(request.url.search, "?kind=blog");
  assert.equal(request.options.cache, "no-store");
});
