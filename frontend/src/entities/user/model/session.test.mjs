import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";

const sourceRoot = new URL("../../../", import.meta.url);

// Node запускает те же TypeScript-модули, что приложение, без отдельной сборки.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const url = new URL(`${specifier.slice(2)}.ts`, sourceRoot);

      return nextResolve(url.href, context);
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

const { login } = await import("../api/login.ts");
const { logout } = await import("../api/logout.ts");
const { getUserProfile } = await import("../api/get-user-profile.ts");
const { EmailNotVerifiedError, RoleChoiceRequiredError } = await import("./errors.ts");
const { loadUserProfile } = await import("./load-user-profile.ts");
const { createUserState, userReducer } = await import("./reducer.ts");

test("Вход сохраняет контракт запроса и передаёт выбор роли фиче", async (context) => {
  const credentials = {
    email: "user@example.com",
    password: "Secret1",
  };

  context.mock.method(globalThis, "fetch", async (url, options) => {
    assert.ok(url.endsWith("/login/"));
    assert.equal(options.method, "POST");
    assert.equal(options.credentials, "include");
    assert.deepEqual(JSON.parse(options.body), credentials);

    return Response.json(
      {
        detail: {
          code: "role_choice_required",
          available_roles: ["CUSTOMER", "EXPERT"],
        },
      },
      { status: 409 },
    );
  });

  await assert.rejects(login(credentials), (error) => {
    assert.ok(error instanceof RoleChoiceRequiredError);
    assert.deepEqual(error.roles, ["CUSTOMER", "EXPERT"]);

    return true;
  });
});

test("Неподтверждённая почта сохраняет адрес и роль из ответа сервера", async (context) => {
  context.mock.method(globalThis, "fetch", async () =>
    Response.json(
      {
        detail: {
          code: "email_not_verified",
          email: "confirmed-account@example.com",
          role: "EXPERT",
        },
      },
      { status: 403 },
    ),
  );

  await assert.rejects(
    login({
      email: "user@example.com",
      password: "Secret1",
    }),
    (error) => {
      assert.ok(error instanceof EmailNotVerifiedError);
      assert.equal(error.email, "confirmed-account@example.com");
      assert.equal(error.role, "EXPERT");

      return true;
    },
  );
});

test("Обычная ошибка входа остаётся понятным сообщением API", async (context) => {
  context.mock.method(globalThis, "fetch", async () =>
    Response.json(
      {
        detail: "Слишком много попыток. Повторите позже",
      },
      { status: 429 },
    ),
  );

  await assert.rejects(
    login({ email: "user@example.com", password: "Secret1" }),
    /Слишком много попыток/,
  );
});

test("Неверный пароль не вызывает refresh и повторный POST входа", async (context) => {
  const requests = [];

  context.mock.method(globalThis, "fetch", async (url) => {
    requests.push(url);

    return Response.json({ detail: "Неверный пароль" }, { status: 401 });
  });

  await assert.rejects(
    login({ email: "user@example.com", password: "wrong-password" }),
    /Неверный пароль/,
  );
  assert.equal(requests.length, 1);
  assert.ok(requests[0].endsWith("/login/"));
});

test("Отсутствующая сессия возвращает null после неудачного refresh", async (context) => {
  const requests = [];

  context.mock.method(globalThis, "fetch", async (url) => {
    requests.push(url);

    return new Response(null, { status: 401 });
  });

  assert.equal(await getUserProfile(), null);
  assert.equal(requests.length, 2);
  assert.ok(requests[1].endsWith("/login/refresh"));
});

test("Ошибка профиля сохраняется в provider и отклоняет вызывающую операцию", async (context) => {
  const currentUser = { id: 17, role: "EXPERT" };
  let state = userReducer(createUserState(null), {
    type: "user/changed",
    user: currentUser,
  });

  context.mock.method(globalThis, "fetch", async () =>
    Response.json(
      {
        detail: "Профиль временно недоступен",
      },
      { status: 503 },
    ),
  );

  await assert.rejects(
    loadUserProfile(
      (action) => {
        state = userReducer(state, action);
      },
      { current: 0 },
    ),
    /Профиль временно недоступен/,
  );

  assert.equal(state.user, currentUser);
  assert.equal(state.isLoading, false);
  assert.equal(state.error, "Профиль временно недоступен");
});

test("Ответ незавершённой загрузки не восстанавливает пользователя после выхода", async (context) => {
  let finishRequest;
  const response = new Promise((resolve) => {
    finishRequest = resolve;
  });
  const version = { current: 0 };
  let state = createUserState("EXPERT");

  context.mock.method(globalThis, "fetch", () => response);

  const loading = loadUserProfile((action) => {
    state = userReducer(state, action);
  }, version);

  version.current += 1;
  state = userReducer(state, { type: "user/changed", user: null });
  finishRequest(Response.json({ id: 17, role: "EXPERT" }));

  await assert.rejects(loading, /Аккаунт изменился/);
  assert.equal(state.user, null);
  assert.equal(state.role, null);
  assert.equal(state.error, null);
});

test("Новая авторизация очищает профиль прежней роли до его повторной загрузки", () => {
  const previous = userReducer(createUserState(null), {
    type: "user/changed",
    user: { id: 17, role: "EXPERT" },
  });
  const state = userReducer(previous, {
    type: "account/authenticated",
    role: "CUSTOMER",
  });

  assert.equal(state.user, null);
  assert.equal(state.role, "CUSTOMER");
  assert.equal(state.isLoading, true);
});

test("Сбой серверного выхода отклоняет операцию вместо ложного успеха", async (context) => {
  context.mock.method(globalThis, "fetch", async () => {
    throw new TypeError("Failed to fetch");
  });

  await assert.rejects(logout(), /Не удалось связаться с сервером/);
});
