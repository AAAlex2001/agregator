import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { getPageBreadcrumbs, hasContentBreadcrumbs } from "../source/shared/lib/navigation/pageBreadcrumbs.ts";

const app = fileURLToPath(new URL("../app/", import.meta.url));
function pages(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory()
    ? pages(join(dir, entry.name)) : entry.name === "page.tsx" ? [join(dir, entry.name)] : []);
}
const routes = pages(app).map(file => "/" + relative(app, file).split(sep)
  .filter(part => !part.startsWith("(") && part !== "page.tsx")
  .map(part => part.startsWith("[") ? "sample-id" : part).join("/"));

test("Вложенные страницы имеют крошки в оболочке или в своём контенте", () => {
  for (const route of routes.filter(path => !["/", "/landing", "/settings"].includes(path))) assert.ok(hasContentBreadcrumbs(route) || getPageBreadcrumbs(route), route);
});
test("Разделы кабинета начинаются с профиля", () => {
  for (const route of ["/expert/orders", "/customer/orders", "/responses", "/archive", "/support", "/notifications", "/labor/employment"]) {
    assert.deepEqual(getPageBreadcrumbs(route)[0], { label: "Профиль", href: "/settings" });
  }
});
test("Диалог ведёт обратно к списку чатов", () => {
  assert.deepEqual(getPageBreadcrumbs("/chat/123"), [
    { label: "Профиль", href: "/settings" },
    { label: "Чат по заказам", href: "/chat" },
    { label: "Диалог" },
  ]);
});
test("Публичные направления сохраняют правильную главную для гостя и участника", () => {
  assert.equal(getPageBreadcrumbs("/proektirovanie")[0].href, "/");
  assert.equal(getPageBreadcrumbs("/landing/proektirovanie")[0].href, "/landing");
});
test("Статьи и страницы со своими крошками не получают дубликат", () => {
  for (const route of ["/blog/post", "/landing/news/post", "/rtn/ask", "/landing/rtn/answer", "/register", "/order/123", "/landing/reviews"]) {
    assert.equal(getPageBreadcrumbs(route), null, route);
  }
});
test("Все ссылки из автоматически построенных цепочек ведут к существующим страницам", () => {
  for (const route of routes) for (const item of getPageBreadcrumbs(route) ?? []) {
    if (item.href) assert.ok(routes.includes(item.href), `${route}: ${item.href}`);
  }
});

test("Начальные страницы не выводят одиночную крошку", () => {
  for (const route of ["/", "/landing", "/settings"]) assert.equal(getPageBreadcrumbs(route), null);
});
