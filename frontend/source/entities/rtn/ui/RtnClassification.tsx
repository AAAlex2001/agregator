"use client";

import cn from "classnames";
import { useState } from "react";
import { ChevronIcon } from "@/source/shared/ui/icons";
import type { RtnDetail } from "../model/clarification";
import s from "./RtnClassification.module.scss";

interface RtnClassificationProps {
  clarification: RtnDetail;
}

/** Свёрнутый список: область надзора, отрасль, вид деятельности и тип объекта. */
export function RtnClassification({ clarification }: RtnClassificationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const groups = [
    { title: "Область надзора", items: clarification.oversight_areas },
    { title: "Отрасль", items: clarification.industries },
    { title: "Вид деятельности", items: clarification.activities },
    { title: "Тип объекта", items: clarification.object_types },
  ].filter((group) => group.items.length > 0);

  if (groups.length === 0) return null;
  const total = groups.flatMap((group) => group.items).length;

  return (
    <div className={s.root}>
      <button type="button" className={s.toggle} aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <span>Классификация разъяснения</span>
        <span className={s.count}>{total}</span>
        <ChevronIcon className={cn(s.chevron, { [s.chevronOpen]: isOpen })} color="currentColor" />
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
