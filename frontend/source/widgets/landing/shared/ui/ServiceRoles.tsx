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

export function ServiceRoles({ roles }: Props) {
  const { openAuth } = useAuthModal();

  return (
    <section className={s.section} id="registraciya">
      <div className={s.content}>
        <header className={s.header}>
          <Title text="Регистрация" as="h2" />
          <Subtitle text="Выберите вашу роль, чтобы продолжить." />
        </header>

        <ul className={s.grid}>
          {roles.map((role) => (
            <li key={role.id} className={s.card}>
              <h3 className={s.cardTitle}>{role.title}</h3>
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
