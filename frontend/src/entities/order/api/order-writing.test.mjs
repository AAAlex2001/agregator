import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";

const sourceRoot = new URL("../../../", import.meta.url);

registerHooks({
  resolve(specifier, context, nextResolve) {
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

const { createOrder } = await import("./create-order.ts");
const { updateOrder } = await import("./update-order.ts");
const { getCopyableOrders } = await import("./get-copyable-orders.ts");
const payload = {
  title: "Order",
  company: "Company",
  comment: "Comment",
  sum_amount: 12500,
  start_date: "2026-11-01",
  deadline: "2026-11-30",
  responses_deadline: "2026-10-25T12:00:00+03:00",
  requires_expert: true,
  requires_license: false,
  work_type: "DESIGN",
  badge_codes: ["Code"],
  details: { object_name: "Object", scope: "FULL" },
};
const existing = {
  technical: ["/uploads/orders/12/specification.pdf"],
  contract: [],
  company: [],
  other: ["/uploads/orders/12/appendix.pdf"],
};

/** Создаёт файлы с различимыми данными для проверки категорий при повторе. */
function createFiles() {
  return {
    technical: new File(["technical"], "technical.pdf", {
      type: "application/pdf",
      lastModified: 111,
    }),
    contract: new File(["contract"], "contract.doc", {
      type: "application/msword",
      lastModified: 222,
    }),
    company: new File(["company"], "company.png", {
      type: "image/png",
      lastModified: 333,
    }),
    other: [new File(["other"], "other.zip", {
      type: "application/zip",
      lastModified: 444,
    })],
  };
}

test("create and update retry with copied files in their original multipart categories", async (context) => {
  let attempts = [];
  context.mock.method(globalThis, "fetch", async (url, options) => {
    attempts.push({ url, options });

    if (attempts.length === 1) {
      throw new TypeError("ERR_UPLOAD_FILE_CHANGED");
    }

    return new Response(null, { status: 200 });
  });

  for (const operation of ["create", "update"]) {
    for (const absentCategory of [null, "technical", "contract", "company", "all"]) {
      attempts = [];
      const files = createFiles();

      if (absentCategory === "all") {
        files.technical = null;
        files.contract = null;
        files.company = null;
      } else if (absentCategory) {
        files[absentCategory] = null;
      }

      const documents = { existing, files, copySourceOrderId: 12 };

      if (operation === "create") {
        await createOrder(payload, documents);
      } else {
        await updateOrder(42, payload, documents, false);
      }

      assert.equal(attempts.length, 2);
      const { url, options } = attempts[1];
      assert.ok(url.endsWith(operation === "create"
        ? "/orders/create-with-files"
        : "/orders/42/update-with-files"));
      assert.equal(options.method, operation === "create" ? "POST" : "PATCH");
      assert.equal(options.credentials, "include");
      assert.notEqual(options.body, attempts[0].options.body);
      assert.equal(options.body.has("customer_id"), false);
      assert.equal(options.body.get("copy_source_order_id"), "12");
      assert.equal(options.body.get("copy_documents_json"), JSON.stringify(existing));
      assert.equal(options.body.get("keep_documents_json"), "{}");
      assert.equal(options.body.get("notify_responders"), operation === "create" ? null : "false");

      for (const [field, value] of Object.entries(payload)) {
        const name = field === "badge_codes" ? "badge_codes_json"
          : field === "details" ? "details_json" : field;
        const expected = typeof value === "object" ? JSON.stringify(value) : String(value);
        assert.equal(options.body.get(name), expected);
      }

      for (const category of ["technical", "contract", "company", "other"]) {
        const original = category === "other" ? files.other[0] : files[category];
        const received = options.body.get(`${category}_files`);

        if (!original) {
          assert.equal(received, null);
          continue;
        }

        assert.notEqual(received, original);
        assert.equal(received.name, original.name);
        assert.equal(received.type, original.type);
        assert.equal(received.lastModified, original.lastModified);
        assert.equal(await received.text(), await original.text());
      }
    }
  }
});

test("editing preserves raw document paths and omits empty optional fields", async (context) => {
  let body;
  context.mock.method(globalThis, "fetch", async (url, options) => {
    body = options.body;
    return new Response(null, { status: 200 });
  });
  await updateOrder(42, {
    ...payload,
    start_date: "",
    responses_deadline: "",
    details: null,
  }, {
    existing,
    copySourceOrderId: null,
    files: { technical: null, contract: null, company: null, other: [] },
  }, true);
  assert.equal(body.get("keep_documents_json"), JSON.stringify(existing));
  assert.equal(body.get("copy_documents_json"), "{}");
  assert.equal(body.get("notify_responders"), "true");
  assert.equal(body.has("copy_source_order_id"), false);
  assert.equal(body.has("start_date"), false);
  assert.equal(body.has("responses_deadline"), false);
  assert.equal(body.has("details_json"), false);
});

test("a permissions error is returned without repeating the write", async (context) => {
  let attempts = 0;
  context.mock.method(globalThis, "fetch", async () => {
    attempts++;
    return Response.json({ detail: "Not your order" }, { status: 403 });
  });
  await assert.rejects(updateOrder(42, payload, {
    existing,
    copySourceOrderId: null,
    files: createFiles(),
  }, true), /Not your order/);
  assert.equal(attempts, 1);
});

test("copy candidates use two pages of 100 per list and keep only the owner's orders", async (context) => {
  const requests = [];
  context.mock.method(globalThis, "fetch", async (url, options) => {
    const parsed = new URL(url, "http://localhost");
    const skip = Number(parsed.searchParams.get("skip"));
    const limit = Number(parsed.searchParams.get("limit"));
    const base = parsed.pathname.endsWith("archive") ? 1000 : 0;
    requests.push({ path: parsed.pathname, skip, limit, options });
    assert.equal(limit, 100);

    return Response.json({
      items: [...Array(100).keys()].map((index) => ({
        id: base + skip + index,
        customer_id: index % 2 === 0 ? 7 : 8,
      })),
      has_more: true,
    });
  });
  const orders = await getCopyableOrders(7);
  assert.equal(requests.length, 4);
  assert.deepEqual(requests.map((request) => request.skip).sort(), [0, 0, 100, 100]);
  assert.ok(requests.every((request) => request.options.credentials === "include"));
  assert.equal(orders.length, 200);
  assert.ok(orders.every((order) => order.customer_id === 7));
  assert.equal(orders[0].id, 0);
  assert.equal(orders[99].id, 198);
  assert.equal(orders[100].id, 1000);
  assert.equal(orders[199].id, 1198);
});

test("copy candidates do not request a second page when both lists are complete", async (context) => {
  let attempts = 0;
  context.mock.method(globalThis, "fetch", async () => {
    attempts++;
    return Response.json({ items: [], has_more: false });
  });
  assert.deepEqual(await getCopyableOrders(7), []);
  assert.equal(attempts, 2);
});
