import assert from "node:assert/strict";
import test from "node:test";
import { getSettingsTabs, resolveSettingsSection } from "./sections.ts";

test("Ссылки на вкладки исполнителя открывают нужный раздел", () => {
  assert.equal(resolveSettingsSection("personal", "EXPERT"), "personal");
  assert.equal(resolveSettingsSection("notifications", "EXPERT"), "notifications");
  assert.equal(resolveSettingsSection("subscription", "EXPERT"), "subscription");
  assert.equal(resolveSettingsSection("referrals", "EXPERT"), "referrals");
});

test("Заказчик и держатель документов не получают платные разделы исполнителя", () => {
  const customerTabs = getSettingsTabs("CUSTOMER").map((tab) => tab.id);
  const holderTabs = getSettingsTabs("LICENSE_HOLDER").map((tab) => tab.id);

  assert.deepEqual(customerTabs, ["personal", "notifications"]);
  assert.deepEqual(holderTabs, ["personal", "notifications"]);
  assert.equal(resolveSettingsSection("subscription", "CUSTOMER"), "personal");
  assert.equal(resolveSettingsSection("referrals", "LICENSE_HOLDER"), "personal");
});

test("Неизвестная вкладка и вход без параметра открывают личные данные", () => {
  assert.equal(resolveSettingsSection(null, "EXPERT"), "personal");
  assert.equal(resolveSettingsSection("unknown", "CUSTOMER"), "personal");
  assert.equal(resolveSettingsSection("subscription", null), "personal");
});
