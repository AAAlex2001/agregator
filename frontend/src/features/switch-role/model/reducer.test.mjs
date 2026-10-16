import assert from "node:assert/strict";
import test from "node:test";
import {
  INITIAL_SWITCH_ROLE_STATE,
  switchRoleReducer,
} from "./reducer.ts";

test("another role clears the previous password and error", () => {
  const state = switchRoleReducer({
    selectedRole: "EXPERT",
    password: "Secret-123",
    error: "Profile unavailable",
    isSubmitting: false,
  }, { type: "role/selected", role: "CUSTOMER" });

  assert.deepEqual(state, {
    ...INITIAL_SWITCH_ROLE_STATE,
    selectedRole: "CUSTOMER",
  });
});

test("request failure keeps the selected role and finishes separately", () => {
  const previous = {
    selectedRole: "EXPERT",
    password: "",
    error: null,
    isSubmitting: true,
  };
  const failed = switchRoleReducer(previous, {
    type: "request/failed",
    error: "Profile unavailable",
  });
  const finished = switchRoleReducer(failed, { type: "request/finished" });

  assert.equal(failed.isSubmitting, true);
  assert.equal(finished.isSubmitting, false);
  assert.equal(finished.selectedRole, "EXPERT");
  assert.equal(finished.error, "Profile unavailable");
  assert.equal(previous.error, null);
});

test("closing clears form fields and successful POST clears only the password", () => {
  const previous = {
    selectedRole: "EXPERT",
    password: "Secret-123",
    error: null,
    isSubmitting: true,
  };
  const confirmed = switchRoleReducer(previous, { type: "password/cleared" });

  assert.equal(confirmed.password, "");
  assert.equal(confirmed.selectedRole, "EXPERT");
  assert.equal(confirmed.isSubmitting, true);
  assert.deepEqual(
    switchRoleReducer(confirmed, { type: "form/closed" }),
    INITIAL_SWITCH_ROLE_STATE,
  );
});

