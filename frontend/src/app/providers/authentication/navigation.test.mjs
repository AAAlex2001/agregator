import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";
import ts from "typescript";

const sourceRoot = new URL("../../../", import.meta.url);
const providerUrl = new URL("index.tsx", import.meta.url).href;
const contextUrl = new URL("context.ts", import.meta.url).href;

/** Подменяет только окружение; маршрутизация выполняется настоящим провайдером. */
function moduleUrl(code) {
  return `data:text/javascript,${encodeURIComponent(code)}`;
}

const reactModule = moduleUrl(`
  export function useState(initial) {
    return globalThis.authenticationNavigation.useState(initial);
  }
`);
const jsxModule = moduleUrl(`
  export function jsx(type, props, key) { return { type, props, key }; }
  export const jsxs = jsx;
`);
const navigationModule = moduleUrl(`
  export function useRouter() {
    return globalThis.authenticationNavigation.router;
  }
  export function usePathname() {
    return globalThis.authenticationNavigation.pathname;
  }
`);
const notificationsModule = moduleUrl(`
  export function useNotifications() {
    return globalThis.authenticationNavigation.notifications;
  }
`);
const contextModule = moduleUrl(`
  export const AuthenticationContext = { Provider: "authentication-provider" };
  export function useAuthentication() {}
`);
const modalModule = moduleUrl(`export function AuthModal() { return null; }`);
const userModule = moduleUrl(`
  export { homePath } from "${new URL("entities/user/model/role.ts", sourceRoot).href}";
`);

registerHooks({
  resolve(specifier, context, nextResolve) {
    const replacements = {
      react: reactModule,
      "react/jsx-runtime": jsxModule,
      "next/navigation": navigationModule,
      "@/entities/user": userModule,
      "@/widgets/auth-modal": modalModule,
      "@/shared/ui/notifications": notificationsModule,
    };

    if (replacements[specifier]) {
      return { url: replacements[specifier], shortCircuit: true };
    }

    if (specifier.startsWith(".") && context.parentURL) {
      const url = new URL(`${specifier}.ts`, context.parentURL);

      if (url.href === contextUrl) {
        return { url: contextModule, shortCircuit: true };
      }

      if (existsSync(url)) {
        return nextResolve(url.href, context);
      }
    }

    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === providerUrl) {
      const code = ts.transpileModule(readFileSync(new URL(url), "utf8"), {
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2020,
          jsx: ts.JsxEmit.ReactJSX,
        },
      }).outputText;

      return { format: "module", source: code, shortCircuit: true };
    }

    return nextLoad(url, context);
  },
});

const { AuthenticationProvider } = await import("./index.tsx");
const ORDER_TO_RESPOND_KEY = "pendingOrderUuid";

/** Создаёт страницу с управляемым хранилищем, адресом и состоянием окна. */
function createPage(context, pathname = "/") {
  const storage = new Map();
  const routes = [];
  const errors = [];
  let dialog = null;
  let storageBlocked = false;
  const previousStorage = Object.getOwnPropertyDescriptor(globalThis, "sessionStorage");

  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    value: {
      getItem(key) {
        if (storageBlocked) throw new Error("Storage unavailable");
        return storage.get(key) ?? null;
      },
      removeItem(key) {
        if (storageBlocked) throw new Error("Storage unavailable");
        storage.delete(key);
      },
    },
  });

  context.after(() => {
    if (previousStorage) {
      Object.defineProperty(globalThis, "sessionStorage", previousStorage);
    } else {
      delete globalThis.sessionStorage;
    }
    delete globalThis.authenticationNavigation;
  });

  const runtime = {
    pathname,
    router: { push: (route) => routes.push(route) },
    notifications: { showError: (message) => errors.push(message) },
    useState() {
      return [dialog, (next) => { dialog = next; }];
    },
  };

  /** Получает актуальные обработчики после изменения страницы или состояния окна. */
  function render() {
    globalThis.authenticationNavigation = runtime;
    return AuthenticationProvider({ children: null });
  }

  return {
    storage,
    routes,
    errors,
    runtime,
    blockStorage: () => { storageBlocked = true; },
    openLogin: () => render().props.value.openLogin(),
    openRegistration: (preset) => render().props.value.openRegistration(preset),
    modal: () => render().props.children[1],
  };
}

test("login returns to the current selected order and consumes it", (context) => {
  const page = createPage(context, "/order/first");
  page.storage.set(ORDER_TO_RESPOND_KEY, "first");
  page.openLogin();
  assert.equal(page.modal().props.fromOrder, true);

  page.storage.set(ORDER_TO_RESPOND_KEY, "second");
  page.runtime.pathname = "/order/second";
  page.modal().props.onSignedIn({ role: "EXPERT" });

  assert.deepEqual(page.routes, ["/order/second"]);
  assert.equal(page.storage.has(ORDER_TO_RESPOND_KEY), false);
  assert.equal(page.modal(), null);
});

test("clearing the selected order while login is open cancels the return", (context) => {
  const page = createPage(context, "/order/first");
  page.storage.set(ORDER_TO_RESPOND_KEY, "first");
  page.openLogin();
  page.storage.delete(ORDER_TO_RESPOND_KEY);
  page.runtime.pathname = "/orders";
  page.modal().props.onSignedIn({ role: "EXPERT" });

  assert.deepEqual(page.routes, ["/expert/orders"]);
  assert.deepEqual(page.errors, []);
});

test("another role consumes the order and shows the existing explanation", (context) => {
  const page = createPage(context);
  page.storage.set(ORDER_TO_RESPOND_KEY, "first");
  page.openLogin();
  page.modal().props.onSignedIn({ role: "CUSTOMER" });

  assert.deepEqual(page.routes, ["/customer/orders"]);
  assert.equal(page.storage.has(ORDER_TO_RESPOND_KEY), false);
  assert.deepEqual(page.errors, [
    "Этот аккаунт зарегистрирован под другой ролью. Для отклика нужен аккаунт исполнителя",
  ]);
});

test("login preserves posts pages and sends a holder to settings elsewhere", (context) => {
  const page = createPage(context, "/posts/123");
  page.openLogin();
  page.modal().props.onSignedIn({ role: "CUSTOMER" });
  assert.deepEqual(page.routes, []);

  page.runtime.pathname = "/posts";
  page.openLogin();
  page.modal().props.onSignedIn({ role: "EXPERT" });
  assert.deepEqual(page.routes, []);

  page.runtime.pathname = "/";
  page.openLogin();
  page.modal().props.onSignedIn({ role: "LICENSE_HOLDER" });
  assert.deepEqual(page.routes, ["/settings"]);
});

test("email confirmation preserves the pending order and its separate destinations", (context) => {
  const page = createPage(context);
  page.storage.set(ORDER_TO_RESPOND_KEY, "first");
  page.openRegistration({ role: "EXPERT", direction: "DESIGN" });
  assert.deepEqual(page.modal().props.preset, { role: "EXPERT", direction: "DESIGN" });
  page.modal().props.onConfirmed({ role: "EXPERT" });
  assert.equal(page.storage.get(ORDER_TO_RESPOND_KEY), "first");

  page.openRegistration();
  page.modal().props.onConfirmed({ role: "LICENSE_HOLDER" });
  assert.deepEqual(page.routes, ["/landing", "/settings"]);
});

test("unavailable browser storage does not prevent opening or completing login", (context) => {
  const page = createPage(context);
  page.blockStorage();
  page.openLogin();
  assert.equal(page.modal().props.fromOrder, false);
  page.modal().props.onSignedIn({ role: "EXPERT" });
  assert.deepEqual(page.routes, ["/expert/orders"]);
});
