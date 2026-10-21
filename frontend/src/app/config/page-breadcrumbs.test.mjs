import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import { registerHooks } from "node:module";
import { join, relative, sep } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

registerHooks({
  resolve(specifier, context, nextResolve) {
    const url = specifier.startsWith(".") && context.parentURL
      ? new URL(`${specifier}.ts`, context.parentURL)
      : null;

    return url && existsSync(url)
      ? nextResolve(url.href, context)
      : nextResolve(specifier, context);
  },
});

const { getPageBreadcrumbs, hasOwnBreadcrumbs } = await import("./page-breadcrumbs.ts");
const appDir = fileURLToPath(new URL("../", import.meta.url));

/** Находит все файлы страниц внутри папки маршрутов. */
function findPages(folder) {
  return readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(folder, entry.name);

    if (entry.isDirectory()) {
      return findPages(fullPath);
    }

    return entry.name === "page.tsx" ? [fullPath] : [];
  });
}

/** Превращает путь файла страницы в адрес с примером вместо параметра. */
function toRoute(pageFile) {
  const parts = relative(appDir, pageFile)
    .split(sep)
    .filter((part) => !part.startsWith("(") && part !== "page.tsx")
    .map((part) => (part.startsWith("[") ? "sample-id" : part));

  return `/${parts.join("/")}`;
}

const routes = findPages(appDir).map(toRoute);
const rootPages = ["/", "/landing", "/settings"];

test("Вложенные страницы имеют крошки в оболочке или в своём содержимом", () => {
  const nestedRoutes = routes.filter((route) => !rootPages.includes(route));

  for (const route of nestedRoutes) {
    assert.ok(hasOwnBreadcrumbs(route) || getPageBreadcrumbs(route), route);
  }
});

test("Разделы кабинета начинаются с профиля", () => {
  const cabinetRoutes = [
    "/expert/orders",
    "/customer/orders",
    "/responses",
    "/archive",
    "/support",
    "/notifications",
    "/labor/employment",
  ];

  for (const route of cabinetRoutes) {
    assert.deepEqual(getPageBreadcrumbs(route)[0], {
      label: "Профиль",
      href: "/settings",
    });
  }
});

test("Диалог ведёт обратно к списку чатов", () => {
  assert.deepEqual(getPageBreadcrumbs("/chat/123"), [
    {
      label: "Профиль",
      href: "/settings",
    },
    {
      label: "Чат по заказам",
      href: "/chat",
    },
    {
      label: "Диалог",
    },
  ]);
});

test("Заказ, отклик и изменение предложения ведут обратно к своему списку", () => {
  assert.deepEqual(getPageBreadcrumbs("/expert/orders/42")[1], {
    label: "Все заказы",
    href: "/expert/orders",
  });
  assert.equal(getPageBreadcrumbs("/expert/orders/42/respond")[2].label, "Отклик");
  assert.deepEqual(getPageBreadcrumbs("/responses/7/edit")[1], {
    label: "Мои отклики",
    href: "/responses",
  });
});

test("Направления ведут на главную гостя или участника кабинета", () => {
  assert.equal(getPageBreadcrumbs("/proektirovanie")[0].href, "/");
  assert.equal(getPageBreadcrumbs("/landing/proektirovanie")[0].href, "/landing");
});

test("Страницы со своими крошками не получают дубликат", () => {
  const ownRoutes = [
    "/blog/post",
    "/landing/news/post",
    "/rtn/ask",
    "/landing/rtn/answer",
    "/register",
    "/order/123",
    "/landing/reviews",
  ];

  for (const route of ownRoutes) {
    assert.equal(getPageBreadcrumbs(route), null, route);
  }
});

test("Ссылки цепочек ведут к существующим страницам", () => {
  for (const route of routes) {
    const links = (getPageBreadcrumbs(route) ?? []).filter((item) => item.href);

    for (const item of links) {
      assert.ok(routes.includes(item.href), `${route}: ${item.href}`);
    }
  }
});

test("Начальные страницы не выводят одиночную крошку", () => {
  for (const route of rootPages) {
    assert.equal(getPageBreadcrumbs(route), null);
  }
});
