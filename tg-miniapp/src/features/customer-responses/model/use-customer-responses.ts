import { useEffect, useState } from "react";
import {
  listResponses,
  type CustomerSortBy,
  type ExpertResponse,
  type ResponseCounters,
  type ResponseTab,
  type SortDir,
} from "@/entites/response";

export function useCustomerResponses() {
  const [tab, setTab] = useState<ResponseTab>("all");
  const [sortBy, setSortBy] = useState<CustomerSortBy | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [items, setItems] = useState<ExpertResponse[] | null>(null);
  const [counters, setCounters] = useState<ResponseCounters | null>(null);

  useEffect(() => {
    let active = true;
    setItems(null);
    listResponses(tab, sortBy ?? "created_at", sortDir)
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

  const toggleSort = (key: CustomerSortBy) => {
    if (sortBy !== key) {
      setSortBy(key);
      setSortDir("desc");
      return;
    }
    if (sortDir === "desc") {
      setSortDir("asc");
      return;
    }
    setSortBy(null);
    setSortDir("desc");
  };

  return { tab, setTab, sortBy, sortDir, toggleSort, items, counters };
}
