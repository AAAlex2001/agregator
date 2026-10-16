import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";

const sourceRoot = new URL("../../../", import.meta.url);
const orderRoot = new URL("entities/order/", sourceRoot);
const contextUrl = new URL("model/order-list-context.ts", orderRoot).href;
const reactModule = `data:text/javascript,${encodeURIComponent(`
  export function useState(initial) {
    return globalThis.deleteOrderTest.useState(initial);
  }
`)}`;
const orderModule = `data:text/javascript,${encodeURIComponent(`
  export { useDeleteOrder } from "${new URL("model/use-delete-order.ts", orderRoot).href}";
`)}`;
const contextModule = `data:text/javascript,${encodeURIComponent(`
  export function useOrderListContext() {
    return globalThis.deleteOrderTest.context;
  }
`)}`;
const notificationsModule = `data:text/javascript,${encodeURIComponent(`
  export function useNotifications() {
    return globalThis.deleteOrderTest.notifications;
  }
`)}`;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "react") {
      return { url: reactModule, shortCircuit: true };
    }

    if (specifier === "@/entities/order") {
      return { url: orderModule, shortCircuit: true };
    }

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

const { useDeleteOrderDialog } = await import("./use-delete-order-dialog.ts");
const { createOrderListState, orderListReducer } = await import(
  "../../../entities/order/model/order-list-state.ts"
);

/** Соединяет форму удаления с настоящим reducer списка и HTTP-операцией. */
function createDialog(orderId = 42) {
  const values = [];
  const successes = [];
  const errors = [];
  let cursor = 0;
  let listState = createOrderListState({
    items: [{ id: 41 }, { id: 42 }],
    has_more: true,
  });
  const runtime = {
    context: {
      dispatch(action) {
        listState = orderListReducer(listState, action);
      },
    },
    notifications: {
      showSuccess: (message) => successes.push(message),
      showError: (message) => errors.push(message),
    },
    useState(initial) {
      const index = cursor++;

      if (!(index in values)) {
        values[index] = initial;
      }

      return [values[index], (value) => { values[index] = value; }];
    },
  };

  return {
    successes,
    errors,
    get listState() {
      return listState;
    },
    render: function useTestDialog() {
      cursor = 0;
      globalThis.deleteOrderTest = runtime;
      return useDeleteOrderDialog(orderId);
    },
  };
}

test("cancel leaves the order intact and sends no request", async (context) => {
  let requests = 0;
  context.mock.method(globalThis, "fetch", async () => {
    requests++;
    return Response.json({ ok: true });
  });
  const dialog = createDialog();

  dialog.render().openDialog();
  assert.equal(dialog.render().isOpen, true);
  dialog.render().closeDialog();

  assert.equal(dialog.render().isOpen, false);
  assert.deepEqual(dialog.listState.items, [{ id: 41 }, { id: 42 }]);
  assert.equal(requests, 0);
});

test("successful DELETE removes only its order after confirmation", async (context) => {
  const requests = [];
  let finishRequest;
  context.mock.method(globalThis, "fetch", (url, options) => {
    requests.push({ url, options });
    return new Promise((resolve) => { finishRequest = resolve; });
  });
  const dialog = createDialog();
  dialog.render().openDialog();
  const pending = dialog.render().confirmDeletion();

  assert.equal(dialog.render().isDeleting, true);
  assert.deepEqual(dialog.listState.items, [{ id: 41 }, { id: 42 }]);
  dialog.render().closeDialog();
  assert.equal(dialog.render().isOpen, true);
  await dialog.render().confirmDeletion();
  assert.equal(requests.length, 1);
  assert.ok(requests[0].url.endsWith("/orders/42"));
  assert.equal(requests[0].options.method, "DELETE");
  assert.equal(requests[0].options.credentials, "include");

  finishRequest(Response.json({ ok: true }));
  await pending;

  assert.equal(dialog.render().isDeleting, false);
  assert.equal(dialog.render().isOpen, false);
  assert.deepEqual(dialog.listState.items, [{ id: 41 }]);
  assert.equal(dialog.listState.hasMore, true);
  assert.deepEqual(dialog.successes, ["Заказ удалён"]);
  assert.deepEqual(dialog.errors, []);
});

test("failed DELETE keeps the card and confirmation available for retry", async (context) => {
  let requests = 0;
  context.mock.method(globalThis, "fetch", async () => {
    requests++;
    return requests === 1
      ? Response.json({ detail: "Заказ уже выполняется" }, { status: 409 })
      : Response.json({ ok: true });
  });
  const dialog = createDialog();
  dialog.render().openDialog();
  await dialog.render().confirmDeletion();

  assert.equal(dialog.render().isDeleting, false);
  assert.equal(dialog.render().isOpen, true);
  assert.deepEqual(dialog.listState.items, [{ id: 41 }, { id: 42 }]);
  assert.deepEqual(dialog.successes, []);
  assert.deepEqual(dialog.errors, ["Заказ уже выполняется"]);

  await dialog.render().confirmDeletion();
  assert.equal(requests, 2);
  assert.deepEqual(dialog.listState.items, [{ id: 41 }]);
  assert.equal(dialog.render().isOpen, false);
});
