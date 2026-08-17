"use client";

import Button from "@/source/shared/ui/Button";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { useAuthModal, type AuthPreset } from "@/source/shared/lib/auth-modal";
import s from "./service-roles.module.scss";

export interface ServiceLandingRole {
  id: string;
  role: AuthPreset["role"];
  direction?: AuthPreset["direction"];
  title: string;
  subtitle: string;
  description: string;
  fields: string[];
}

interface Props {
  roles: ServiceLandingRole[];
}

const ROLE_TITLES: Record<AuthPreset["role"], string> = {
  CUSTOMER: "Заказчик",
  EXPERT: "Исполнитель",
  LICENSE_HOLDER: "Держатель разрешительных документов",
};

const ROLE_ORDER: Record<AuthPreset["role"], number> = {
  CUSTOMER: 0,
  EXPERT: 1,
  LICENSE_HOLDER: 2,
};

export function ServiceRoles({ roles }: Props) {
  const { openAuth } = useAuthModal();
  const orderedRoles = [...roles].sort((a, b) => ROLE_ORDER[a.role] - ROLE_ORDER[b.role]);

  return (
    <section className={s.section} id="registraciya">
      <div className={s.content}>
        <header className={s.header}>
          <Title text="Регистрация" as="h2" />
          <Subtitle text="Выберите вашу роль, чтобы продолжить." />
        </header>

        <ul className={s.grid}>
          {orderedRoles.map((role) => (
            <li key={role.id} className={s.card}>
              <h3 className={s.cardTitle}>{ROLE_TITLES[role.role]}</h3>
              <p className={s.cardSubtitle}>{role.subtitle}</p>
              <p className={s.cardText}>{role.description}</p>
              <ul className={s.fields}>
                {role.fields.map((field) => (
                  <li key={field}>{field}</li>
                ))}
              </ul>
              <Button
                variant="primary"
                fullWidth
                className={s.cardButton}
                onClick={() => openAuth("register", { role: role.role, direction: role.direction })}
              >
                Выбрать
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
