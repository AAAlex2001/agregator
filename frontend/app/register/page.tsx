"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button, Input } from "@/app/components";
import { LogoIcon, CustomerIcon, ExpertIcon, ChevronIcon, BulletIcon } from "@/app/icons";
import styles from "./register.module.scss";

import { useRegistrationState } from "./store/state";
import { handleRegistration, getRoleType } from "./store/actions";
import type { Role } from "./store/types";

const roles: Role[] = [
  {
    id: 1,
    title: "Заказчик",
    icon: <CustomerIcon />,
    expandedTitle: "Найдите эксперта по промышленной безопасности",
    description: [
      "Разместите заказ на платформе",
      "Договаривайтесь с подходящими аттестованными экспертами",
      "Напишите отзыв и оцените работу"
    ],
    photo: "/advantages__3.jpg"
  },
  {
    id: 2,
    title: "Эксперт",
    icon: <ExpertIcon />,
    expandedTitle: "Находите проекты и укрепляйте репутацию, расширяя портфолио",
    description: [
      "Найдите свой проект и участвуйте в тендере",
      "Договаривайтесь напрямую",
      "Выполните заказ, получите отзыв и оценку"
    ],
    photo: "/advantages_1.jpg"
  }
];

export default function RegisterPage() {
  const router = useRouter();
  const state = useRegistrationState();

  const toggleCard = (id: number) => {
    state.setOpenedCardId(state.openedCardId === id ? null : id);
  };

  const handleSelectRole = (roleId: number) => {
    state.setSelectedRole(roleId);
    state.setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.selectedRole) {
      state.setError("Выберите роль");
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
        },
        (userId) => {
          console.log("Успешная регистрация, ID:", userId);
          router.push("/login");
        },
        (error) => {
          state.setError(error);
        }
      );
    } catch (err) {
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

          {state.error && (
            <div className={styles.errorMessage}>
              {state.error}
            </div>
          )}

          {state.step === 1 ? (
            <div className={styles.stepContent} key="step1">
              <div className={styles.rolesContainer}>
                {roles.map((role) => {
                  const isOpen = state.openedCardId === role.id;
                  return (
                    <div
                      key={role.id}
                      className={`${styles.roleCard} ${isOpen ? styles.roleCardOpen : ''}`}
                      onClick={() => toggleCard(role.id)}
                    >
                      {role.photo && (
                        <div className={`${styles.roleImage} ${isOpen ? styles.visible : ''}`}>
                          <Image src={role.photo} alt={role.title} fill style={{ objectFit: "cover" }} />
                        </div>
                      )}
                      <div className={styles.roleContent}>
                        <div className={styles.roleHeader}>
                          <div className={styles.roleIcon}>{role.icon}</div>
                          <h3 className={styles.roleTitle}>{role.title}</h3>
                          <ChevronIcon
                            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                            color="#FFB800"
                          />
                        </div>
                        <div className={`${styles.roleDescriptionWrapper} ${isOpen ? styles.roleDescriptionOpen : ''}`}>
                          <div className={styles.roleDescriptionInner}>
                            <h4 className={styles.expandedTitle}>{role.expandedTitle}</h4>
                            <ul className={styles.descriptionList}>
                              {role.description.map((item, index) => (
                                <li key={index} className={styles.descriptionItem}>
                                  <span className={styles.bullet}>
                                    <BulletIcon />
                                  </span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                            <Button
                              variant="outlineOrange"
                              size="md"
                              fullWidth
                              className={styles.selectButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectRole(role.id);
                              }}
                            >
                              Выбрать
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className={styles.stepContent} key="step2">
              <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                  id="login"
                  variant="emailOrPhone"
                  value={state.login}
                  onChange={(e) => state.setLogin(e.target.value)}
                  placeholder="Электронная почта или телефон"
                  required
                />

                <Input
                  id="password"
                  variant="password"
                  value={state.password}
                  onChange={(e) => state.setPassword(e.target.value)}
                  placeholder="Пароль"
                  required
                />

                <Input
                  id="repeatPassword"
                  variant="password"
                  value={state.repeatPassword}
                  onChange={(e) => state.setRepeatPassword(e.target.value)}
                  placeholder="Повторите пароль"
                  required
                />

                  <Button
                    type="submit"
                    variant="chat"
                    size="lg"
                    fullWidth
                    isLoading={state.isLoading}
                  >
                    Зарегистрироваться
                  </Button>
              </form>
            </div>
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

