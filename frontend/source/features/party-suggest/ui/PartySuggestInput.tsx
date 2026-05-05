"use client";

import { useEffect, useRef, useState } from "react";
import Loader from "@/source/shared/ui/Loader";
import { fetchPartySuggestions, type PartySuggestion } from "../api/parties.api";
import s from "./PartySuggestInput.module.scss";

interface Props {
  value: string;
  onChange: (query: string, picked: PartySuggestion | null) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export function PartySuggestInput({ value, onChange, placeholder, error, disabled }: Props) {
  const [items, setItems] = useState<PartySuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const lastPickedRef = useRef<string | null>(null);

  useEffect(() => {
    if (disabled) return;
    const q = value.trim();
    if (q.length < 2) {
      setItems([]);
      setLoading(false);
      return;
    }
    if (lastPickedRef.current === value) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const handle = window.setTimeout(async () => {
      try {
        const res = await fetchPartySuggestions(q);
        if (!cancelled) setItems(res);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [value, disabled]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const showDropdown = open && value.trim().length >= 2 && (loading || items.length > 0 || (!loading && items.length === 0));

  return (
    <div ref={wrapRef} className={s.outer}>
      <div className={s.inputWrapper}>
        <input
          className={`${s.input} ${error ? s.inputError : ""} ${showDropdown ? s.inputOpen : ""}`.trim()}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value, null);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder ?? "ИНН или название компании"}
          autoComplete="off"
          disabled={disabled}
        />
      </div>

      {showDropdown && (
        <div className={s.dropdown}>
          {items.length > 0 ? (
            <ul className={s.list}>
              {items.map((p, index) => (
                <li key={`${p.data.inn ?? p.value}-${p.data.kpp ?? ""}-${index}`}>
                  <button
                    type="button"
                    className={s.option}
                    onClick={() => {
                      lastPickedRef.current = p.value;
                      onChange(p.value, p);
                      setOpen(false);
                    }}
                  >
                    <span className={s.name}>{p.value}</span>
                    {p.data.inn && <span className={s.inn}>ИНН {p.data.inn}</span>}
                  </button>
                </li>
              ))}
            </ul>
          ) : loading ? (
            <div className={s.loaderBox}>
              <Loader size="md" label="" />
            </div>
          ) : (
            <div className={s.empty}>Ничего не найдено</div>
          )}
        </div>
      )}

      {error && <div className={s.errorText}>{error}</div>}
    </div>
  );
}
