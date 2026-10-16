import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { createResearchProfileState, researchProfileReducer } from "./profile-state.ts";
import {
  changeAcademicDegree,
  createResearchProfileValues,
  getResearchProfileValues,
} from "./profile-values.ts";

test("Отсутствие степени очищает отрасли науки, сохраняя остальные поля", () => {
  const profile = {
    ...createResearchProfileValues(),
    academic_degree: "CANDIDATE",
    science_branches: ["TECHNICAL"],
    research_field: "Промышленная безопасность",
  };
  const changed = changeAcademicDegree(profile, "");

  assert.deepEqual(changed.science_branches, []);
  assert.equal(changed.research_field, profile.research_field);
  assert.deepEqual(profile.science_branches, ["TECHNICAL"]);
});

test("Смена одной степени на другую сохраняет выбранные отрасли", () => {
  const profile = {
    ...createResearchProfileValues(),
    academic_degree: "CANDIDATE",
    science_branches: ["TECHNICAL"],
  };

  assert.deepEqual(changeAcademicDegree(profile, "DOCTOR").science_branches, [
    "TECHNICAL",
  ]);
});

test("Черновик не меняет сохранённые отрасли науки", () => {
  const profile = {
    ...createResearchProfileValues(),
    science_branches: ["TECHNICAL"],
  };
  const fields = getResearchProfileValues(profile);

  fields.science_branches.push("PHYSICS");

  assert.deepEqual(profile.science_branches, ["TECHNICAL"]);
  assert.deepEqual(fields.science_branches, ["TECHNICAL", "PHYSICS"]);
});

test("Сохранение применяет ответ, ошибка оставляет анкету и освобождает форму", async () => {
  let state = createResearchProfileState(createResearchProfileValues());
  const profile = {
    academic_degree: "CANDIDATE",
    science_branches: ["TECHNICAL"],
    academic_title: "DOCENT",
    research_field: "Промышленная безопасность",
  };
  const errors = [];
  const successes = [];
  const requests = [];
  let shouldFail = false;
  const context = {
    get state() {
      return state;
    },
    dispatch(action) {
      state = researchProfileReducer(state, action);
    },
  };
  const loadedHook = {
    exports: {},
    Error,
    require(path) {
      if (path === "./profile-provider") {
        return { useResearchProfileContext: () => context };
      }
      if (path === "@/shared/ui/notifications") {
        return {
          useNotifications: () => ({
            showError: (message) => errors.push(message),
            showSuccess: (message) => successes.push(message),
          }),
        };
      }
      assert.equal(path, "../api/update-research-profile");
      return {
        async updateResearchProfile(fields) {
          requests.push(fields);
          assert.equal(state.isSaving, true);
          if (shouldFail) throw new Error("Ошибка сохранения НИР");
          return profile;
        },
      };
    },
  };
  const source = readFileSync(new URL("./use-save-research-profile.ts", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  runInNewContext(compiled, loadedHook);

  const save = loadedHook.exports.useSaveResearchProfile();
  const fields = getResearchProfileValues(profile);
  assert.equal(await save(fields), profile);
  assert.equal(requests[0], fields);
  assert.equal(state.profile, profile);
  assert.equal(state.isSaving, false);

  shouldFail = true;
  assert.equal(await save(createResearchProfileValues()), null);
  assert.equal(state.profile, profile);
  assert.equal(state.isSaving, false);
  assert.deepEqual(successes, ["Анкета сохранена"]);
  assert.deepEqual(errors, ["Ошибка сохранения НИР"]);

  context.dispatch({ type: "save/started" });
  const saveWhileBusy = loadedHook.exports.useSaveResearchProfile();
  assert.equal(await saveWhileBusy(fields), null);
  assert.equal(requests.length, 2);
});
