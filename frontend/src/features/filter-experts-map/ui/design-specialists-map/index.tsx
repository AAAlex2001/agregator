"use client";

import { ExpertsMap, useExpertsMap } from "@/entities/expert";
import { useUser } from "@/entities/user";
import { FilterDropdown } from "@/shared/ui/filter-dropdown";
import { getMapEmptyText } from "../../model/get-map-empty-text";
import type { ExpertsMapOptions } from "../../model/types";
import { useDesignMapFilter } from "../../model/use-design-map-filter";
import { DirectionMapLayout } from "../direction-map-layout";

/** Загружает проектировщиков и отбирает их по документации и специальностям. */
export function DesignSpecialistsMap({
  height,
  contactsHref,
}: ExpertsMapOptions) {
  const { user } = useUser();
  const { items, isLoading } = useExpertsMap("DESIGN");
  const {
    categories,
    specialties,
    availableCategories,
    availableSpecialties,
    filtered,
    toggleCategory,
    toggleSpecialty,
  } = useDesignMapFilter(items);
  const contactsPath = contactsHref ?? (
    user ? "/landing/expert-contacts" : "/expert-contacts"
  );

  return (
    <DirectionMapLayout
      height={height}
      filters={(
        <>
          <FilterDropdown
            label="Виды документации"
            options={availableCategories.map((category) => ({
              value: category.code,
              short: category.code,
              title: category.title,
            }))}
            selected={categories}
            onToggle={toggleCategory}
          />
          <FilterDropdown
            label="Специалисты"
            options={availableSpecialties.map((specialty) => ({
              value: specialty.key,
              short: specialty.code,
              title: specialty.title,
            }))}
            selected={specialties}
            onToggle={toggleSpecialty}
          />
        </>
      )}
      map={(
        <ExpertsMap
          items={filtered}
          height="100%"
          emptyText={getMapEmptyText(isLoading, items.length)}
          contactsHref={contactsPath}
        />
      )}
    />
  );
}

