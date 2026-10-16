import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";

const sourceRoot = new URL("../../../", import.meta.url);
const reactModule = `data:text/javascript,${encodeURIComponent(`
  export function useState(initial) {
    return globalThis.publicOrderTest.useState(initial);
  }
  export function useEffect(effect, dependencies) {
    return globalThis.publicOrderTest.useEffect(effect, dependencies);
  }
`)}`;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "react") {
      return { url: reactModule, shortCircuit: true };
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

const { getPublicOrder } = await import("../api/get-public-order.ts");
const { getPublicOrderOnServer } = await import("../api/get-public-order-on-server.ts");
const { usePublicOrder } = await import("./use-public-order.ts");

/** Даёт завершиться JSON и обработчикам результата запроса. */
async function finishRequest() {
  await new Promise((resolve) => setImmediate(resolve));
}

/** Проверяет только жизненный цикл загрузки; разметка проверяется отдельно. */
function createOrderView() {
  const values = [];
  const effects = [];
  let cursor = 0;
  let pendingEffects = [];
  const runtime = {
    useState(initial) {
      const index = cursor++;

      if (!(index in values)) {
        values[index] = initial;
      }

      return [values[index], (value) => { values[index] = value; }];
    },
    useEffect(effect, dependencies) {
      const index = cursor++;
      const previous = effects[index];

      if (!previous || dependencies.some((value, key) => value !== previous.dependencies[key])) {
        pendingEffects.push(() => {
          previous?.cleanup();
          effects[index] = { dependencies, cleanup: effect() };
        });
      }
    },
  };

  return {
    render: function useTestOrder(publicId) {
      cursor = 0;
      pendingEffects = [];
      globalThis.publicOrderTest = runtime;
      const result = usePublicOrder(publicId);

      for (const effect of pendingEffects) {
        effect();
      }

      return result;
    },
    unmount() {
      for (const effect of effects) {
        effect?.cleanup();
      }
    },
  };
}

test("public client request uses public id and preserves internal numeric id", async (context) => {
  const order = { id: 42, public_id: "public-order-a", title: "Order" };
  const requests = [];
  context.mock.method(globalThis, "fetch", async (url, options) => {
    requests.push({ url, options });
    return Response.json(order);
  });

  assert.deepEqual(await getPublicOrder(order.public_id), order);
  assert.equal(requests.length, 1);
  assert.ok(requests[0].url.endsWith("/orders/public/public-order-a"));
  assert.equal(requests[0].options.credentials, "include");
  assert.equal(requests[0].options.method ?? "GET", "GET");
});

test("server preview request bypasses cache and reports missing order", async (context) => {
  const requests = [];
  context.mock.method(globalThis, "fetch", async (url, options) => {
    requests.push({ url, options });
    return Response.json({ detail: "Not found" }, { status: 404 });
  });

  await assert.rejects(getPublicOrderOnServer("missing-order"), /Заказ не найден/);
  assert.equal(requests.length, 1);
  assert.ok(requests[0].url.endsWith("/orders/public/missing-order"));
  assert.equal(requests[0].options.cache, "no-store");
});

test("changing public link hides old data and ignores its late response", async (context) => {
  const pending = [];
  context.mock.method(globalThis, "fetch", (url) => new Promise((resolve) => {
    pending.push({ url, resolve });
  }));
  const view = createOrderView();

  assert.equal(view.render("first").isLoading, true);
  assert.equal(view.render("first").isLoading, true);
  assert.equal(pending.length, 1);
  assert.equal(view.render("second").isLoading, true);
  assert.equal(pending.length, 2);

  pending[0].resolve(Response.json({ id: 1, public_id: "first" }));
  await finishRequest();
  assert.deepEqual(view.render("second"), {
    order: null,
    error: null,
    isLoading: true,
  });

  const secondOrder = { id: 2, public_id: "second" };
  pending[1].resolve(Response.json(secondOrder));
  await finishRequest();
  assert.deepEqual(view.render("second"), {
    order: secondOrder,
    error: null,
    isLoading: false,
  });

  assert.deepEqual(view.render("third"), {
    order: null,
    error: null,
    isLoading: true,
  });
  view.unmount();
  pending[2].resolve(Response.json({ id: 3, public_id: "third" }));
  await finishRequest();
  assert.equal(view.render("third").order, null);
});

test("failed public load leaves loading state and exposes the request error", async (context) => {
  context.mock.method(globalThis, "fetch", async () =>
    Response.json({ detail: "Заказ не найден" }, { status: 404 }),
  );
  const view = createOrderView();

  view.render("missing");
  await finishRequest();
  assert.deepEqual(view.render("missing"), {
    order: null,
    error: "Заказ не найден",
    isLoading: false,
  });
});
