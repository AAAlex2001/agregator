import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/source/shared/ui/Input";
import Button from "@/source/shared/ui/Button";
import { LogoutIcon } from "@/source/shared/ui/icons";
import { useNotifications } from "@/shared/ui/Notifications";
import { logout } from "../api/settings.api";
import { useProfileForm } from "../model/useProfileForm";
import type { UserProfile } from "../model/types";
import s from "./PersonalDataForm.module.scss";

interface Props {
  profile: UserProfile;
  onProfileUpdate: (p: UserProfile | null) => void;
}

export function PersonalDataForm({ profile, onProfileUpdate }: Props) {
  const form = useProfileForm(profile);
  const { showError, showSuccess } = useNotifications();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSave = async () => {
    const result = await form.handleSave();

    if (result.errorMessage) {
      showError(result.errorMessage);
      return;
    }

    if (result.profile) {
      onProfileUpdate(result.profile);
    }

    if (result.successMessage) {
      showSuccess(result.successMessage);
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    await logout();

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token");

    onProfileUpdate(null);
    router.push("/login");
  };

  return (
    <>
      <div className={s.section}>
        <h2 className={s.subtitle}>Персональные данные</h2>
        <div className={s.grid}>
          <Input variant="text" placeholder="Фамилия" aria-label="Фамилия"
            value={form.lastName} onChange={(e) => form.setLastName(e.target.value)} />
          <Input variant="phone" placeholder="Введите телефон" aria-label="Телефон"
            value={form.phone} onChange={(e) => form.setPhone(e.target.value)} />
          <Input variant="text" placeholder="Имя" aria-label="Имя"
            value={form.firstName} onChange={(e) => form.setFirstName(e.target.value)} />
          <Input variant="email" placeholder="Введите электронную почту" aria-label="Email"
            value={form.email} onChange={(e) => form.setEmail(e.target.value)} />
        </div>
      </div>

      <div className={s.section}>
        <h2 className={s.subtitle}>Изменить пароль</h2>
        <div className={s.grid}>
          <Input variant="password" placeholder="Введите новый пароль" aria-label="Пароль"
            value={form.password} onChange={(e) => form.setPassword(e.target.value)} />
          <Input variant="password" placeholder="Повторите новый пароль" aria-label="Повторите пароль"
            value={form.repeatPassword} onChange={(e) => form.setRepeatPassword(e.target.value)} />
        </div>
      </div>

      <div className={s.saveWrapper}>
        <Button variant="chat" size="md" className={s.saveButton}
          disabled={isLoggingOut}
          onClick={() => void handleSave()} isLoading={form.isSaving}>
          Сохранить изменения
        </Button>
        <Button
          variant="transparent"
          size="md"
          className={s.logoutButton}
          disabled={form.isSaving || isLoggingOut}
          onClick={() => void handleLogout()}
        >
          <span className={s.logoutContent}>
            <LogoutIcon className={s.logoutIcon} />
            <span>Выйти из профиля</span>
          </span>
        </Button>
      </div>
    </>
  );
}
