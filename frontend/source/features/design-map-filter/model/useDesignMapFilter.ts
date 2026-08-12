"use client";

import { useState } from "react";
import {
  DESIGN_DOC_CATEGORIES,
  DESIGN_SPECIALTIES,
  type DesignDocCategoryCode,
} from "@/source/entities/design";

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function useDesignMapFilter() {
  const [categories, setCategories] = useState<DesignDocCategoryCode[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);

  const toggleCategory = (code: DesignDocCategoryCode) =>
    setCategories((current) => toggleValue(current, code));
  const toggleSpecialty = (title: string) =>
    setSpecialties((current) => toggleValue(current, title));

  const selectedSpecialties = DESIGN_SPECIALTIES.filter((specialty) =>
    specialties.includes(specialty.title),
  );

  const availableCategories = DESIGN_DOC_CATEGORIES.filter((category) =>
    selectedSpecialties.every((specialty) => specialty.categories.includes(category.code)),
  );
  const availableSpecialties = DESIGN_SPECIALTIES.filter((specialty) =>
    categories.every((code) => specialty.categories.includes(code)),
  );

  return {
    categories,
    specialties,
    availableCategories,
    availableSpecialties,
    toggleCategory,
    toggleSpecialty,
  };
}
