import { useEffect, useState } from "react";
import {
  listResponses,
  type CustomerSortBy,
  type ExpertResponse,
  type ResponseCounters,
  type ResponseTab,
  type SortDir,
} from "@/entites/response";

export function useCustomerResponses(sortBy: CustomerSortBy, sortDir: SortDir) {
  const [tab, setTab] = useState<ResponseTab>("all");
  const [items, setItems] = useState<ExpertResponse[] | null>(null);
  const [counters, setCounters] = useState<ResponseCounters | null>(null);

  useEffect(() => {
    let active = true;
    setItems(null);
    listResponses(tab, sortBy, sortDir)
      .then((r) => {
        if (!active) return;
        setItems(r.items);
        setCounters(r.counters);
      })
      .catch(() => active && setItems([]));
    return () => {
      active = false;
    };
  }, [tab, sortBy, sortDir]);

  return { tab, setTab, items, counters };
}
