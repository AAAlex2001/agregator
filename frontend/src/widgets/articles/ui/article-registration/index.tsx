"use client";

import { useState } from "react";
import type { DirectionCode } from "@/entities/direction";
import { useUser } from "@/entities/user";
import type { UserRole } from "@/entities/user";
import { REGISTRATION_DIRECTIONS } from "../../config/registration-directions";
import { REGISTRATION_ROLES } from "../../config/registration-roles";
import type { RegistrationRole } from "../../model/types";
import { RegistrationDirectionPicker } from "../registration-direction";
import { RegistrationOffer } from "../registration-offer";
import { RegistrationRoleTabs } from "../registration-role-tabs";
import styles from "./style.module.scss";

/** Открытие регистрации с ролью и направлением, выбранными посетителем. */
interface ArticleRegistrationProps {
  onRegister: (role: UserRole, direction: DirectionCode) => void;
}

/** Направления держателя документов; экологическое сопровождение не требует их. */
const HOLDER_DIRECTIONS = REGISTRATION_DIRECTIONS.filter(
  (direction) => direction.value !== "ECOLOGY",
);

/** Собирает приглашение к регистрации для гостя, читающего статью. */
export function ArticleRegistration({ onRegister }: ArticleRegistrationProps) {
  const { user } = useUser();
  const [role, setRole] = useState(REGISTRATION_ROLES[0]);
  const [direction, setDirection] = useState(REGISTRATION_DIRECTIONS[0]);

  if (user) {
    return null;
  }

  const directions = role.role === "LICENSE_HOLDER"
    ? HOLDER_DIRECTIONS
    : REGISTRATION_DIRECTIONS;

  /** Сохраняет направление, если оно доступно новой роли. */
  function changeRole(nextRole: RegistrationRole) {
    setRole(nextRole);

    if (nextRole.role === "LICENSE_HOLDER" && direction.value === "ECOLOGY") {
      setDirection(REGISTRATION_DIRECTIONS[0]);
    }
  }

  /** Выбирает описание направления по значению из списка. */
  function changeDirection(value: string) {
    const selected = REGISTRATION_DIRECTIONS.find((item) => item.value === value);
    setDirection(selected ?? REGISTRATION_DIRECTIONS[0]);
  }

  /** Передаёт выбранную роль и направление в окно регистрации приложения. */
  function register() {
    onRegister(role.role, direction.value);
  }

  return (
    <aside className={styles.outer}>
      <RegistrationRoleTabs
        selected={role}
        onChange={changeRole}
      />
      <div className={styles.panel}>
        <RegistrationDirectionPicker
          options={directions}
          selected={direction}
          onChange={changeDirection}
        />
        <RegistrationOffer
          role={role}
          direction={direction}
          onRegister={register}
        />
      </div>
      <p className={styles.fine}>
        {role.fine}
      </p>
    </aside>
  );
}
