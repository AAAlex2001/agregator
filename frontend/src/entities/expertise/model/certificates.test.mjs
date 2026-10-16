import assert from "node:assert/strict";
import test from "node:test";
import { addCertificate } from "./certificates.ts";

const fields = {
  area: "Э1",
  object: "ТУ",
  category: "1",
  expiresAt: "2030-06-15",
};

test("Неполное удостоверение не добавляется в анкету", () => {
  const certificates = [];

  assert.equal(
    addCertificate(certificates, { ...fields, expiresAt: "" }),
    certificates,
  );
});

test("Повторное удостоверение не дублируется, срок передаётся датой", () => {
  const certificates = addCertificate([], {
    ...fields,
    expiresAt: "2030-06-15T00:00:00",
  });

  assert.equal(certificates[0].expires_at, "2030-06-15");
  assert.equal(addCertificate(certificates, fields), certificates);
});

test("Удостоверение с новым сроком действия считается отдельным", () => {
  const certificates = addCertificate([], fields);
  const result = addCertificate(certificates, {
    ...fields,
    expiresAt: "2031-06-15",
  });

  assert.equal(result.length, 2);
  assert.equal(certificates.length, 1);
});
