"use client";

import Button from "@/source/shared/ui/Button";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { useAuthModal } from "@/source/shared/lib/auth-modal";
import { AUDIT_ROLES } from "../model/content";
import s from "./role-choice.module.scss";

export function AuditRoleChoice() {
  const { openAuth } = useAuthModal();

  return (
    <section className={s.section} id="registraciya">
      <div className={s.content}>
        <header className={s.header}>
          <Title text="Регистрация" as="h2" />
          <Subtitle text="Выберите вашу роль, чтобы продолжить." />
        </header>

        <ul className={s.grid}>
          {AUDIT_ROLES.map((role) => (
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
                onClick={() => openAuth("register", { role: role.role, direction: "AUDIT_SUPB" })}
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
