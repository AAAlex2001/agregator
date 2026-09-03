"use client";

import { useState } from "react";
import { ChevronIcon } from "@/source/shared/ui/icons";
import type { RtnTaxonomyOption } from "@/source/entities/rtn-clarification";
import s from "./RtnTaxonomyDisclosure.module.scss";

interface Props {
  oversightAreas: RtnTaxonomyOption[];
  industries: RtnTaxonomyOption[];
  activities: RtnTaxonomyOption[];
  objectTypes: RtnTaxonomyOption[];
}

export function RtnTaxonomyDisclosure({
  oversightAreas,
  industries,
  activities,
  objectTypes,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const groups = [
    { title: "Область надзора", items: oversightAreas },
    { title: "Отрасль", items: industries },
    { title: "Вид деятельности", items: activities },
    { title: "Тип объекта", items: objectTypes },
  ].filter((group) => group.items.length > 0);

  if (groups.length === 0) return null;

  const total = groups.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div className={s.root}>
      <button
        type="button"
        className={s.toggle}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        <span>Классификация разъяснения</span>
        <span className={s.count}>{total}</span>
        <ChevronIcon
          className={isOpen ? `${s.chevron} ${s.chevronOpen}` : s.chevron}
          color="currentColor"
        />
      </button>

      {isOpen && (
        <div className={s.panel}>
          {groups.map((group) => (
            <div key={group.title} className={s.group}>
              <span className={s.groupTitle}>{group.title}</span>
              <div className={s.chips}>
                {group.items.map((item) => (
                  <span key={item.value} className={s.chip}>
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
