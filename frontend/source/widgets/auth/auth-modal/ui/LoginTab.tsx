"use client";

import { useLogin, LoginForm, RoleChoiceModal, EmailConfirmModal } from "@/source/features/auth/login";
import Button from "@/source/shared/ui/Button";
import s from "./auth-modal.module.scss";

interface Props {
  onSuccess: () => void;
  onForgot: () => void;
}

export function LoginTab({ onSuccess, onForgot }: Props) {
  const auth = useLogin({ onSuccess });
  const showRoleModal = auth.availableRoles !== null && auth.availableRoles.length > 1;

  return (
    <div className={s.flow}>
      <LoginForm
        email={auth.email}
        password={auth.password}
        onEmailChange={auth.setEmail}
        onPasswordChange={auth.setPassword}
        isLoading={auth.waiting}
        fromOrder={auth.fromOrder}
        onSubmit={auth.submit}
      />

      <Button variant="transparent" size="sm" className={s.centerLink} onClick={onForgot}>
        Забыли пароль?
      </Button>

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
