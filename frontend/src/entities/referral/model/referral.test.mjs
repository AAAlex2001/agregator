import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { formatPluses } from "./format-pluses.ts";
import {
  clearReferralCode,
  normalizeReferralCode,
  readReferralCode,
  saveReferralCode,
} from "./invitation.ts";
import { INITIAL_REFERRAL_STATE, referralReducer } from "./reducer.ts";

const code = "d64234b5-8fb8-4ed9-8762-0f6b237de4c0";

/** Подменяет браузер с хранилищем вкладки. */
function createBrowser() {
  const storage = new Map();

  globalThis.window = {
    sessionStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
    },
  };

  return globalThis.window;
}

afterEach(() => {
  delete globalThis.window;
});

test("Код приглашения приводится к UUID, ошибочные коды отклоняются", () => {
  assert.equal(normalizeReferralCode(` ${code.toUpperCase()} `), code);
  assert.equal(normalizeReferralCode(null), null);
  assert.equal(normalizeReferralCode(""), null);
  assert.equal(normalizeReferralCode("123"), null);
  assert.equal(normalizeReferralCode("javascript:alert(1)"), null);
  assert.equal(normalizeReferralCode(`${code}/extra`), null);
});

test("Приглашение безопасно читается при серверной отрисовке", () => {
  assert.equal(readReferralCode(), undefined);
  assert.doesNotThrow(() => saveReferralCode(code));
  assert.doesNotThrow(clearReferralCode);
});

test("Приглашение сохраняется во вкладке и очищается после регистрации", () => {
  createBrowser();

  saveReferralCode(code.toUpperCase());
  assert.equal(readReferralCode(), code);

  clearReferralCode();
  assert.equal(readReferralCode(), undefined);
});

test("Заблокированное хранилище не мешает регистрации", () => {
  const browser = createBrowser();

  Object.defineProperty(browser, "sessionStorage", {
    get() {
      throw new Error("Storage is blocked");
    },
  });

  assert.doesNotThrow(() => saveReferralCode(code));
  assert.equal(readReferralCode(), undefined);
  assert.doesNotThrow(clearReferralCode);
});

test("Баллы показываются плюсами с русскими формами слова", () => {
  assert.equal(formatPluses(1), "1 плюс");
  assert.equal(formatPluses(3), "3 плюса");
  assert.equal(formatPluses(0), "0 плюсов");
  assert.equal(formatPluses(21), "21 плюс");
  assert.equal(formatPluses(3_000).replace(/\s/g, " "), "3 000 плюсов");
  assert.equal(formatPluses(1_000_000).replace(/\s/g, " "), "1 000 000 плюсов");
});

test("Повтор очищает ошибку, успешный ответ возвращает данные программы", () => {
  const failed = referralReducer(INITIAL_REFERRAL_STATE, {
    type: "load/error",
    error: "Connection failed",
  });

  assert.equal(failed.isLoading, false);
  assert.equal(failed.error, "Connection failed");

  const retry = referralReducer(failed, { type: "load/retry" });

  assert.equal(retry.isLoading, true);
  assert.equal(retry.error, null);
  assert.equal(retry.attempt, 1);

  const overview = {
    balance_points: 3_000,
    invited_count: 2,
  };
  const loaded = referralReducer(retry, {
    type: "load/success",
    overview,
  });

  assert.equal(loaded.overview, overview);
  assert.equal(loaded.isLoading, false);
  assert.equal(loaded.error, null);
  assert.equal(INITIAL_REFERRAL_STATE.overview, null);
});
