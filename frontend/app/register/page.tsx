"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useNotifications } from "@/shared/ui/Notifications";
import { LogoIcon, CustomerIcon, ExpertIcon } from "@/shared/ui/icons";
import styles from "./register.module.scss";

import { useRegistrationState } from "@/features/auth/register/model/state";
import { handleRegistration, getRoleType } from "@/features/auth/register/model/actions";
import type { Role } from "@/features/auth/register/model/types";
import { RoleSelectStep } from "@/features/auth/register/ui/RoleSelectStep";
import { CredentialsStep } from "@/features/auth/register/ui/CredentialsStep";

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
    photo: "/advantages__3.jpg",
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
    photo: "/advantages_1.jpg",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const state = useRegistrationState();
  const { showSuccess, showError } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.selectedRole) {
      state.setError("Выберите роль");
      showError("Выберите роль");
      return;
    }

    state.setIsLoading(true);
    state.setError(null);

    try {
      await handleRegistration(
        {
          role: getRoleType(state.selectedRole),
          login: state.login,
          password: state.password,
          repeatPassword: state.repeatPassword,
          firstName: state.firstName,
          lastName: state.lastName,
        },
        () => {
          showSuccess("Регистрация прошла успешно");
          router.push("/login");
        },
        (error) => {
          state.setError(error);
          showError(error);
        },
      );
    } catch {
    } finally {
      state.setIsLoading(false);
    }
  };

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
              {state.step === 1 ? "Шаг 1. Выбор роли" : "Шаг 2. Данные"}
            </span>
          </div>

          {state.error && <div className={styles.errorMessage}>{state.error}</div>}

          {state.step === 1 ? (
            <RoleSelectStep
              roles={roles}
              openedCardId={state.openedCardId}
              onToggleCard={(id) => state.setOpenedCardId(state.openedCardId === id ? null : id)}
              onSelectRole={(id) => { state.setSelectedRole(id); state.setStep(2); }}
              styles={styles}
            />
          ) : (
            <CredentialsStep
              selectedRole={state.selectedRole}
              lastName={state.lastName}
              firstName={state.firstName}
              login={state.login}
              password={state.password}
              repeatPassword={state.repeatPassword}
              isLoading={state.isLoading}
              onLastNameChange={state.setLastName}
              onFirstNameChange={state.setFirstName}
              onLoginChange={state.setLogin}
              onPasswordChange={state.setPassword}
              onRepeatPasswordChange={state.setRepeatPassword}
              onSubmit={handleSubmit}
              styles={styles}
            />
          )}

          <div className={styles.footer}>
            <p>
              Уже есть аккаунт?{" "}
              <Link href="/login" className={styles.link}>
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
