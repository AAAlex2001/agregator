"use client";

import { useEffect, useRef, useState } from "react";
import { SortPill, type SortDir, type SortPillSpec } from "./SortPill";
import { SortPillsSkeleton } from "./SortPillsSkeleton";
import s from "./SortPills.module.scss";

interface Props<K extends string> {
  options: SortPillSpec<K>[];
  sortBy: K | null;
  sortDir: SortDir | null;
  isLoading?: boolean;
  title?: string;
  onChange: (sortBy: K | null, sortDir: SortDir | null) => void;
}

export function SortPills<K extends string>({
  options,
  sortBy,
  sortDir,
  isLoading,
  title = "Сортировка:",
  onChange,
}: Props<K>) {
  const [openKey, setOpenKey] = useState<K | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openKey === null) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpenKey(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openKey]);

  if (isLoading) return <SortPillsSkeleton count={options.length} />;

  return (
    <div className={s.row} ref={ref}>
      <span className={s.title}>{title}</span>
      {options.map((pill) => (
        <SortPill
          key={pill.key}
          pill={pill}
          sortBy={sortBy}
          sortDir={sortDir}
          isOpen={openKey === pill.key}
          onToggle={() => setOpenKey(openKey === pill.key ? null : pill.key)}
          onClose={() => setOpenKey(null)}
          onChange={onChange}
        />
      ))}
    </div>
  );
}
