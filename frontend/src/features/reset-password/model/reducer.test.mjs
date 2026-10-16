import assert from "node:assert/strict";
import test from "node:test";
import {
  INITIAL_RESET_PASSWORD_STATE,
  resetPasswordReducer,
} from "./reducer.ts";

test("a failed code request keeps the user on the code step with their input", () => {
  const state = resetPasswordReducer({
    ...INITIAL_RESET_PASSWORD_STATE,
    step: "code",
    email: "user@example.com",
    code: "123456",
    isSubmitting: true,
  }, { type: "request/failed" });

  assert.equal(state.step, "code");
  assert.equal(state.code, "123456");
  assert.equal(state.isSubmitting, false);
});

test("successful checks advance email to code and code to password", () => {
  const code = resetPasswordReducer({
    ...INITIAL_RESET_PASSWORD_STATE,
    email: "user@example.com",
  }, { type: "email/sent" });
  const password = resetPasswordReducer({
    ...code,
    code: "123456",
  }, { type: "code/confirmed" });

  assert.equal(code.step, "code");
  assert.equal(password.step, "password");
  assert.equal(password.email, "user@example.com");
  assert.equal(password.code, "123456");
});

test("completed recovery clears the password and one-time code", () => {
  const state = resetPasswordReducer({
    ...INITIAL_RESET_PASSWORD_STATE,
    step: "password",
    code: "123456",
    password: "Secret-123",
    repeatPassword: "Secret-123",
    isSubmitting: true,
  }, { type: "password/saved" });

  assert.equal(state.step, "done");
  assert.equal(state.password, "");
  assert.equal(state.repeatPassword, "");
  assert.equal(state.code, "");
  assert.equal(state.isSubmitting, false);
});
