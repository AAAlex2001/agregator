"use client";

import cn from "classnames";
import { useState } from "react";
import { useSession } from "@/source/entities/session";
import { useAuthModal } from "@/source/shared/lib/auth-modal";
import Button from "@/source/shared/ui/Button";
import { Select } from "@/source/shared/ui/Select";
import { CTA_DIRECTIONS, HOLDER_DIRECTIONS, ROLE_CONTENT, ROLE_TABS, roleText, type CtaRole } from "../model/content";
import s from "./RegisterCta.module.scss";

/** Блок в середине статьи для гостей: выбрать роль и направление — и сразу в регистрацию с ними. */
export function RegisterCta() {
  const { user } = useSession();
  const { openAuth } = useAuthModal();
  const [role, setRole] = useState<CtaRole>("CUSTOMER");
  const [direction, setDirection] = useState(CTA_DIRECTIONS[0]);

  if (user) return null;

  const directions = role === "LICENSE_HOLDER" ? HOLDER_DIRECTIONS : CTA_DIRECTIONS;
  const content = ROLE_CONTENT[role];

  const selectRole = (next: CtaRole) => {
    setRole(next);
    if (next === "LICENSE_HOLDER" && !HOLDER_DIRECTIONS.includes(direction)) setDirection(CTA_DIRECTIONS[0]);
  };

  return (
    <aside className={s.outer}>
      <div className={s.tabs} role="tablist" aria-label="Ваша роль">
        {ROLE_TABS.map((tab) => (
          <button
            key={tab.role}
            type="button"
            role="tab"
            aria-selected={role === tab.role}
            className={cn(s.tab, { [s.tabActive]: role === tab.role })}
            onClick={() => selectRole(tab.role)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={s.panel}>
        <div className={s.left}>
          <h2 className={s.fieldLabel}>Направление работ</h2>
          <Select
            variant="pill"
            ariaLabel="Направление работ"
            options={directions.map((item) => ({ value: item.value, label: item.label, hint: item.hint, image: item.image }))}
            value={direction.value}
            onChange={(value) => setDirection(CTA_DIRECTIONS.find((item) => item.value === value) ?? CTA_DIRECTIONS[0])}
          />
          <Button href={direction.href} variant="outline" size="md" fullWidth className={s.cta}>
            Чем занимается направление
          </Button>
        </div>

        <div className={s.right}>
          <h2 className={s.roleTitle}>{content.title}</h2>
          <p className={s.roleText}>{roleText(role, direction)}</p>
          <Button
            variant="primary"
            size="md"
            fullWidth
            showArrow
            className={s.cta}
            onClick={() => openAuth("register", { role, direction: direction.value })}
          >
            {content.button}
          </Button>
        </div>
      </div>
      <p className={s.fine}>{content.fine}</p>
    </aside>
  );
}
