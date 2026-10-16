import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";

const sourceRoot = new URL("../../../", import.meta.url);

// Запускает настоящий API-модуль с теми же импортами, что в приложении.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      return nextResolve(new URL(`${specifier.slice(2)}.ts`, sourceRoot).href, context);
    }

    if (specifier.startsWith(".") && context.parentURL) {
      const url = new URL(`${specifier}.ts`, context.parentURL);

      if (existsSync(url)) {
        return nextResolve(url.href, context);
      }
    }

    return nextResolve(specifier, context);
  },
});

const { confirmEmail } = await import("../../../entities/user/api/confirm-email.ts");

test("Подтверждение возвращает аккаунт сервера и сохраняет контракт запроса", async (context) => {
  const account = {
    id: 27,
    role: "EXPERT",
    email: "expert@example.com",
    phone: null,
    created_at: "2026-10-16T09:00:00Z",
    inn: null,
    company_data: null,
    travels_to_other_regions: false,
  };

  context.mock.method(globalThis, "fetch", async (url, options) => {
    assert.ok(url.endsWith("/register/confirm-email"));
    assert.equal(options.method, "POST");
    assert.equal(options.credentials, "include");
    assert.deepEqual(JSON.parse(options.body), {
      email: "expert@example.com",
      code: "123456",
      role: "EXPERT",
    });

    return Response.json(account);
  });

  const confirmed = await confirmEmail("expert@example.com", "123456", "EXPERT");

  assert.deepEqual(confirmed, account);
});

test("Если роль не выбрана, её определяет ответ сервера", async (context) => {
  context.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal("role" in JSON.parse(options.body), false);

    return Response.json({
      id: 28,
      role: "CUSTOMER",
      email: "customer@example.com",
      phone: null,
      created_at: "2026-10-16T09:00:00Z",
    });
  });

  const account = await confirmEmail("customer@example.com", "123456", null);

  assert.equal(account.role, "CUSTOMER");
});

test("Неверный код отклоняет операцию и не возвращает подтверждённый аккаунт", async (context) => {
  let requestCount = 0;

  context.mock.method(globalThis, "fetch", async () => {
    requestCount += 1;

    return Response.json({ detail: "Неверный код" }, { status: 400 });
  });

  await assert.rejects(
    confirmEmail("expert@example.com", "000000", "EXPERT"),
    /Неверный код/,
  );
  assert.equal(requestCount, 1);
});
