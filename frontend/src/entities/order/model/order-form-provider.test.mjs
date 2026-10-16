import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import test from "node:test";
import ts from "typescript";

const sourceRoot = new URL("../../../", import.meta.url);
const reactModule = `data:text/javascript,${encodeURIComponent(`
  export function createContext() { return { Provider: 'provider' }; }
  export function useContext() { return globalThis.orderFormProviderTest.context; }
  export function useReducer(reducer, initial, create) {
    const runtime = globalThis.orderFormProviderTest;
    runtime.state ??= create(initial);
    return [runtime.state, action => { runtime.state = reducer(runtime.state, action); }];
  }
  export function useRef(initial) {
    const runtime = globalThis.orderFormProviderTest;
    runtime.ref ??= { current: initial };
    return runtime.ref;
  }
  export function useEffect(effect) {
    globalThis.orderFormProviderTest.effect ??= effect;
  }
`)}`;
const jsxModule = `data:text/javascript,${encodeURIComponent(`
  export function jsx(type, props, key) { return { type, props, key }; }
`)}`;
const notificationsModule = `data:text/javascript,${encodeURIComponent(`
  export function useNotifications() {
    return { showError: message => globalThis.orderFormProviderTest.errors.push(message) };
  }
`)}`;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "react") {
      return { url: reactModule, shortCircuit: true };
    }

    if (specifier === "react/jsx-runtime") {
      return { url: jsxModule, shortCircuit: true };
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

    if (url && !existsSync(url)) {
      url = new URL(url.href.replace(/\.ts$/, ".tsx"));
    }

    return url && existsSync(url)
      ? nextResolve(url.href, context)
      : nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (!url.endsWith(".tsx")) {
      return nextLoad(url, context);
    }

    return {
      format: "module",
      shortCircuit: true,
      source: ts.transpileModule(readFileSync(new URL(url), "utf8"), {
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          jsx: ts.JsxEmit.ReactJSX,
          target: ts.ScriptTarget.ES2022,
        },
      }).outputText,
    };
  },
});

const { OrderFormProvider } = await import("./order-form-provider.tsx");
const { useOrderFormFiles } = await import("./use-order-form-files.ts");
const { getOrderDocumentsRequest } = await import("./order-form-request.ts");
const source = {
  customer: {
    first_name: "Иван",
    last_name: "Иванов",
    inn: "1234567890",
    phone: "79990000000",
    email: "user@example.test",
    company_data: { value: "Компания" },
    directions: ["EXPERTISE"],
  },
  badgeCodes: [],
  copySourceOrderId: null,
};

/** Перерисовывает настоящий provider, сохраняя reducer и эффект владения URL. */
function mountProvider() {
  const runtime = { errors: [] };

  function render(children = "fields") {
    globalThis.orderFormProviderTest = runtime;
    const element = OrderFormProvider({ source, children });
    runtime.context = element.props.value;
    runtime.cleanup ??= runtime.effect();
  }

  render();

  return {
    get values() {
      return runtime.state;
    },
    errors: runtime.errors,
    render,
    close: () => runtime.cleanup(),
    useFormActions() {
      render();
      return useOrderFormFiles();
    },
  };
}

test("previews survive switching to help and are released on replacement, removal and provider close", (context) => {
  let created = 0;
  const removed = [];
  context.mock.method(URL, "createObjectURL", () => `blob:test-${++created}`);
  context.mock.method(URL, "revokeObjectURL", (url) => removed.push(url));
  const form = mountProvider();
  const first = new File(["first"], "first.pdf");
  const replacement = new File(["replacement"], "replacement.pdf");
  const attachment = new File(["attachment"], "attachment.pdf");
  form.useFormActions().addFile("technical", first);
  form.useFormActions().addFile("technical", replacement);
  form.useFormActions().addOtherFiles([attachment]);
  form.render("help");
  form.render("fields");

  assert.equal(created, 3);
  assert.deepEqual(removed, ["blob:test-1"]);
  assert.equal(form.values.files.technical.previewUrl, "blob:test-2");
  assert.equal(getOrderDocumentsRequest(form.values).files.technical, replacement);
  form.useFormActions().removeFile(attachment);
  assert.deepEqual(removed, ["blob:test-1", "blob:test-3"]);
  form.close();
  assert.deepEqual(removed, ["blob:test-1", "blob:test-3", "blob:test-2"]);
});

test("rejected file additions do not create or revoke previews", (context) => {
  let created = 0;
  const removed = [];
  context.mock.method(URL, "createObjectURL", () => `blob:test-${++created}`);
  context.mock.method(URL, "revokeObjectURL", (url) => removed.push(url));
  const form = mountProvider();
  const file = new File(["large"], "large.pdf");
  Object.defineProperty(file, "size", { value: 60 * 1024 * 1024 });
  form.useFormActions().addFile("technical", file);
  form.useFormActions().addFile("technical", file);
  form.useFormActions().addOtherFiles([file]);

  assert.equal(created, 1);
  assert.deepEqual(removed, []);
  assert.equal(form.errors.length, 2);
  form.close();
  assert.deepEqual(removed, ["blob:test-1"]);
});

test("remounting the form clears the previous account's files and owns a separate preview set", (context) => {
  let created = 0;
  const removed = [];
  context.mock.method(URL, "createObjectURL", () => `blob:test-${++created}`);
  context.mock.method(URL, "revokeObjectURL", (url) => removed.push(url));
  const first = mountProvider();
  first.useFormActions().addOtherFiles([new File(["one"], "one.pdf")]);
  first.close();
  const second = mountProvider();

  assert.deepEqual(second.values.files.other, []);
  second.useFormActions().addOtherFiles([new File(["two"], "two.pdf")]);
  assert.deepEqual(removed, ["blob:test-1"]);
  second.close();
  assert.deepEqual(removed, ["blob:test-1", "blob:test-2"]);
});
