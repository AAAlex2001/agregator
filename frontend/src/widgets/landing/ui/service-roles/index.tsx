"use client";

import type { DirectionCode } from "@/entities/direction";
import type { UserRole } from "@/entities/user";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import { SERVICE_ROLE_ORDER } from "../../config/service-roles";
import type { ServiceRole } from "../../model/types";
import { RegistrationRoleCard } from "../registration-role-card";
import styles from "./style.module.scss";

/** Карточки регистрации для направления и обработчик выбора роли. */
interface ServiceRolesProps {
  roles: ServiceRole[];
  onRegister: (role: UserRole, direction?: DirectionCode) => void;
}

/** Собирает карточки регистрации в порядке заказчик, исполнитель, держатель. */
export function ServiceRoles({ roles, onRegister }: ServiceRolesProps) {
  const orderedRoles = [...roles].sort(
    (first, second) => (
      SERVICE_ROLE_ORDER.indexOf(first.role)
      - SERVICE_ROLE_ORDER.indexOf(second.role)
    ),
  );

  return (
    <section
      className={styles.section}
      id="registraciya"
    >
      <div className={styles.content}>
        <header className={styles.header}>
          <Title
            text="Регистрация"
            as="h2"
          />
          <Subtitle text="Выберите вашу роль, чтобы продолжить." />
        </header>
        <ul className={styles.grid}>
          {orderedRoles.map((role) => (
            <RegistrationRoleCard
              key={role.id}
              role={role}
              onRegister={onRegister}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
