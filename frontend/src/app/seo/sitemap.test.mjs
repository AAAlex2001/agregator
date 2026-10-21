import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";

const sourceRoot = new URL("../../", import.meta.url);

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "server-only") {
      return {
        url: "data:text/javascript,export {};",
        shortCircuit: true,
      };
    }

    if (specifier === "next/headers") {
      return {
        url: "data:text/javascript,export const cookies = async () => undefined;",
        shortCircuit: true,
      };
    }

    if (specifier === "@/entities/article") {
      return nextResolve(
        new URL("entities/article/config/list.ts", sourceRoot).href,
        context,
      );
    }

    if (specifier === "@/entities/rtn") {
      return nextResolve(
        new URL("entities/rtn/config/pagination.ts", sourceRoot).href,
        context,
      );
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

const { default: sitemap, dynamic, revalidate } = await import("../sitemap.ts");
const { getPostSitemap } = await import("../../entities/post/api/get-post-sitemap.ts");
const { SITE_URL } = await import("../../shared/config/site.ts");

/** Публичные данные с несколькими страницами РТН и повторным автором постов. */
const data = {
  news: Array.from({ length: 48 }, (item, index) => ({
    slug: `news-${index}`,
    updated_at: "2026-10-15T12:00:00Z",
  })),
  blog: [{ slug: "blog-one", updated_at: "2026-10-14T12:00:00Z" }],
  rtn: Array.from({ length: 133 }, (item, index) => ({
    slug: `rtn-${index}`,
    published_at: index === 0 ? null : "2026-10-13T12:00:00Z",
  })),
  posts: [
    { id: 1, author_id: 7, updated_at: "2026-10-12T12:00:00Z" },
    { id: 2, author_id: 7, updated_at: "2026-10-11T12:00:00Z" },
    { id: 3, author_id: 8, updated_at: "2026-10-10T12:00:00Z" },
  ],
};

/** Отвечает на реальные запросы загрузчиков без обращения к сети. */
function respondToRequest(url, failedSource = "", failSecondRtnPage = false) {
  if (url.pathname.endsWith("/public/articles/sitemap")) {
    const kind = url.searchParams.get("kind");
    return kind === failedSource
      ? Response.json({}, { status: 503 })
      : Response.json(data[kind]);
  }

  if (url.pathname.endsWith("/public/rtn/clarifications")) {
    const offset = Number(url.searchParams.get("offset"));
    const limit = Number(url.searchParams.get("limit"));

    if (failedSource === "rtn" || (failSecondRtnPage && offset > 0)) {
      return Response.json({}, { status: 503 });
    }

    return Response.json({
      items: data.rtn.slice(offset, offset + limit),
      has_more: offset + limit < data.rtn.length,
    });
  }

  assert.equal(url.pathname.endsWith("/posts/sitemap"), true);
  return failedSource === "posts"
    ? Response.json({}, { status: 503 })
    : Response.json(data.posts);
}

test("sitemap retains every public section, pagination limits, dates and author feeds", async (context) => {
  const requests = [];
  context.mock.method(globalThis, "fetch", async (address, options) => {
    const url = new URL(address);
    requests.push({ url, options });
    return respondToRequest(url);
  });

  const entries = await sitemap();
  const urls = entries.map((entry) => entry.url);
  assert.equal(dynamic, "force-dynamic");
  assert.equal(revalidate, 300);
  assert.equal(entries.length, 222);
  assert.equal(urls[0], SITE_URL);
  assert.equal(urls.includes(`${SITE_URL}/rtn/ask`), true);
  assert.equal(urls.includes(`${SITE_URL}/news?page=2`), true);
  assert.equal(urls.includes(`${SITE_URL}/news?page=3`), false);
  assert.equal(urls.includes(`${SITE_URL}/blog?page=2`), false);
  assert.equal(urls.includes(`${SITE_URL}/rtn?page=10`), true);
  assert.equal(urls.includes(`${SITE_URL}/rtn?page=11`), false);
  assert.equal(urls.includes(`${SITE_URL}/rtn/rtn-132`), true);
  assert.equal(urls.filter((url) => url === `${SITE_URL}/posts?author=7`).length, 1);
  assert.equal(urls.some((url) => url.includes("/landing") || url.includes("/settings")), false);
  const article = entries.find((entry) => entry.url.endsWith("/news/news-0"));
  assert.equal(article.lastModified.toISOString(), "2026-10-15T12:00:00.000Z");
  assert.equal(article.changeFrequency, "weekly");
  assert.equal(article.priority, 0.8);
  const author = entries.find((entry) => entry.url.endsWith("/posts?author=7"));
  assert.equal(author.lastModified, undefined);
  const rtnRequests = requests.filter(({ url }) => url.pathname.endsWith("/clarifications"));
  assert.deepEqual(
    rtnRequests.map(({ url }) => Number(url.searchParams.get("offset"))),
    Array.from({ length: 12 }, (item, index) => index * 12),
  );
  for (const { url, options } of requests) {
    assert.equal(options.credentials, undefined);
    if (url.pathname.endsWith("/posts/sitemap")) {
      assert.deepEqual(options.next, { revalidate: 300 });
    } else {
      assert.equal(options.cache, "no-store");
    }
  }
});

test("one failed source does not remove static pages or other sections", async (context) => {
  let failedSource;
  context.mock.method(globalThis, "fetch", async (address) => (
    respondToRequest(new URL(address), failedSource)
  ));

  for (const source of ["news", "blog", "rtn", "posts"]) {
    failedSource = source;
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);
    assert.equal(urls.includes(`${SITE_URL}/rtn`), true);
    assert.equal(urls.includes(`${SITE_URL}/news/news-0`), source !== "news");
    assert.equal(urls.includes(`${SITE_URL}/blog/blog-one`), source !== "blog");
    assert.equal(urls.includes(`${SITE_URL}/rtn/rtn-0`), source !== "rtn");
    assert.equal(urls.includes(`${SITE_URL}/posts/1`), source !== "posts");
  }
});

test("a later RTN page failure discards that partial source while retaining the sitemap", async (context) => {
  context.mock.method(globalThis, "fetch", async (address) => (
    respondToRequest(new URL(address), "", true)
  ));
  const urls = (await sitemap()).map((entry) => entry.url);
  assert.equal(urls.includes(`${SITE_URL}/rtn`), true);
  assert.equal(urls.includes(`${SITE_URL}/rtn/rtn-0`), false);
  assert.equal(urls.includes(`${SITE_URL}/rtn?page=2`), false);
  assert.equal(urls.includes(`${SITE_URL}/posts/1`), true);
});

test("post sitemap reports HTTP failure and keeps its existing cache policy", async (context) => {
  context.mock.method(globalThis, "fetch", async (address, options) => {
    assert.equal(new URL(address).pathname.endsWith("/posts/sitemap"), true);
    assert.deepEqual(options, { next: { revalidate: 300 } });
    return Response.json({}, { status: 503 });
  });
  await assert.rejects(getPostSitemap(), /Не удалось загрузить карту публикаций: 503/);
});
