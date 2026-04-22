"use client";

import Link from "next/link";
import { LogoIcon, CustomerIcon, ExpertIcon } from "@/source/shared/ui/icons";
import { useRegister, RoleSelectStep, CredentialsStep } from "@/source/features/auth/register";
import type { Role } from "@/source/features/auth/register";
import styles from "./RegisterWidget.module.scss";

const roles: Role[] = [
  {
    id: 1,
    title: "Заказчик",
    icon: <CustomerIcon />,
    expandedTitle: "Найдите эксперта по промышленной безопасности",
    description: [
      "Разместите заказ на платформе",
      "Договаривайтесь с подходящими аттестованными экспертами",
      "Напишите отзыв и оцените работу",
    ],
    photo: "/advantages__3.webp",
  },
  {
    id: 2,
    title: "Эксперт",
    icon: <ExpertIcon />,
    expandedTitle: "Находите проекты и укрепляйте репутацию, расширяя портфолио",
    description: [
      "Найдите свой проект и участвуйте в тендере",
      "Договаривайтесь напрямую",
      "Выполните заказ, получите отзыв и оценку",
    ],
    photo: "/advantages_1.webp",
  },
];

export function RegisterWidget() {
  const reg = useRegister();

  return (
    <div className={styles.container}>
      <div className={styles.background} />
      <div className={styles.content}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <Link href="/" className={styles.logo}>
              <LogoIcon title="Ресурс-Плюс" />
            </Link>
          </div>

          <div className={styles.stepsHeader}>
            <h2 className={styles.registrationTitle}>Регистрация</h2>
            <span className={styles.stepIndicator}>
              {reg.step === 1 ? "Шаг 1. Выбор роли" : "Шаг 2. Данные"}
            </span>
          </div>

          {reg.step === 1 ? (
            <RoleSelectStep
              roles={roles}
              openedCardId={reg.openedCardId}
              onToggleCard={reg.toggleCard}
              onSelectRole={reg.selectRole}
            />
          ) : (
            <CredentialsStep
              selectedRole={reg.selectedRole}
              lastName={reg.lastName}
              firstName={reg.firstName}
              email={reg.email}
              phone={reg.phone}
              inn={reg.inn}
              innQuery={reg.innQuery}
              password={reg.password}
              repeatPassword={reg.repeatPassword}
              isLoading={reg.isLoading}
              onLastNameChange={reg.setLastName}
              onFirstNameChange={reg.setFirstName}
              onEmailChange={reg.setEmail}
              onPhoneChange={reg.setPhone}
              onInnChange={reg.setInn}
              onInnQueryChange={reg.setInnQuery}
              onSuggestionSelect={reg.setSelectedParty}
              onPasswordChange={reg.setPassword}
              onRepeatPasswordChange={reg.setRepeatPassword}
              onSubmit={reg.handleSubmit}
            />
          )}

          <div className={styles.footer}>
            <p>Уже есть аккаунт?{" "}
              <Link href="/login" className={styles.link}>Войти</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
