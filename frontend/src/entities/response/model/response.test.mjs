import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";

const sourceRoot = new URL("../../../", import.meta.url);
const reactModule = `data:text/javascript,${encodeURIComponent(`
  export function useState(initial) {
    const runtime = globalThis.responseFilesTest;
    runtime.files ??= initial;
    return [runtime.files, value => { runtime.files = value; }];
  }
  export function useRef(initial) {
    const runtime = globalThis.responseFilesTest;
    runtime.ref ??= { current: initial };
    return runtime.ref;
  }
  export function useEffect(effect) {
    const runtime = globalThis.responseFilesTest;
    runtime.cleanup ??= effect();
  }
`)}`;
const notificationsModule = `data:text/javascript,${encodeURIComponent(`
  export function useNotifications() {
    return { showError: message => globalThis.responseFilesTest.errors.push(message) };
  }
`)}`;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "react") {
      return { url: reactModule, shortCircuit: true };
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

    return url && existsSync(url)
      ? nextResolve(url.href, context)
      : nextResolve(specifier, context);
  },
});

const { respondToOrder } = await import("../api/respond-to-order.ts");
const { mergeResponseFiles } = await import("./merge-response-files.ts");
const { calculateVat } = await import("./calculate-vat.ts");
const { useResponseFiles } = await import("./use-response-files.ts");
const file = new File(["Offer bytes"], "offer.pdf", {
  type: "application/pdf",
  lastModified: 1000,
});
const offer = {
  comment: "Work description",
  proposed_sum_amount: 123456,
  proposed_start_date: "2026-11-01",
  proposed_deadline: "2026-11-10",
  vat_kind: "VAT_22",
  expert_inn: "1234567890",
  expert_company_data: {
    value: "Company",
    unrestricted_value: "Full company name",
    data: { inn: "1234567890", ogrn: "1234567890123" },
  },
  files: [file],
};

test("response request preserves multipart fields and company details after file retry", async (context) => {
  const requests = [];
  context.mock.method(globalThis, "fetch", async (url, init) => {
    requests.push({ url, init });

    if (requests.length === 1) {
      throw new TypeError("ERR_UPLOAD_FILE_CHANGED");
    }

    return new Response(null, { status: 201 });
  });

  await respondToOrder(42, offer);

  assert.equal(requests.length, 2);

  for (const { url, init } of requests) {
    assert.ok(url.endsWith("/orders/42/responses"));
    assert.equal(init.method, "POST");
    assert.equal(init.credentials, "include");
    assert.deepEqual([...init.body.keys()], [
      "comment",
      "proposed_sum_amount",
      "proposed_start_date",
      "proposed_deadline",
      "vat_kind",
      "expert_inn",
      "expert_company_data",
      "files",
    ]);
    assert.equal(init.body.get("proposed_sum_amount"), "123456");
    assert.equal(init.body.get("proposed_start_date"), offer.proposed_start_date);
    assert.equal(init.body.get("proposed_deadline"), offer.proposed_deadline);
    assert.equal(init.body.get("vat_kind"), "VAT_22");
    assert.equal(init.body.get("expert_inn"), offer.expert_inn);
    assert.deepEqual(JSON.parse(init.body.get("expert_company_data")), offer.expert_company_data);
    assert.equal(await init.body.get("files").text(), "Offer bytes");
  }
});

test("empty company is sent as an object and optional start date is omitted", async (context) => {
  let body;
  context.mock.method(globalThis, "fetch", async (url, init) => {
    body = init.body;
    return new Response(null, { status: 201 });
  });

  await respondToOrder(42, {
    ...offer,
    proposed_start_date: "",
    expert_inn: "",
    expert_company_data: null,
    files: [],
  });

  assert.equal(body.has("proposed_start_date"), false);
  assert.equal(body.get("expert_company_data"), "{}");
  assert.equal(body.get("expert_inn"), "");
  assert.equal(body.has("files"), false);
});

test("HTTP subscription failure reaches the form without retrying the order", async (context) => {
  let requests = 0;
  context.mock.method(globalThis, "fetch", async () => {
    requests++;
    return Response.json({ detail: "Подписка не активна" }, { status: 402 });
  });

  await assert.rejects(respondToOrder(42, offer), /Подписка/);
  assert.equal(requests, 1);
});

test("file duplicates are ignored while changed files remain distinct", () => {
  const duplicate = new File(["Offer bytes"], "offer.pdf", {
    type: "application/pdf",
    lastModified: 1000,
  });
  const changed = new File(["New bytes"], "offer.pdf", {
    type: "application/pdf",
    lastModified: 2000,
  });
  const result = mergeResponseFiles([file], [duplicate, changed, changed]);

  assert.deepEqual(result, { files: [file, changed], error: null });
});

test("file count and total size limits accept their boundary and preserve existing drafts on failure", () => {
  const files = [...Array(6).keys()].map((index) => new File(["x"], `${index}.pdf`));
  assert.equal(mergeResponseFiles([], files).error, null);
  const countFailure = mergeResponseFiles(files, [file]);
  assert.equal(countFailure.files, files);
  assert.equal(countFailure.error, "Можно прикрепить не более 6 файлов");

  const limitFile = { name: "large.pdf", size: 100 * 1024 * 1024, type: "", lastModified: 0 };
  assert.equal(mergeResponseFiles([], [limitFile]).error, null);
  const current = [limitFile];
  const sizeFailure = mergeResponseFiles(current, [file]);
  assert.equal(sizeFailure.files, current);
  assert.equal(sizeFailure.error, "Суммарный размер файлов не должен превышать 100 МБ");
});

test("file previews are stable, removed individually and released on form unmount", (context) => {
  const created = [];
  const revoked = [];
  context.mock.method(URL, "createObjectURL", (selected) => {
    created.push(selected);
    return `blob:${created.length}`;
  });
  context.mock.method(URL, "revokeObjectURL", (url) => revoked.push(url));
  const runtime = { errors: [] };
  globalThis.responseFilesTest = runtime;

  useResponseFiles().addFiles([file]);
  const firstRender = useResponseFiles();
  firstRender.addFiles([file]);
  const secondRender = useResponseFiles();
  assert.equal(created.length, 1);
  assert.equal(secondRender.items[0].url, firstRender.items[0].url);
  secondRender.items[0].onRemove();
  assert.deepEqual(useResponseFiles().files, []);
  assert.deepEqual(revoked, ["blob:1"]);

  useResponseFiles().addFiles([file]);
  const tooMany = [...Array(6).keys()].map((index) => new File(["x"], `${index}.pdf`));
  useResponseFiles().addFiles(tooMany);
  assert.equal(created.length, 2);
  assert.deepEqual(useResponseFiles().files, [file]);
  assert.equal(runtime.errors.length, 1);
  runtime.cleanup();
  assert.deepEqual(revoked, ["blob:1", "blob:2"]);
});

test("VAT adds the selected rate to the base and handles non-finite values", () => {
  for (const [kind, rate] of [["NONE", 0], ["VAT_5", 5], ["VAT_7", 7], ["VAT_22", 22]]) {
    assert.deepEqual(calculateVat(1000, kind), {
      base: 1000,
      vatRate: rate,
      vatAmount: 10 * rate,
      total: 1000 + 10 * rate,
    });
  }

  assert.equal(calculateVat(Infinity, "VAT_22").total, 0);
  assert.equal(calculateVat(NaN, "NONE").total, 0);
});
