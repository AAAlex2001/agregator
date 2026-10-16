import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(".") && context.parentURL) {
      const url = new URL(`${specifier}.ts`, context.parentURL);

      if (existsSync(url)) {
        return nextResolve(url.href, context);
      }
    }

    return nextResolve(specifier, context);
  },
});

const { DESIGN_DOCUMENT_MAX_SIZE } = await import("../config/documents.ts");
const { validateDesignDocument } = await import("./documents.ts");

test("Документ размером ровно 10 МБ допустим, превышение отклоняется", () => {
  const allowed = new File([new Uint8Array(DESIGN_DOCUMENT_MAX_SIZE)], "diploma.pdf");
  const tooLarge = new File(
    [new Uint8Array(DESIGN_DOCUMENT_MAX_SIZE + 1)],
    "diploma.pdf",
  );

  assert.equal(validateDesignDocument(allowed), null);
  assert.notEqual(validateDesignDocument(tooLarge), null);
});

test("Расширение проверяется без учёта регистра; пустые и неизвестные файлы отклоняются", () => {
  assert.equal(validateDesignDocument(new File(["data"], "Диплом.PDF")), null);
  assert.notEqual(validateDesignDocument(new File(["data"], "Диплом.exe")), null);
  assert.notEqual(validateDesignDocument(new File(["data"], "Диплом")), null);
  assert.notEqual(validateDesignDocument(new File([], "Диплом.pdf")), null);
});
