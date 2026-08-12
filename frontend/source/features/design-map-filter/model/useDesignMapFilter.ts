"use client";

import { useState } from "react";
import type { ExpertMapItemApi } from "@/source/entities/expert";
import {
  DESIGN_DOC_CATEGORIES,
  DESIGN_SPECIALTIES,
  type DesignDocCategoryCode,
} from "@/source/entities/design";

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function useDesignMapFilter(items: ExpertMapItemApi[]) {
  const [categories, setCategories] = useState<DesignDocCategoryCode[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);

  const toggleCategory = (code: DesignDocCategoryCode) =>
    setCategories((current) => toggleValue(current, code));
  const toggleSpecialty = (key: string) =>
    setSpecialties((current) => toggleValue(current, key));

  const selectedSpecialties = DESIGN_SPECIALTIES.filter((specialty) =>
    specialties.includes(specialty.key),
  );

  const availableCategories = DESIGN_DOC_CATEGORIES.filter((category) =>
    selectedSpecialties.every((specialty) => specialty.categories.includes(category.code)),
  );
  const availableSpecialties = DESIGN_SPECIALTIES.filter((specialty) =>
    categories.every((code) => specialty.categories.includes(code)),
  );

  const categoryKeys = availableSpecialties.map((specialty) => specialty.key);
  const filtered = items.filter((item) => {
    const tags = item.certificate_codes;
    if (specialties.length > 0 && !specialties.some((key) => tags.includes(key))) return false;
    if (categories.length > 0 && !categoryKeys.some((key) => tags.includes(key))) return false;
    return true;
  });

  return {
    categories,
    specialties,
    availableCategories,
    availableSpecialties,
    toggleCategory,
    toggleSpecialty,
    filtered,
  };
}
