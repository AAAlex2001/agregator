import assert from "node:assert/strict";
import test from "node:test";
import {
  getSettingsTabs,
  resolveSettingsSection,
} from "../source/widgets/profile/settings/model/sections.ts";

test("Ссылки на вкладки исполнителя открывают нужный раздел", () => {
  for (const section of ["personal", "notifications", "subscription", "referrals"]) {
    assert.equal(resolveSettingsSection(section, "EXPERT"), section);
  }
});

test("Заказчик и держатель документов не получают платные разделы исполнителя", () => {
  for (const role of ["CUSTOMER", "LICENSE_HOLDER"]) {
    assert.deepEqual(getSettingsTabs(role).map((tab) => tab.id), ["personal", "notifications"]);
    assert.equal(resolveSettingsSection("subscription", role), "personal");
    assert.equal(resolveSettingsSection("referrals", role), "personal");
  }
});

test("Неизвестная вкладка и вход без параметра открывают личные данные", () => {
  for (const role of ["EXPERT", "CUSTOMER", "LICENSE_HOLDER", null]) {
    assert.equal(resolveSettingsSection(null, role), "personal");
    assert.equal(resolveSettingsSection("unknown", role), "personal");
  }
});
