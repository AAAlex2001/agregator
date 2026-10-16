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

const { AVATAR_MAX_SIZE } = await import("../config/avatar.ts");
const { validateAvatar } = await import("./avatar.ts");

test("Фото допустимого размера принимается в обоих поддерживаемых форматах", () => {
  for (const type of ["image/jpeg", "image/png"]) {
    const file = new File([new Uint8Array(AVATAR_MAX_SIZE)], "avatar", { type });

    assert.equal(validateAvatar(file), null);
  }
});

test("Превышение лимита хотя бы на один байт отклоняет фотографию", () => {
  const file = new File([new Uint8Array(AVATAR_MAX_SIZE + 1)], "avatar.png", {
    type: "image/png",
  });

  assert.equal(validateAvatar(file), "Размер фото не должен превышать 5 МБ");
});

test("Расширение jpg не позволяет отправить файл неподдерживаемого типа", () => {
  const file = new File(["not an image"], "avatar.jpg", {
    type: "text/plain",
  });

  assert.equal(validateAvatar(file), "Можно загрузить только JPG или PNG");
});
