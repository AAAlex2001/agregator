import assert from "node:assert/strict";
import test from "node:test";
import { createUserState, userReducer } from "./reducer.ts";

test("Сохранение обновляет данные открытого аккаунта", () => {
  const user = {
    id: 17,
    role: "EXPERT",
    first_name: "Антон",
  };
  const loaded = userReducer(createUserState(null), {
    type: "profile/loaded",
    user,
  });
  const savedUser = {
    ...user,
    first_name: "Александр",
  };
  const updated = userReducer(loaded, {
    type: "profile/updated",
    user: savedUser,
  });

  assert.equal(updated.user, savedUser);
  assert.equal(updated.role, "EXPERT");
  assert.equal(updated.isLoading, false);
});

test("Поздний ответ сохранения не восстанавливает пользователя после выхода", () => {
  const loggedOut = userReducer(createUserState(null), {
    type: "user/changed",
    user: null,
  });
  const afterResponse = userReducer(loggedOut, {
    type: "profile/updated",
    user: {
      id: 17,
      role: "EXPERT",
      first_name: "Александр",
    },
  });

  assert.equal(afterResponse, loggedOut);
  assert.equal(afterResponse.user, null);
});

test("Ответ старого аккаунта не мешает загрузке и работе новой роли", () => {
  const switching = userReducer(createUserState("EXPERT"), {
    type: "account/authenticated",
    role: "CUSTOMER",
  });
  const oldResponse = {
    type: "profile/updated",
    user: {
      id: 17,
      role: "EXPERT",
      first_name: "Александр",
    },
  };
  const whileLoading = userReducer(switching, oldResponse);

  assert.equal(whileLoading, switching);
  assert.equal(whileLoading.role, "CUSTOMER");
  assert.equal(whileLoading.isLoading, true);

  const newAccount = userReducer(whileLoading, {
    type: "profile/loaded",
    user: {
      id: 28,
      role: "CUSTOMER",
      first_name: "Ольга",
    },
  });

  assert.equal(userReducer(newAccount, oldResponse), newAccount);
});
