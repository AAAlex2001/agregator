import { useEffect, useState } from "react";
import { listExperts, type ExpertSortBy, type ExpertSummary } from "@/entites/expert";

export function useExpertsList(sortBy: ExpertSortBy, sortDir: "asc" | "desc") {
  const [items, setItems] = useState<ExpertSummary[] | null>(null);

  useEffect(() => {
    let active = true;
    setItems(null);
    listExperts(sortBy, sortDir)
      .then((r) => active && setItems(r.items))
      .catch(() => active && setItems([]));
    return () => {
      active = false;
    };
  }, [sortBy, sortDir]);

  return { items };
}
