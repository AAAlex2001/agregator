import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { setImmediate } from "node:timers/promises";
import { runInNewContext } from "node:vm";
import test from "node:test";
import * as jsxRuntime from "react/jsx-runtime";
import ts from "typescript";
import { removeArticleCommentBranch } from "../../../../entities/article/model/comment-branch.ts";

const sourceRoot = new URL("../../../../", import.meta.url);

/** Подключает настоящий модуль к контролируемым запросам и состоянию React. */
function loadModule(path, dependencies) {
  const source = readFileSync(new URL(path, sourceRoot), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const context = {
    exports: {},
    Error,
    require(name) {
      assert.ok(name in dependencies, name);
      return dependencies[name];
    },
  };

  runInNewContext(compiled, context);
  return context.exports;
}

/** Сохраняет значения hooks между рендерами и отдельно запускает эффекты. */
function createReactState() {
  const slots = [];
  const effects = [];
  const cleanups = [];
  let cursor = 0;

  return {
    api: {
      useState(initial) {
        const index = cursor++;
        if (!(index in slots)) {
          slots[index] = typeof initial === "function" ? initial() : initial;
        }

        return [slots[index], (value) => {
          slots[index] = typeof value === "function" ? value(slots[index]) : value;
        }];
      },
      useRef(initial) {
        const index = cursor++;
        slots[index] ??= { current: initial };
        return slots[index];
      },
      useEffect(effect) {
        const index = cursor++;
        if (!(index in slots)) {
          slots[index] = true;
          effects.push(effect);
        }
      },
    },
    render(callback) {
      cursor = 0;
      return callback();
    },
    mount() {
      cleanups.push(...effects.splice(0).map((effect) => effect()));
    },
    unmount() {
      for (const cleanup of cleanups) {
        cleanup?.();
      }
    },
  };
}

/** Создаёт обсуждение с настоящим provider и управляемым ответом GET. */
function createDiscussion(initialComments, getArticleComments) {
  const react = createReactState();
  const { ArticleCommentsProvider } = loadModule(
    "entities/article/model/comments-provider.tsx",
    {
      react: react.api,
      "react/jsx-runtime": jsxRuntime,
      "../api/get-comments": { getArticleComments },
      "./comment-branch": { removeArticleCommentBranch },
      "./comments-context": {
        ArticleCommentsContext: { Provider: "discussion-provider" },
      },
    },
  );

  return {
    mount: react.mount,
    unmount: react.unmount,
    render() {
      return react.render(() => ArticleCommentsProvider({
        articleId: 17,
        initialComments,
        children: null,
      })).props.value;
    },
  };
}

/** Подключает сценарий отправки или удаления к данным обсуждения. */
function createAction(file, exportName, article, options) {
  const react = createReactState();
  const errors = [];
  const loadedModule = loadModule(file, {
    react: react.api,
    "@/entities/article": article,
    "@/shared/ui/notifications": {
      useNotifications: () => ({
        showError: (message) => errors.push(message),
      }),
    },
  });

  return {
    errors,
    render() {
      return react.render(() => loadedModule[exportName](options));
    },
  };
}

test("SSR комментарии видны до GET, ответ уточняет принадлежность посетителю", async () => {
  let complete;
  const requests = [];
  const initial = [{ id: 1, is_mine: false }];
  const discussion = createDiscussion(initial, (articleId) => {
    requests.push(articleId);
    return new Promise((resolve) => {
      complete = resolve;
    });
  });

  assert.equal(discussion.render().comments, initial);
  assert.equal(requests.length, 0);
  discussion.mount();
  assert.deepEqual(requests, [17]);
  complete([{ id: 1, is_mine: true }]);
  await setImmediate();

  assert.equal(discussion.render().comments[0].is_mine, true);
});

test("Ошибка чтения и ответ после ухода не заменяют серверные комментарии", async () => {
  const initial = [{ id: 1 }];
  const failed = createDiscussion(initial, async () => {
    throw new Error("Недоступно");
  });
  failed.render();
  failed.mount();
  await setImmediate();
  assert.equal(failed.render().comments, initial);

  let complete;
  const closed = createDiscussion(initial, () => new Promise((resolve) => {
    complete = resolve;
  }));
  closed.render();
  closed.mount();
  closed.unmount();
  complete([{ id: 2 }]);
  await setImmediate();
  assert.equal(closed.render().comments, initial);
});

test("Поздний GET не убирает отправленный комментарий и не возвращает удалённую ветку", async () => {
  for (const operation of ["add", "delete"]) {
    let complete;
    const initial = [{ id: 1, parent_id: null }];
    const discussion = createDiscussion(initial, () => new Promise((resolve) => {
      complete = resolve;
    }));
    discussion.render();
    discussion.mount();

    if (operation === "add") {
      discussion.render().appendComment({ id: 2, parent_id: 1 });
    } else {
      discussion.render().removeCommentBranch(1);
    }

    complete(initial);
    await setImmediate();
    const ids = discussion.render().comments.map((comment) => comment.id).join(",");
    assert.equal(ids, operation === "add" ? "1,2" : "");
  }
});

test("Удаление убирает все уровни ответов и сохраняет соседние ветки", () => {
  const comments = [
    { id: 4, parent_id: 3 },
    { id: 3, parent_id: 2 },
    { id: 8, parent_id: 7 },
    { id: 2, parent_id: 1 },
    { id: 7, parent_id: null },
    { id: 1, parent_id: null },
  ];

  assert.deepEqual(removeArticleCommentBranch(comments, 1), [comments[2], comments[4]]);
  assert.deepEqual(removeArticleCommentBranch(comments, 99), comments);
  assert.equal(comments.length, 6);
});

test("Отправка очищает текст и закрывает ответ только после успеха, ошибка допускает повтор", async () => {
  let complete;
  let reject;
  let added = 0;
  const requests = [];
  const appended = [];
  const form = createAction(
    "features/add-article-comment/model/use-add-article-comment.ts",
    "useAddArticleComment",
    {
      useArticleComments: () => ({
        articleId: 17,
        appendComment: (comment) => appended.push(comment),
      }),
      addArticleComment(articleId, text, parentId) {
        requests.push({ articleId, text, parentId });
        return new Promise((resolve, fail) => {
          complete = resolve;
          reject = fail;
        });
      },
    },
    {
      parentId: 3,
      onAdded() {
        added += 1;
      },
    },
  );
  const event = { preventDefault() {} };
  form.render().setText("  ");
  await form.render().submit(event);
  assert.equal(requests.length, 0);
  form.render().setText("  Мой ответ  ");
  const failed = form.render().submit(event);
  await form.render().submit(event);
  assert.equal(requests.length, 1);
  assert.equal(form.render().isSending, true);
  reject(new Error("Повторите отправку"));
  await failed;

  assert.equal(form.render().text, "  Мой ответ  ");
  assert.equal(form.render().isSending, false);
  assert.deepEqual(form.errors, ["Повторите отправку"]);
  assert.equal(added, 0);
  const pending = form.render().submit(event);
  assert.deepEqual(requests[1], { articleId: 17, text: "Мой ответ", parentId: 3 });
  complete({ id: 5, parent_id: 3, is_mine: true });
  await pending;

  assert.equal(form.render().text, "");
  assert.equal(form.render().isSending, false);
  assert.equal(appended[0].id, 5);
  assert.equal(added, 1);
});

test("Подтверждение удаления сохраняет окно и ветку при ошибке, успех удаляет ветку", async () => {
  let complete;
  let reject;
  const requests = [];
  const removed = [];
  const deletion = createAction(
    "features/delete-article-comment/model/use-delete-article-comment.ts",
    "useDeleteArticleComment",
    {
      useArticleComments: () => ({
        removeCommentBranch: (commentId) => removed.push(commentId),
      }),
      deleteArticleComment(commentId) {
        requests.push(commentId);
        return new Promise((resolve, fail) => {
          complete = resolve;
          reject = fail;
        });
      },
    },
    3,
  );

  deletion.render().open();
  deletion.render().close();
  assert.equal(deletion.render().isOpen, false);
  deletion.render().open();
  const failed = deletion.render().confirm();
  deletion.render().close();
  await deletion.render().confirm();
  assert.equal(deletion.render().isOpen, true);
  assert.equal(deletion.render().isDeleting, true);
  assert.deepEqual(requests, [3]);
  reject(new Error("Удаление отклонено"));
  await failed;

  assert.equal(deletion.render().isOpen, true);
  assert.equal(deletion.render().isDeleting, false);
  assert.deepEqual(removed, []);
  assert.deepEqual(deletion.errors, ["Удаление отклонено"]);
  const pending = deletion.render().confirm();
  complete();
  await pending;

  assert.equal(deletion.render().isOpen, false);
  assert.equal(deletion.render().isDeleting, false);
  assert.deepEqual(removed, [3]);
});
