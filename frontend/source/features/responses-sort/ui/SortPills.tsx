"use client";

import { SortPills as SharedSortPills, type SortPillSpec } from "@/source/shared/ui/SortPills";
import type { CustomerSortBy, SortDir } from "@/source/entities/response";

interface Props {
  sortBy: CustomerSortBy | null;
  sortDir: SortDir | null;
  isLoading?: boolean;
  onChange: (sortBy: CustomerSortBy | null, sortDir: SortDir | null) => void;
}

const PILLS: SortPillSpec<CustomerSortBy>[] = [
  { key: "created_at",          label: "По дате",     descLabel: "Сначала новые ↑",  ascLabel: "Сначала старые ↓" },
  { key: "proposed_sum_amount", label: "По цене",     descLabel: "Сначала дороже ↑", ascLabel: "Сначала дешевле ↓" },
  { key: "expert_rating",       label: "По рейтингу", descLabel: "Сначала выше ↑",   ascLabel: "Сначала ниже ↓" },
];

export function SortPills({ sortBy, sortDir, isLoading, onChange }: Props) {
  return (
    <SharedSortPills
      options={PILLS}
      sortBy={sortBy}
      sortDir={sortDir}
      isLoading={isLoading}
      onChange={onChange}
      compact
    />
  );
}
