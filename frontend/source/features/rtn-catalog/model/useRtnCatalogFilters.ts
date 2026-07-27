"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseRtnListFilters, type RtnDocumentType, type RtnStatus } from "@/source/entities/rtn-clarification";

export type TaxonomyDimension = "oversightAreas" | "industries" | "activities" | "objectTypes";

const DIMENSION_TO_PARAM: Record<TaxonomyDimension, string> = {
  oversightAreas: "oversight_area",
  industries: "industry",
  activities: "activity",
  objectTypes: "object_type",
};

function toggleInList(current: string[], value: string): string[] {
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
}

interface Options {
  liveSearch?: boolean;
}

export function useRtnCatalogFilters({ liveSearch = false }: Options = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");

  const filters = parseRtnListFilters(searchParams);

  function pushParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  useEffect(() => {
    if (!liveSearch) return;

    const search = searchInput.trim();
    const currentSearch = searchParams.get("search") ?? "";
    if (search === currentSearch) return;

    const timeoutId = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) params.set("search", search);
      else params.delete("search");

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [liveSearch, pathname, router, searchInput, searchParams]);

  function clearSearch() {
    setSearchInput("");
    pushParams((params) => params.delete("search"));
  }

  function toggleTaxonomy(dimension: TaxonomyDimension, value: string) {
    const paramKey = DIMENSION_TO_PARAM[dimension];
    pushParams((params) => {
      const next = toggleInList(params.getAll(paramKey), value);
      params.delete(paramKey);
      next.forEach((item) => params.append(paramKey, item));
    });
  }

  function toggleDocumentType(value: RtnDocumentType) {
    pushParams((params) => {
      const next = toggleInList(params.getAll("document_type"), value);
      params.delete("document_type");
      next.forEach((item) => params.append("document_type", item));
    });
  }

  function toggleStatus(value: RtnStatus) {
    pushParams((params) => {
      const next = toggleInList(params.getAll("status"), value);
      params.delete("status");
      next.forEach((item) => params.append("status", item));
    });
  }

  function setDateRange(from: string, to: string) {
    pushParams((params) => {
      if (from) params.set("published_from", from);
      else params.delete("published_from");
      if (to) params.set("published_to", to);
      else params.delete("published_to");
    });
  }

  function resetFilters() {
    setSearchInput("");
    router.push(pathname, { scroll: false });
  }

  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.publishedFrom) ||
    Boolean(filters.publishedTo) ||
    (filters.documentTypes?.length ?? 0) > 0 ||
    (filters.statuses?.length ?? 0) > 0 ||
    (filters.oversightAreas?.length ?? 0) > 0 ||
    (filters.industries?.length ?? 0) > 0 ||
    (filters.activities?.length ?? 0) > 0 ||
    (filters.objectTypes?.length ?? 0) > 0;

  return {
    filters,
    searchInput,
    setSearchInput,
    clearSearch,
    toggleTaxonomy,
    toggleDocumentType,
    toggleStatus,
    setDateRange,
    resetFilters,
    hasActiveFilters,
  };
}
