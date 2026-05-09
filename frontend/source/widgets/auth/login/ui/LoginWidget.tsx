"use client";

import Link from "next/link";
import { LogoIcon } from "@/source/shared/ui/icons";
import { useLogin, LoginForm, RoleChoiceModal, EmailConfirmModal } from "@/source/features/auth/login";
import styles from "./LoginWidget.module.scss";

export function LoginWidget() {
  const auth = useLogin();
  const showRoleModal = auth.availableRoles !== null && auth.availableRoles.length > 1;

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

          <LoginForm
            form={auth.form}
            isLoading={auth.isLoading}
            fromOrder={auth.fromOrder}
            onSubmit={auth.submit}
          />

          <div className={styles.footer}>
            <p>
              Нет аккаунта?{" "}
              <Link href="/register" className={styles.link}>Зарегистрироваться</Link>
            </p>
            <p>
              <Link href="/forgot-password" className={styles.forgotLink}>Забыли пароль?</Link>
            </p>
          </div>
        </div>
      </div>

      {showRoleModal && auth.availableRoles && (
        <RoleChoiceModal
          roles={auth.availableRoles}
          isFinalizing={auth.isFinalizing}
          onChoose={auth.chooseRole}
          onClose={auth.cancelRoleChoice}
        />
      )}

      {auth.pendingConfirm && (
        <EmailConfirmModal
          email={auth.pendingConfirm.email}
          role={auth.pendingConfirm.role}
          onClose={auth.closeConfirm}
          onConfirmed={auth.handleConfirmed}
        />
      )}
    </div>
  );
}
