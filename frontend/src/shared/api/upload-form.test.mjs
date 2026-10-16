import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";

const sourceRoot = new URL("../../", import.meta.url);

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

const { uploadForm } = await import("./upload-form.ts");
const file = new File(["Document bytes"], "document.pdf", {
  type: "application/pdf",
  lastModified: 1000,
});

/** Собирает проверяемую форму из тех файлов, которые передала попытка отправки. */
function options(files = [file]) {
  return {
    method: "POST",
    files,
    errorMessage: "Upload failed",
    createBody(currentFiles) {
      const body = new FormData();
      body.append("comment", "Offer");

      for (const currentFile of currentFiles) {
        body.append("files", currentFile);
      }

      return body;
    },
  };
}

test("successful upload sends the original files once with cookie credentials", async (context) => {
  const requests = [];
  context.mock.method(globalThis, "fetch", async (url, init) => {
    requests.push({ url, init });
    return Response.json({ ok: true });
  });

  await uploadForm("/upload", options());

  assert.equal(requests.length, 1);
  assert.ok(requests[0].url.endsWith("/upload"));
  assert.equal(requests[0].init.method, "POST");
  assert.equal(requests[0].init.credentials, "include");
  assert.equal(requests[0].init.body.get("files"), file);
});

for (const message of ["ERR_UPLOAD_FILE_CHANGED", "Failed to fetch"]) {
  test(`${message} rebuilds the body once from copies with identical bytes`, async (context) => {
    const bodies = [];
    context.mock.method(globalThis, "fetch", async (url, init) => {
      bodies.push(init.body);

      if (bodies.length === 1) {
        throw new TypeError(message);
      }

      return Response.json({ ok: true });
    });

    await uploadForm("/upload", options());

    assert.equal(bodies.length, 2);
    assert.notEqual(bodies[0], bodies[1]);
    const copy = bodies[1].get("files");
    assert.notEqual(copy, file);
    assert.equal(copy.name, file.name);
    assert.equal(copy.type, file.type);
    assert.equal(copy.lastModified, file.lastModified);
    assert.equal(await copy.text(), await file.text());
    assert.equal(bodies[1].get("comment"), "Offer");
  });
}

test("a second network failure is exposed without a third attempt", async (context) => {
  let requests = 0;
  context.mock.method(globalThis, "fetch", async () => {
    requests++;
    throw new TypeError("Failed to fetch");
  });

  await assert.rejects(uploadForm("/upload", options()), /Failed to fetch/);
  assert.equal(requests, 2);
});

for (const status of [401, 402, 413]) {
  test(`HTTP ${status} is reported without retry or session refresh`, async (context) => {
    let requests = 0;
    context.mock.method(globalThis, "fetch", async () => {
      requests++;
      return Response.json({ detail: "Server rejected upload" }, { status });
    });

    await assert.rejects(uploadForm("/upload", options()), /Server rejected upload/);
    assert.equal(requests, 1);
  });
}

test("unrelated errors and uploads without files are not retried", async (context) => {
  const errors = [
    new Error("Failed to fetch"),
    new TypeError("Another error"),
    new TypeError("Failed to fetch"),
  ];
  let requests = 0;
  context.mock.method(globalThis, "fetch", async () => {
    throw errors[requests++];
  });

  await assert.rejects(uploadForm("/upload", options()), errors[0]);
  await assert.rejects(uploadForm("/upload", options()), errors[1]);
  await assert.rejects(uploadForm("/upload", options([])), errors[2]);
  assert.equal(requests, 3);
});

test("an unreadable file stops before the second request", async (context) => {
  let requests = 0;
  const unreadable = new File(["bytes"], "unreadable.pdf");
  context.mock.method(unreadable, "arrayBuffer", async () => {
    throw new Error("Cannot read the selected file");
  });
  context.mock.method(globalThis, "fetch", async () => {
    requests++;
    throw new TypeError("ERR_UPLOAD_FILE_CHANGED");
  });

  await assert.rejects(uploadForm("/upload", options([unreadable])), /Cannot read/);
  assert.equal(requests, 1);
});
