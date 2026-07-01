import cn from "classnames";
import type { ComponentType } from "react";
import s from "./profile-hero.module.scss";

interface Props {
  name: string;
  roleKind: "expert" | "customer" | "license";
  roleNoun: string;
  Icon: ComponentType<{ size?: number }>;
}

const PATTERN_COUNT = 180;

export function ProfileHero({ name, roleKind, roleNoun, Icon }: Props) {
  return (
    <div className={cn(s.hero, s[`hero_${roleKind}`])}>
      <div className={s.pattern} aria-hidden="true">
        {Array.from({ length: PATTERN_COUNT }).map((_, i) => (
          <Icon key={i} size={28} />
        ))}
      </div>
      <div className={s.inner}>
        <p className={s.name}>{name}</p>
        <p className={s.role}>Вы — {roleNoun}</p>
      </div>
      <span className={s.shade} />
    </div>
  );
}
