"use client";

import { useEffect, useRef, useState } from "react";
import s from "./SortPills.module.scss";
import { SortPill, type PillSpec } from "./SortPill";
import { SortPillsSkeleton } from "./SortPillsSkeleton";
import type { CustomerSortBy, SortDir } from "@/source/entities/response";

interface Props {
  sortBy: CustomerSortBy | null;
  sortDir: SortDir | null;
  isLoading?: boolean;
  onChange: (sortBy: CustomerSortBy | null, sortDir: SortDir | null) => void;
}

const PILLS: PillSpec[] = [
  { key: "created_at",          label: "По дате",     descLabel: "Сначала новые ↑",  ascLabel: "Сначала старые ↓" },
  { key: "proposed_sum_amount", label: "По цене",     descLabel: "Сначала дороже ↑", ascLabel: "Сначала дешевле ↓" },
  { key: "expert_rating",       label: "По рейтингу", descLabel: "Сначала выше ↑",   ascLabel: "Сначала ниже ↓" },
];

export function SortPills({ sortBy, sortDir, isLoading, onChange }: Props) {
  const [openKey, setOpenKey] = useState<CustomerSortBy | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openKey === null) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpenKey(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openKey]);

  if (isLoading) return <SortPillsSkeleton />;

  return (
    <div className={s.row} ref={ref}>
      <span className={s.title}>Сортировка:</span>
      {PILLS.map((pill) => (
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
