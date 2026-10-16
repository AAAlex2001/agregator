import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { createEcologyProfileState, ecologyProfileReducer } from "./profile-state.ts";
import { getEcologyProfileValues } from "./profile-values.ts";

/** Настоящие операции и reducer с контролируемыми ответами API. */
function createProfile(api, operation = "idle") {
  let state = {
    ...createEcologyProfileState({
      work_types: ["REPORTS"],
      practical_skills: "Сохранённые навыки",
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
      state = ecologyProfileReducer(state, action);
    },
  };

  /** Подключает отдельный hook к тому же состоянию сохранённой анкеты. */
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
          return { useEcologyProfileContext: () => context };
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

test("Ошибка второго файла сохраняет первый документ и не заменяет поля анкеты", async () => {
  const calls = [];
  const document = { name: "Диплом.pdf", url: "/uploads/diploma.pdf" };
  const form = createProfile({
    async uploadEcologyDocument(file) {
      calls.push(file);
      if (calls.length === 2) throw new Error("Не удалось загрузить второй файл");
      return {
        work_types: ["OTHER"],
        practical_skills: "Поля из ответа документа",
        documents: [document],
      };
    },
  });
  const draft = getEcologyProfileValues(form.context.state.profile);
  draft.practical_skills = "Несохранённые навыки";
  draft.work_types.push("NEW");
  const upload = form.loadHook("./use-upload-ecology-documents.ts", "useUploadEcologyDocuments");

  await upload([{ name: "first.pdf" }, { name: "second.pdf" }]);

  assert.equal(calls.length, 2);
  assert.deepEqual(form.context.state.profile.documents, [document]);
  assert.deepEqual(form.context.state.profile.work_types, ["REPORTS"]);
  assert.equal(form.context.state.profile.practical_skills, "Сохранённые навыки");
  assert.deepEqual(draft.work_types, ["REPORTS", "NEW"]);
  assert.equal(draft.practical_skills, "Несохранённые навыки");
  assert.equal(form.context.state.operation, "idle");
  assert.deepEqual(form.errors, ["Не удалось загрузить второй файл"]);
});

test("Удаление применяет документы ответа, сохраняя остальные поля", async () => {
  let deletedUrl;
  const form = createProfile({
    async deleteEcologyDocument(url) {
      deletedUrl = url;
      return { work_types: [], practical_skills: "", documents: [] };
    },
  });
  const remove = form.loadHook("./use-delete-ecology-document.ts", "useDeleteEcologyDocument");

  await remove("/uploads/document.pdf");

  assert.equal(deletedUrl, "/uploads/document.pdf");
  assert.deepEqual(form.context.state.profile.work_types, ["REPORTS"]);
  assert.equal(form.context.state.profile.practical_skills, "Сохранённые навыки");
  assert.equal(form.context.state.operation, "idle");
});

test("Сохранение возвращает нормализованный профиль, ошибка сохраняет предыдущий", async () => {
  const profile = { work_types: ["NEW"], practical_skills: "Новые навыки", documents: [] };
  let shouldFail = false;
  const form = createProfile({
    async updateEcologyProfile() {
      if (shouldFail) throw new Error("Ошибка сохранения");
      return profile;
    },
  });
  const save = form.loadHook("./use-save-ecology-profile.ts", "useSaveEcologyProfile");

  assert.equal(await save(getEcologyProfileValues(profile)), profile);
  assert.equal(form.context.state.profile, profile);
  shouldFail = true;
  assert.equal(await save({ work_types: [], practical_skills: "Другой текст" }), null);
  assert.equal(form.context.state.profile, profile);
  assert.equal(form.context.state.operation, "idle");
  assert.deepEqual(form.successes, ["Анкета сохранена"]);
  assert.deepEqual(form.errors, ["Ошибка сохранения"]);
});

test("Другая текущая операция запрещает параллельную загрузку документов", async () => {
  let requests = 0;
  const form = createProfile({
    async uploadEcologyDocument() {
      requests += 1;
    },
  }, "saving");
  const upload = form.loadHook("./use-upload-ecology-documents.ts", "useUploadEcologyDocuments");

  await upload([{ name: "document.pdf" }]);

  assert.equal(requests, 0);
  assert.equal(form.context.state.operation, "saving");
});
