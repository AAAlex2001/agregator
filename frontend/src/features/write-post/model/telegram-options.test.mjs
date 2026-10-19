import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";

registerHooks({
  resolve(specifier, context, nextResolve) {
    const isRelative = specifier.startsWith(".") && context.parentURL;
    const url = isRelative ? new URL(`${specifier}.ts`, context.parentURL) : null;

    return url && existsSync(url)
      ? nextResolve(url.href, context)
      : nextResolve(specifier, context);
  },
});

const { addButtonRow, addButtonToRow, changeButton, removeButton } = await import("./buttons.ts");
const { addPollOption, changePollOption, removePollOption } = await import("./poll.ts");
const { EMPTY_BUTTON, EMPTY_POLL } = await import("../config/telegram-options.ts");

const link = { ...EMPTY_BUTTON, text: "Сайт", value: "https://plus-resurs.com" };

test("rows and buttons are added without changing the original", () => {
  const rows = [[link]];

  const withRow = addButtonRow(rows);
  const withButton = addButtonToRow(rows, 0);

  assert.deepEqual(withRow, [[link], [EMPTY_BUTTON]]);
  assert.deepEqual(withButton, [[link, EMPTY_BUTTON]]);
  assert.deepEqual(rows, [[link]]);
});

test("a button is replaced in its place", () => {
  const changed = changeButton([[link, EMPTY_BUTTON]], 0, 1, { ...EMPTY_BUTTON, text: "Ещё" });

  assert.equal(changed[0][0], link);
  assert.equal(changed[0][1].text, "Ещё");
});

test("removing the last button removes its row", () => {
  const rows = [[link], [EMPTY_BUTTON, link]];

  assert.deepEqual(removeButton(rows, 0, 0), [[EMPTY_BUTTON, link]]);
  assert.deepEqual(removeButton(rows, 1, 0), [[link], [link]]);
});

test("poll options are added, changed and removed", () => {
  const withThree = addPollOption(EMPTY_POLL);
  const named = changePollOption(withThree, 2, "Не знаю");

  assert.deepEqual(named.options, ["", "", "Не знаю"]);
  assert.deepEqual(removePollOption(named, 0).options, ["", "Не знаю"]);
  assert.deepEqual(EMPTY_POLL.options, ["", ""]);
});
