"use client";

import Link from "next/link";
import { LogoIcon, CustomerIcon, ExpertIcon, DiplomaIcon } from "@/source/shared/ui/icons";
import { Title } from "@/source/shared/ui/Typography";
import {
  useRegister,
  RoleSelectStep,
  CredentialsStep,
  EmailConfirmStep,
  ROLE_ID_CUSTOMER,
  ROLE_ID_EXPERT,
  ROLE_ID_LICENSE_HOLDER,
} from "@/source/features/auth/register";
import type { Role } from "@/source/features/auth/register";
import styles from "./RegisterWidget.module.scss";

const roles: Role[] = [
  {
    id: ROLE_ID_CUSTOMER,
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
    id: ROLE_ID_EXPERT,
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
  {
    id: ROLE_ID_LICENSE_HOLDER,
    title: "Держатель лицензии",
    icon: <DiplomaIcon size={24} />,
    expandedTitle: "Предоставляйте лицензию ЭПБ ОПО для работы",
    description: [
      "Подтвердите номер лицензии и объекты экспертизы",
      "Принимайте заявки на предоставление лицензии",
      "Договаривайтесь о цене напрямую",
    ],
    photo: "/license_holder.webp",
  },
];

const stepLabels: Record<1 | 2 | 3, string> = {
  1: "Шаг 1. Выбор роли",
  2: "Шаг 2. Данные",
  3: "Шаг 3. Код",
};

export function RegisterWidget() {
  const reg = useRegister();

  const formContainerClass = [styles.formContainer, reg.step === 3 ? styles.compact : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.container}>
      <div className={styles.background} />
      <div className={styles.content}>
        <div className={formContainerClass}>
          <div className={styles.header}>
            <Link href="/" className={styles.logo}>
              <LogoIcon title="Ресурс-Плюс" />
            </Link>
          </div>

          <div className={styles.stepsHeader}>
            <Title as="h1" text="Регистрация" className={styles.registrationTitle} />
            <span className={styles.stepIndicator}>{stepLabels[reg.step]}</span>
          </div>

          {reg.step === 1 && (
            <RoleSelectStep
              roles={roles}
              openedCardId={reg.openedCardId}
              onToggleCard={reg.toggleCard}
              onSelectRole={reg.selectRole}
            />
          )}
          {reg.step === 2 && (
            <CredentialsStep
              form={reg.form}
              isLoading={reg.isLoading}
              licenseFile={reg.licenseFile}
              onPhoneChange={reg.setPhone}
              onLicenseFileSelect={reg.selectLicenseFile}
              onSubmit={reg.submit}
            />
          )}
          {reg.step === 3 && (
            <EmailConfirmStep
              form={reg.confirmForm}
              email={reg.pendingEmail}
              isLoading={reg.isConfirmLoading}
              onSubmit={reg.confirmSubmit}
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
