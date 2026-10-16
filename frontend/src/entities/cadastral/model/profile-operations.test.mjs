import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { createCadastralProfileState, cadastralProfileReducer } from "./profile-state.ts";
import {
  createCadastralProfileValues,
  getCadastralProfileValues,
} from "./profile-values.ts";

/** Соединяет настоящие операции и reducer с контролируемыми ответами API. */
function createProfile(api, operation = "idle") {
  let state = {
    ...createCadastralProfileState({
      ...createCadastralProfileValues(),
      education: "Сохранённое образование",
      education_diploma: null,
      certificate_file: null,
      documents: [],
    }),
    operation,
  };
  const errors = [];
  const successes = [];
  const context = {
    get state() {
      return state;
    },
    dispatch(action) {
      state = cadastralProfileReducer(state, action);
    },
  };

  /** Подключает hook к сохранённой анкете и тестовым уведомлениям. */
  function loadHook(file, exportName) {
    const source = readFileSync(new URL(file, import.meta.url), "utf8");
    const compiled = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
      },
    }).outputText;
    const loadedHook = {
      exports: {},
      Error,
      require(path) {
        if (path === "./profile-provider") {
          return { useCadastralProfileContext: () => context };
        }
        if (path === "@/shared/ui/notifications") {
          return {
            useNotifications: () => ({
              showError: (message) => errors.push(message),
              showSuccess: (message) => successes.push(message),
            }),
          };
        }
        assert.ok(path.startsWith("../api/"));
        return api;
      },
    };

    runInNewContext(compiled, loadedHook);
    return loadedHook.exports[exportName]();
  }

  return { context, errors, successes, loadHook };
}

test("Ошибка второго документа сохраняет первый файл и несохранённые сведения", async () => {
  let uploads = 0;
  const document = { name: "Курсы.pdf", url: "/uploads/course.pdf" };
  const form = createProfile({
    async uploadCadastralDocument() {
      uploads += 1;
      if (uploads === 2) throw new Error("Второй документ не загружен");
      return {
        ...form.context.state.profile,
        education: "Старое значение API",
        documents: [document],
      };
    },
  });
  const draft = getCadastralProfileValues(form.context.state.profile);
  draft.education = "Несохранённое образование";
  const upload = form.loadHook("./use-upload-cadastral-documents.ts", "useUploadCadastralDocuments");

  await upload([{ name: "first.pdf" }, { name: "second.pdf" }]);

  assert.equal(uploads, 2);
  assert.deepEqual(form.context.state.profile.documents, [document]);
  assert.equal(form.context.state.profile.education, "Сохранённое образование");
  assert.equal(draft.education, "Несохранённое образование");
  assert.equal(form.context.state.operation, "idle");
  assert.deepEqual(form.errors, ["Второй документ не загружен"]);
});

test("Замена диплома и аттестата обновляет файлы без изменения полей анкеты", async () => {
  const diploma = { name: "Диплом.pdf", url: "/uploads/diploma.pdf" };
  const certificate = { name: "Аттестат.pdf", url: "/uploads/certificate.pdf" };
  const selectedFile = { name: "new.pdf" };
  const form = createProfile({
    async uploadCadastralDiploma(file) {
      assert.equal(file, selectedFile);
      return { ...form.context.state.profile, education: "Не применять", education_diploma: diploma };
    },
    async uploadCadastralCertificate(file) {
      assert.equal(file, selectedFile);
      return { ...form.context.state.profile, education: "Не применять", certificate_file: certificate };
    },
  });

  await form.loadHook("./use-upload-cadastral-diploma.ts", "useUploadCadastralDiploma")(selectedFile);
  await form.loadHook("./use-upload-cadastral-certificate.ts", "useUploadCadastralCertificate")(selectedFile);

  assert.equal(form.context.state.profile.education_diploma, diploma);
  assert.equal(form.context.state.profile.certificate_file, certificate);
  assert.equal(form.context.state.profile.education, "Сохранённое образование");
  assert.equal(form.context.state.operation, "idle");
});

test("Удаление использует исходный URL; отказ сервера оставляет документы", async () => {
  const document = { name: "Документ.pdf", url: "/uploads/document.pdf" };
  let shouldFail = true;
  const form = createProfile({
    async deleteCadastralDocument(url) {
      assert.equal(url, document.url);
      if (shouldFail) throw new Error("Удаление не удалось");
      return { ...form.context.state.profile, documents: [] };
    },
  });
  form.context.dispatch({
    type: "files/updated",
    profile: { ...form.context.state.profile, documents: [document] },
  });

  await form.loadHook("./use-delete-cadastral-document.ts", "useDeleteCadastralDocument")(document.url);
  assert.deepEqual(form.context.state.profile.documents, [document]);
  shouldFail = false;
  await form.loadHook("./use-delete-cadastral-document.ts", "useDeleteCadastralDocument")(document.url);
  assert.deepEqual(form.context.state.profile.documents, []);
  assert.equal(form.context.state.operation, "idle");
});

test("Ошибка сохранения допускает повтор; другая операция блокирует запрос", async () => {
  let shouldFail = true;
  let requests = 0;
  const form = createProfile({
    async updateCadastralProfile(fields) {
      requests += 1;
      assert.equal(Object.keys(fields).length, 7);
      assert.equal("documents" in fields, false);
      if (shouldFail) throw new Error("Сохранение не удалось");
      return { ...form.context.state.profile, ...fields, education: fields.education.trim() };
    },
  });
  const fields = getCadastralProfileValues(form.context.state.profile);
  fields.education = " Новое образование ";
  const save = form.loadHook("./use-save-cadastral-profile.ts", "useSaveCadastralProfile");

  assert.equal(await save(fields), null);
  assert.equal(form.context.state.profile.education, "Сохранённое образование");
  assert.equal(form.context.state.operation, "idle");
  shouldFail = false;
  const saved = await save(fields);
  assert.equal(saved.education, "Новое образование");
  assert.equal(form.context.state.profile, saved);
  assert.deepEqual(form.successes, ["Анкета сохранена"]);

  form.context.dispatch({ type: "upload/started" });
  const saveWhileBusy = form.loadHook("./use-save-cadastral-profile.ts", "useSaveCadastralProfile");
  assert.equal(await saveWhileBusy(fields), null);
  assert.equal(requests, 2);
});
