import { useEffect, useState } from "react";
import { searchExpertsPicker, type ExpertPickerItem } from "@/entites/expert";

const MIN_QUERY = 2;

export function useExpertSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ExpertPickerItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (q.length < MIN_QUERY) {
      setResults([]);
      setOpen(false);
      return;
    }
    let active = true;
    const timer = setTimeout(async () => {
      try {
        const data = await searchExpertsPicker(q);
        if (!active) return;
        setResults(data.items);
        setOpen(true);
      } catch {
        if (active) setResults([]);
      }
    }, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  const clear = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  return { query, setQuery, results, open, setOpen, clear };
}
