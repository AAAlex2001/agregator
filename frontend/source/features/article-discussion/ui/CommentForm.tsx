"use client";

import { useState, type FormEvent } from "react";
import s from "./ArticleDiscussion.module.scss";

interface Props {
  placeholder: string;
  submitLabel?: string;
  onSubmit: (text: string) => Promise<void>;
}

export function CommentForm({ placeholder, submitLabel = "Отправить", onSubmit }: Props) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setBusy(true);
    setError("");
    try {
      await onSubmit(value);
      setText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось отправить");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className={s.form} onSubmit={submit}>
      <textarea
        className={s.textarea}
        rows={3}
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {error && <span className={s.error}>{error}</span>}
      <button className={s.submit} type="submit" disabled={busy}>
        {busy ? "Отправка…" : submitLabel}
      </button>
    </form>
  );
}
