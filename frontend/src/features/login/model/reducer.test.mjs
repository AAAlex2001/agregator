import assert from "node:assert/strict";
import test from "node:test";
import { INITIAL_LOGIN_STATE, loginReducer } from "./reducer.ts";

test("changing credentials discards roles for the previous account", () => {
  const choosingRole = {
    ...INITIAL_LOGIN_STATE,
    email: "old@example.com",
    availableRoles: ["EXPERT", "CUSTOMER"],
  };
  const state = loginReducer(choosingRole, {
    type: "email/changed",
    email: "new@example.com",
  });

  assert.equal(state.email, "new@example.com");
  assert.deepEqual(state.availableRoles, []);
  assert.deepEqual(choosingRole.availableRoles, ["EXPERT", "CUSTOMER"]);
});

test("cancelling role choice preserves entered credentials", () => {
  const state = loginReducer({
    ...INITIAL_LOGIN_STATE,
    email: "user@example.com",
    password: "password",
    availableRoles: ["EXPERT", "CUSTOMER"],
  }, { type: "role/cancelled" });

  assert.equal(state.email, "user@example.com");
  assert.equal(state.password, "password");
  assert.deepEqual(state.availableRoles, []);
});

test("finishing a failed attempt keeps role choices available for retry", () => {
  const state = loginReducer({
    ...INITIAL_LOGIN_STATE,
    availableRoles: ["EXPERT"],
    isSubmitting: true,
  }, { type: "request/finished" });

  assert.equal(state.isSubmitting, false);
  assert.deepEqual(state.availableRoles, ["EXPERT"]);
});
