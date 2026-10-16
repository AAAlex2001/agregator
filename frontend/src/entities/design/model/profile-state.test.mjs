import assert from "node:assert/strict";
import test from "node:test";
import { createDesignProfileState, designProfileReducer } from "./profile-state.ts";
import { getDesignProfileValues } from "./profile-values.ts";

const profile = {
  education: "Образование",
  specialties: ["AR"],
  nok_passed: false,
  nrs_number: "",
  sro_gip_declared: false,
  qualification_courses: "",
  rtn_areas: [],
  education_documents: [],
  nok_documents: [],
  nrs_documents: [{ name: "НРС.pdf", url: "/uploads/nrs.pdf" }],
  qualification_documents: [],
  rtn_documents: [],
};

test("Ответ по документам не заменяет поля анкеты устаревшими значениями", () => {
  const state = createDesignProfileState(profile);
  const documents = {
    ...profile,
    education: "Устаревший ответ",
    education_documents: [{ name: "Диплом.pdf", url: "/uploads/diploma.pdf" }],
  };
  const updated = designProfileReducer(state, {
    type: "documents/updated",
    documents,
  });

  assert.equal(updated.profile.education, profile.education);
  assert.deepEqual(updated.profile.education_documents, documents.education_documents);
  assert.deepEqual(updated.profile.nrs_documents, profile.nrs_documents);
  assert.deepEqual(state.profile.education_documents, []);
});

test("Ошибка удаления оставляет документ и разрешает повторную попытку", () => {
  const state = createDesignProfileState(profile);
  const pending = designProfileReducer(state, { type: "delete/started" });
  const finished = designProfileReducer(pending, { type: "request/finished" });

  assert.equal(pending.operation, "deleting");
  assert.equal(finished.operation, "idle");
  assert.deepEqual(finished.profile.nrs_documents, profile.nrs_documents);
});

test("Ошибка второго файла сохраняет уже загруженный первый файл", () => {
  const started = designProfileReducer(createDesignProfileState(profile), {
    type: "upload/started",
  });
  const uploaded = designProfileReducer(started, {
    type: "documents/updated",
    documents: {
      ...profile,
      education_documents: [{ name: "Диплом.pdf", url: "/uploads/diploma.pdf" }],
    },
  });
  const finished = designProfileReducer(uploaded, { type: "request/finished" });

  assert.equal(uploaded.operation, "uploading");
  assert.equal(finished.operation, "idle");
  assert.deepEqual(finished.profile.education_documents, [
    { name: "Диплом.pdf", url: "/uploads/diploma.pdf" },
  ]);
  assert.deepEqual(finished.profile.nrs_documents, profile.nrs_documents);
});

test("Черновик содержит только редактируемые поля, без документов", () => {
  const draft = getDesignProfileValues(profile);

  assert.deepEqual(Object.keys(draft), [
    "education",
    "specialties",
    "nok_passed",
    "nrs_number",
    "sro_gip_declared",
    "qualification_courses",
    "rtn_areas",
  ]);
});

test("Сохранение принимает значения сервера и освобождает форму", () => {
  const started = designProfileReducer(createDesignProfileState(profile), {
    type: "save/started",
  });
  const saved = designProfileReducer(started, {
    type: "profile/saved",
    profile: { ...profile, education: "Новое образование" },
  });
  const finished = designProfileReducer(saved, { type: "request/finished" });

  assert.equal(finished.profile.education, "Новое образование");
  assert.equal(finished.operation, "idle");
});
