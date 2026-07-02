import { ThemedImage } from "@/shared/ui";
import s from "./profile-hero.module.scss";

interface Props {
  name: string;
  roleKind: "expert" | "customer" | "license";
  roleNoun: string;
}

export function ProfileHero({ name, roleKind, roleNoun }: Props) {
  return (
    <div className={s.hero}>
      <ThemedImage
        className={s.bg}
        light={`/profile/${roleKind}-light.webp`}
        dark={`/profile/${roleKind}-dark.webp`}
      />
      <div className={s.inner}>
        <p className={s.name}>{name}</p>
        <p className={s.role}>Вы — {roleNoun}</p>
      </div>
    </div>
  );
}
