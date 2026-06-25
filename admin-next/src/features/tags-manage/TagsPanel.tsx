"use client";

import { useEffect, useState } from "react";
import { Tag, createTag, deleteTag, listTags, renameTag } from "@/entities/tag";

export function TagsPanel() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    listTags()
      .then(setTags)
      .catch(() => {});
  }, []);

  const sortByName = (list: Tag[]) => [...list].sort((a, b) => a.name.localeCompare(b.name));

  const add = async () => {
    const value = name.trim();
    if (!value) return;
    setBusy(true);
    try {
      const tag = await createTag(value);
      setTags((prev) => (prev.some((t) => t.id === tag.id) ? prev : sortByName([...prev, tag])));
      setName("");
    } catch {
      alert("Не удалось добавить тег");
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setEditName(tag.name);
  };

  const saveEdit = async () => {
    if (editingId === null) return;
    const value = editName.trim();
    if (!value) return;
    try {
      const updated = await renameTag(editingId, value);
      setTags((prev) => sortByName(prev.map((t) => (t.id === updated.id ? updated : t))));
      setEditingId(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Не удалось переименовать тег");
    }
  };

  const remove = async (id: number) => {
    try {
      await deleteTag(id);
      setTags((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert("Не удалось удалить тег");
    }
  };

  return (
    <div className="tags-panel">
      <div className="tags-head">
        <strong>Теги</strong>
        <div className="tags-add">
          <input
            placeholder="Новый тег"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void add();
            }}
          />
          <button type="button" onClick={() => void add()} disabled={busy}>
            Добавить
          </button>
        </div>
      </div>

      <div className="tag-list">
        {tags.length === 0 ? (
          <span className="muted">Тегов пока нет.</span>
        ) : (
          tags.map((tag) =>
            editingId === tag.id ? (
              <span className="tag-chip editing" key={tag.id}>
                <input
                  value={editName}
                  autoFocus
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void saveEdit();
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
                <button type="button" className="tag-action" onClick={() => void saveEdit()} title="Сохранить">
                  ✓
                </button>
                <button type="button" className="tag-action" onClick={() => setEditingId(null)} title="Отмена">
                  ×
                </button>
              </span>
            ) : (
              <span className="tag-chip" key={tag.id}>
                {tag.name}
                <button type="button" className="tag-action" onClick={() => startEdit(tag)} title="Переименовать">
                  ✎
                </button>
                <button type="button" className="tag-action" onClick={() => void remove(tag.id)} title="Удалить">
                  ×
                </button>
              </span>
            ),
          )
        )}
      </div>
    </div>
  );
}
