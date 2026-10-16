"use client";

import { useState } from "react";
import {
  DESIGN_DOCUMENT_CATEGORIES,
  DESIGN_MAP_SPECIALTIES,
} from "@/entities/design";
import type { ExpertMapItem } from "@/entities/expert";
import { toggleFilterValue } from "./toggle-filter-value";

/** Отбирает проектировщиков по специальностям и совместимым видам документации. */
export function useDesignMapFilter(items: ExpertMapItem[]) {
  const [categories, setCategories] = useState<string[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const selectedSpecialties = DESIGN_MAP_SPECIALTIES.filter((specialty) => (
    specialties.includes(specialty.key)
  ));
  const availableCategories = DESIGN_DOCUMENT_CATEGORIES.filter((category) => (
    selectedSpecialties.every((specialty) => (
      specialty.categories.includes(category.code)
    ))
  ));
  const availableSpecialties = DESIGN_MAP_SPECIALTIES.filter((specialty) => (
    categories.every((category) => specialty.categories.includes(category))
  ));
  const categorySpecialties = availableSpecialties.map((specialty) => specialty.key);

  /** Проверяет специальности исполнителя по двум выбранным группам фильтров. */
  function matchesFilters(item: ExpertMapItem): boolean {
    const codes = item.certificate_codes;

    if (
      specialties.length > 0 &&
      !specialties.some((specialty) => codes.includes(specialty))
    ) {
      return false;
    }

    if (
      categories.length > 0 &&
      !categorySpecialties.some((specialty) => codes.includes(specialty))
    ) {
      return false;
    }

    return true;
  }

  /** Переключает вид документации в фильтре проектировщиков. */
  function toggleCategory(category: string) {
    setCategories((current) => toggleFilterValue(current, category));
  }

  /** Переключает специальность проектировщика. */
  function toggleSpecialty(specialty: string) {
    setSpecialties((current) => toggleFilterValue(current, specialty));
  }

  return {
    categories,
    specialties,
    availableCategories,
    availableSpecialties,
    filtered: items.filter(matchesFilters),
    toggleCategory,
    toggleSpecialty,
  };
}
