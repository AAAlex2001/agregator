import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";

const sourceRoot = new URL("../", import.meta.url);
const userRoot = new URL("entities/user/", sourceRoot);
const contextUrl = new URL("model/user-provider.ts", userRoot).href;

// Этот runner проверяет операции настоящих hooks; рендер React DOM проверяется отдельно.
const reactModule = `data:text/javascript,${encodeURIComponent(`
  export function useState(initial) {
    return globalThis.authRequestTestRuntime.useState(initial);
  }
  export function useReducer(reducer, initial) {
    const [state, setState] = useState(initial);
    return [state, (action) => setState((current) => reducer(current, action))];
  }
`)}`;
const contextModule = `data:text/javascript,${encodeURIComponent(`
  export function useUserContext() {
    return globalThis.authRequestTestRuntime.context;
  }
`)}`;
const userModule = `data:text/javascript,${encodeURIComponent(`
  export { useLoadUser } from "${new URL("model/use-load-user.ts", userRoot).href}";
  export { useSwitchAccountRole } from "${new URL("model/use-switch-account-role.ts", userRoot).href}";
  export { useConfirmEmail } from "${new URL("model/use-confirm-email.ts", userRoot).href}";
  export { useResendConfirmationCode } from "${new URL("model/use-resend-confirmation-code.ts", userRoot).href}";
`)}`;
const notificationsModule = `data:text/javascript,${encodeURIComponent(`
  export function useNotifications() {
    return globalThis.authRequestTestRuntime.notifications;
  }
`)}`;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "react") {
      return { url: reactModule, shortCircuit: true };
    }

    if (specifier === "@/entities/user") {
      return { url: userModule, shortCircuit: true };
    }

    if (specifier === "@/shared/ui/notifications") {
      return { url: notificationsModule, shortCircuit: true };
    }

    let url;

    if (specifier.startsWith("@/")) {
      url = new URL(`${specifier.slice(2)}.ts`, sourceRoot);
    } else if (specifier.startsWith(".") && context.parentURL) {
      url = new URL(`${specifier}.ts`, context.parentURL);
    }

    if (url?.href === contextUrl) {
      return { url: contextModule, shortCircuit: true };
    }

    if (url && existsSync(url)) {
      return nextResolve(url.href, context);
    }

    return nextResolve(specifier, context);
  },
});

const { useSwitchRole } = await import("./switch-role/model/use-switch-role.ts");
const { useConfirmEmailForm } = await import("./confirm-email/model/use-confirm-email-form.ts");
const { loadUserProfile } = await import("../entities/user/model/load-user-profile.ts");
const { createUserState, userReducer } = await import("../entities/user/model/reducer.ts");

const previousUser = { id: 11, role: "CUSTOMER" };
const nextUser = { id: 22, role: "EXPERT" };
const account = {
  ...nextUser,
  inn: null,
  email: "user@example.com",
  phone: null,
  created_at: "2026-10-16T00:00:00Z",
};

/** Хранит состояние выбранной формы и настоящий reducer пользовательской сессии. */
function createForm(kind = "switch") {
  const useForm = kind === "confirm" ? useConfirmEmailForm : useSwitchRole;
  const slots = [];
  const busy = [];
  const completed = [];
  const errors = [];
  const successes = [];
  let cursor = 0;
  let userState = userReducer(createUserState(null), {
    type: "user/changed",
    user: previousUser,
  });
  const context = {
    get state() {
      return userState;
    },
    dispatch(action) {
      userState = userReducer(userState, action);
    },
    profileRequestVersionRef: { current: 0 },
  };
  const runtime = {
    context,
    notifications: {
      showError: (message) => errors.push(message),
      showSuccess: (message) => successes.push(message),
    },
    useState(initial) {
      const index = cursor++;

      if (!(index in slots)) {
        slots[index] = initial;
      }

      return [
        slots[index],
        (next) => {
          slots[index] = typeof next === "function" ? next(slots[index]) : next;
        },
      ];
    },
  };

  return {
    context,
    busy,
    completed,
    errors,
    successes,
    get userState() {
      return userState;
    },
    render: function useTestForm() {
      cursor = 0;
      globalThis.authRequestTestRuntime = runtime;

      return useForm({
        email: "user@example.com",
        role: "EXPERT",
        onConfirmed: (user) => completed.push(user),
        onSwitched: (user) => completed.push(user),
        onBusyChange: (isBusy) => busy.push(isBusy),
      });
    },
  };
}

/** Выбирает подтверждённую роль и вводит пароль отдельными событиями формы. */
function enterCredentials(form) {
  form.render().selectRole({ role: "EXPERT", email_verified: true });
  form.render().setPasswordInput("Secret-123");
}

test("empty form and unverified role cannot start a request", async (context) => {
  let requests = 0;
  context.mock.method(globalThis, "fetch", async () => {
    requests++;
    return Response.json(account);
  });
  const form = createForm();

  await form.render().submit();
  form.render().selectRole({ role: "EXPERT", email_verified: false });
  assert.equal(form.render().state.selectedRole, null);

  form.render().selectRole({ role: "EXPERT", email_verified: true });
  await form.render().submit();

  assert.equal(form.render().state.selectedRole, "EXPERT");
  assert.equal(requests, 0);
  assert.deepEqual(form.busy, []);
});

test("wrong password sends one POST and preserves the current account", async (context) => {
  const requests = [];
  context.mock.method(globalThis, "fetch", async (url, options) => {
    requests.push({ url, options });
    return Response.json({ detail: "Wrong password" }, { status: 401 });
  });
  const form = createForm();
  enterCredentials(form);

  await form.render().submit();

  assert.equal(requests.length, 1);
  assert.ok(requests[0].url.endsWith("/login/switch-role"));
  assert.equal(requests[0].options.method, "POST");
  assert.equal(requests[0].options.credentials, "include");
  assert.deepEqual(JSON.parse(requests[0].options.body), {
    role: "EXPERT",
    password: "Secret-123",
  });
  assert.equal(form.render().state.error, "Wrong password");
  assert.equal(form.render().state.password, "Secret-123");
  assert.equal(form.render().canRetryProfile, false);
  assert.equal(form.userState.user, previousUser);
  assert.deepEqual(form.busy, [true, false]);
  assert.deepEqual(form.completed, []);
});

test("successful POST followed by failed profile retries only GET", async (context) => {
  const requests = [];
  let profiles = 0;
  context.mock.method(globalThis, "fetch", async (url, options) => {
    requests.push({ url, method: options.method ?? "GET" });

    if (url.endsWith("/login/switch-role")) {
      return Response.json(account);
    }

    assert.ok(url.endsWith("/settings/profile"));
    profiles++;

    return profiles === 1
      ? Response.json({ detail: "Profile unavailable" }, { status: 503 })
      : Response.json(nextUser);
  });
  const form = createForm();
  enterCredentials(form);
  await form.render().submit();

  assert.equal(form.render().canRetryProfile, true);
  assert.equal(form.render().state.password, "");
  assert.equal(form.render().state.selectedRole, "EXPERT");
  assert.equal(form.render().state.error, "Profile unavailable");
  assert.equal(form.render().state.isSubmitting, false);
  assert.equal(form.userState.user, null);
  assert.equal(form.userState.role, "EXPERT");
  assert.deepEqual(form.completed, []);

  form.render().setPasswordInput("Must not be sent again");
  assert.equal(form.render().state.password, "");
  await form.render().submit();

  assert.deepEqual(requests.map((request) => request.method), ["POST", "GET", "GET"]);
  assert.deepEqual(form.userState.user, nextUser);
  assert.deepEqual(form.completed, [nextUser]);
  assert.deepEqual(form.busy, [true, false, true, false]);
  assert.equal(form.render().state.selectedRole, null);
  assert.equal(form.render().state.isSubmitting, false);
});

test("cancel and another selection forget the confirmed account", async (context) => {
  context.mock.method(globalThis, "fetch", async (url) =>
    url.endsWith("/login/switch-role")
      ? Response.json(account)
      : Response.json({ detail: "Profile unavailable" }, { status: 503 }),
  );
  const form = createForm();
  enterCredentials(form);
  await form.render().submit();
  assert.equal(form.render().canRetryProfile, true);

  form.render().selectRole({ role: "LICENSE_HOLDER", email_verified: true });
  assert.equal(form.render().canRetryProfile, false);
  assert.equal(form.render().state.selectedRole, "LICENSE_HOLDER");
  assert.equal(form.render().state.error, null);
  form.render().setPasswordInput("Another-secret");
  form.render().cancel();

  assert.equal(form.render().state.selectedRole, null);
  assert.equal(form.render().state.password, "");
  assert.equal(form.render().canRetryProfile, false);
});

test("pending request blocks cancellation, role change and duplicate submit", async (context) => {
  let finishPost;
  let posts = 0;
  context.mock.method(globalThis, "fetch", async (url) => {
    if (url.endsWith("/login/switch-role")) {
      posts++;
      return new Promise((resolve) => {
        finishPost = resolve;
      });
    }

    return Response.json(nextUser);
  });
  const form = createForm();
  enterCredentials(form);
  const pending = form.render().submit();

  assert.equal(form.render().state.isSubmitting, true);
  form.render().cancel();
  form.render().selectRole({ role: "LICENSE_HOLDER", email_verified: true });
  form.render().setPasswordInput("Should be ignored");
  await form.render().submit();

  assert.equal(form.render().state.selectedRole, "EXPERT");
  assert.equal(form.render().state.password, "Secret-123");
  assert.equal(posts, 1);

  finishPost(Response.json(account));
  await pending;

  assert.deepEqual(form.completed, [nextUser]);
  assert.equal(form.render().state.isSubmitting, false);
});

test("late profile from the previous session cannot restore the old account", async (context) => {
  let finishPreviousProfile;
  let profiles = 0;
  context.mock.method(globalThis, "fetch", async (url) => {
    if (url.endsWith("/login/switch-role")) {
      return Response.json(account);
    }

    profiles++;

    if (profiles === 1) {
      return new Promise((resolve) => {
        finishPreviousProfile = resolve;
      });
    }

    return Response.json({ detail: "New profile unavailable" }, { status: 503 });
  });
  const form = createForm();
  const oldRequest = loadUserProfile(
    form.context.dispatch,
    form.context.profileRequestVersionRef,
  );
  enterCredentials(form);
  await form.render().submit();

  finishPreviousProfile(Response.json(previousUser));
  await assert.rejects(oldRequest, /Аккаунт изменился/);

  assert.equal(form.userState.user, null);
  assert.equal(form.userState.role, "EXPERT");
  assert.equal(form.userState.error, "New profile unavailable");
  assert.equal(form.render().canRetryProfile, true);
});

test("confirmed email retries only profile and never restores the previous account", async (context) => {
  const requests = [];
  let profiles = 0;
  context.mock.method(globalThis, "fetch", async (url, options) => {
    requests.push({ url, method: options.method ?? "GET" });

    if (url.endsWith("/register/confirm-email")) {
      assert.deepEqual(JSON.parse(options.body), {
        email: "user@example.com",
        code: "123456",
        role: "EXPERT",
      });
      return Response.json(account);
    }

    assert.ok(url.endsWith("/settings/profile"));
    profiles++;

    return profiles === 1
      ? Response.json({ detail: "Profile unavailable" }, { status: 503 })
      : Response.json(nextUser);
  });
  const form = createForm("confirm");
  form.render().changeCode("123456");
  await form.render().confirm();

  assert.equal(form.render().isEmailConfirmed, true);
  assert.equal(form.render().isBusy, false);
  assert.equal(form.userState.user, null);
  assert.equal(form.userState.role, "EXPERT");
  assert.deepEqual(form.errors, ["Profile unavailable"]);
  assert.deepEqual(form.completed, []);

  await form.render().resend();
  assert.equal(requests.length, 2);
  await form.render().confirm();

  assert.deepEqual(requests.map((request) => request.method), ["POST", "GET", "GET"]);
  assert.deepEqual(form.userState.user, nextUser);
  assert.deepEqual(form.completed, [nextUser]);
  assert.deepEqual(form.successes, ["Почта подтверждена"]);
  assert.deepEqual(form.busy, [true, false, true, false]);
  assert.equal(form.render().isBusy, false);
});

