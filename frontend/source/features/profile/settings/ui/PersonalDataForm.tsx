import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/source/shared/ui/Input";
import Button from "@/source/shared/ui/Button";
import AutofillGuard from "@/source/shared/ui/AutofillGuard";
import { LogoutIcon } from "@/source/shared/ui/icons";
import { useNotifications } from "@/shared/ui/Notifications";
import { logout } from "../api/settings.api";
import { useProfileForm } from "../model/useProfileForm";
import type { UserProfile } from "../model/types";
import { ProfileAvatarUpload } from "./ProfileAvatarUpload";
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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  const handleSave = async () => {
    const result = await form.handleSave(avatarFile);

    if (result.errorMessage) {
      showError(result.errorMessage);
      return;
    }

    if (result.profile) {
      onProfileUpdate(result.profile);
      setAvatarFile(null);
      setAvatarError(null);
      setAvatarPreviewUrl((currentPreviewUrl) => {
        if (currentPreviewUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(currentPreviewUrl);
        }

        return null;
      });
    }

    if (result.successMessage) {
      showSuccess(result.successMessage);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSave();
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

  const handleAvatarSelect = (file: File | null) => {
    if (!file) {
      return;
    }

    const isAllowedType = ["image/jpeg", "image/png"].includes(file.type) || /\.(jpe?g|png)$/i.test(file.name);

    if (!isAllowedType) {
      const message = "Можно загрузить только JPG или PNG размером до 5 МБ";
      setAvatarError(message);
      showError(message);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const message = "Размер фото не должен превышать 5 МБ";
      setAvatarError(message);
      showError(message);
      return;
    }

    setAvatarError(null);
    setAvatarFile(file);
    setAvatarPreviewUrl((currentPreviewUrl) => {
      if (currentPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(currentPreviewUrl);
      }

      return URL.createObjectURL(file);
    });
  };

  return (
    <>
      <ProfileAvatarUpload
        avatarUrl={profile.avatar_url}
        previewUrl={avatarPreviewUrl}
        disabled={form.isSaving || isLoggingOut}
        error={avatarError}
        onSelect={handleAvatarSelect}
      />

      <form className={s.form} onSubmit={handleSubmit} autoComplete="off" data-lpignore="true" data-1p-ignore="true">
        <AutofillGuard idPrefix="profile" />

        <div className={s.section}>
          <h2 className={s.subtitle}>Персональные данные</h2>
          <div className={s.grid}>
            <Input
              id="lastName"
              name="profile-last-name"
              variant="text"
              placeholder="Фамилия"
              aria-label="Фамилия"
              autoComplete="off"
              value={form.lastName}
              onChange={(e) => form.setLastName(e.target.value)}
            />
            <Input
              id="phone"
              name="profile-phone"
              type="tel"
              variant="phone"
              placeholder="+7-999-999-99-12"
              aria-label="Телефон"
              autoComplete="off"
              value={form.phone}
              onChange={(e) => form.setPhone(e.target.value)}
            />
            <Input
              id="firstName"
              name="profile-first-name"
              variant="text"
              placeholder="Имя"
              aria-label="Имя"
              autoComplete="off"
              value={form.firstName}
              onChange={(e) => form.setFirstName(e.target.value)}
            />
            <div className={s.emailCell}>
              <Input
                id="email"
                name="profile-email"
                type="email"
                variant="email"
                placeholder="Электронная почта"
                aria-label="Email"
                autoComplete="off"
                value={form.email}
                onChange={(e) => form.setEmail(e.target.value)}
              />
              {profile.email_verified && (
                <span className={s.verifiedBadge}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M11.2 4.2 5.833 9.567 2.8 6.533l.933-.933 2.1 2.1 4.434-4.433.933.933Z"
                      fill="currentColor"
                    />
                  </svg>
                  Почта подтверждена
                </span>
              )}
            </div>
          </div>

        </div>

        <div className={s.section}>
          <h2 className={s.subtitle}>Изменить пароль</h2>
          <div className={s.grid}>
            <Input
              id="password"
              name="profile-password"
              variant="password"
              placeholder="Введите новый пароль"
              aria-label="Пароль"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => form.setPassword(e.target.value)}
            />
            <Input
              id="repeatPassword"
              name="profile-password-repeat"
              variant="password"
              placeholder="Повторите новый пароль"
              aria-label="Повторите пароль"
              autoComplete="new-password"
              value={form.repeatPassword}
              onChange={(e) => form.setRepeatPassword(e.target.value)}
            />
          </div>
        </div>

        <div className={s.saveWrapper}>
          <Button
            type="submit"
            variant="chat"
            size="md"
            className={s.saveButton}
            disabled={isLoggingOut}
            isLoading={form.isSaving}
          >
            Сохранить изменения
          </Button>
          <Button
            type="button"
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
      </form>
    </>
  );
}
