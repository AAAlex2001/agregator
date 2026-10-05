import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import {
  clearReferralCode,
  normalizeReferralCode,
  readReferralCode,
  saveReferralCode,
} from "../source/entities/referral/model/invitation.ts";
import { formatBonusAmount } from "../source/entities/referral/model/formatBonusAmount.ts";
import { initialReferralState, referralReducer } from "../source/features/referrals/invite-colleague/model/reducer.ts";

const code = "d64234b5-8fb8-4ed9-8762-0f6b237de4c0";
const anotherCode = "80ea2453-29f2-4e43-9e9f-922cd60ce6b7";

function createBrowser(search = "") {
  const storage = new Map();
  globalThis.window = {
    location: { search },
    sessionStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
    },
  };
  return globalThis.window;
}

afterEach(() => { delete globalThis.window; });

test("normalizes UUID and rejects malformed invitation codes", () => {
  assert.equal(normalizeReferralCode(` ${code.toUpperCase()} `), code);
  for (const value of [null, "", "123", "javascript:alert(1)", `${code}/extra`]) {
    assert.equal(normalizeReferralCode(value), undefined);
  }
});

test("invitation helpers are safe during server rendering", () => {
  assert.equal(readReferralCode(), undefined);
  assert.doesNotThrow(() => saveReferralCode(code));
  assert.doesNotThrow(clearReferralCode);
});

test("keeps invitation across navigation in the same tab", () => {
  const browser = createBrowser(`?ref=${code}`);
  saveReferralCode(code);
  browser.location.search = "";
  assert.equal(readReferralCode(), code);
});

test("new invitation takes priority over previously saved code", () => {
  createBrowser(`?ref=${anotherCode}`);
  saveReferralCode(code);
  assert.equal(readReferralCode(), anotherCode);
});

test("malformed current invitation does not silently use a previous inviter", () => {
  createBrowser("?ref=broken");
  saveReferralCode(code);
  assert.equal(readReferralCode(), undefined);
});

test("registration can clear saved invitation", () => {
  createBrowser();
  saveReferralCode(code);
  clearReferralCode();
  assert.equal(readReferralCode(), undefined);
});

test("blocked storage does not prevent registration from a direct link", () => {
  const browser = createBrowser(`?ref=${code}`);
  Object.defineProperty(browser, "sessionStorage", {
    get() { throw new Error("Storage is blocked"); },
  });
  assert.doesNotThrow(() => saveReferralCode(code));
  assert.equal(readReferralCode(), code);
  assert.doesNotThrow(clearReferralCode);
  browser.location.search = "";
  assert.equal(readReferralCode(), undefined);
});

test("converts kopecks without multiplying the displayed bonus", () => {
  assert.equal(formatBonusAmount(300_000).replace(/\s/g, " "), "3 000 ₽");
  assert.equal(formatBonusAmount(12_345).replace(/\s/g, " "), "123,45 ₽");
  assert.equal(formatBonusAmount(0).replace(/\s/g, " "), "0 ₽");
});

test("retry clears failure and a successful request restores referral data", () => {
  const failed = referralReducer(initialReferralState, { type: "LOAD_FAILED", error: "Connection failed" });
  assert.equal(failed.isLoading, false);
  assert.equal(failed.error, "Connection failed");
  const retry = referralReducer(failed, { type: "LOAD_REQUESTED" });
  assert.equal(retry.isLoading, true);
  assert.equal(retry.error, null);
  assert.equal(retry.requestNumber, 1);
  const overview = { balance_kopecks: 300_000, invited_count: 2 };
  const loaded = referralReducer(retry, { type: "LOAD_SUCCEEDED", overview });
  assert.equal(loaded.overview, overview);
  assert.equal(loaded.isLoading, false);
  assert.equal(loaded.error, null);
  assert.equal(initialReferralState.overview, null);
});
