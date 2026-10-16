"use client";

import type { UserProfile } from "@/entities/user";
import { useEditDirections } from "../../model/use-edit-directions";
import { DirectionOption } from "../direction-option";
import styles from "./style.module.scss";

/** Профиль аккаунта, для которого выбираются направления без анкеты. */
interface DirectionMarksProps {
  profile: UserProfile;
}

/** Показывает направления без анкеты и сохраняет каждое изменение отметки. */
export function DirectionMarks({ profile }: DirectionMarksProps) {
  const {
    options,
    selectedDirections,
    toggleDirection,
  } = useEditDirections(profile);

  return (
    <div className={styles.marks}>
      <span className={styles.hint}>
        Отметьте направления, по которым работаете, — сохраняются сразу, анкеты для них не нужны.
      </span>

      <ul className={styles.list}>
        {options.map((direction) => (
          <DirectionOption
            key={direction.value}
            direction={direction}
            checked={selectedDirections.includes(direction.value)}
            onToggle={toggleDirection}
          />
        ))}
      </ul>
    </div>
  );
}
