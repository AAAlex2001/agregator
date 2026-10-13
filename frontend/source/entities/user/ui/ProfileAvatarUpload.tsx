"use client";

import { useRef } from "react";
import Button from "@/source/shared/ui/Button";
import { UserAvatar } from "@/source/shared/ui/UserAvatar";
import s from "./ProfileAvatarUpload.module.scss";

interface ProfileAvatarUploadProps {
  avatarUrl?: string | null;
  previewUrl?: string | null;
  disabled?: boolean;
  error?: string | null;
  onSelect: (file: File | null) => void;
}

/** Передаёт выбранное фото в форму профиля и показывает его предпросмотр. */
export function ProfileAvatarUpload({
  avatarUrl,
  previewUrl,
  disabled = false,
  error,
  onSelect,
}: ProfileAvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={s.wrapper}>
      <UserAvatar src={previewUrl ?? avatarUrl} alt="Фото профиля" className={s.avatar} />
      <div className={s.actions}>
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          className={s.input}
          disabled={disabled}
          onChange={(event) => {
            onSelect(event.target.files?.[0] ?? null);
            event.currentTarget.value = "";
          }}
        />
        <Button variant="secondary" size="sm" disabled={disabled} onClick={() => inputRef.current?.click()}>
          Изменить фото
        </Button>
        <span className={s.hint}>JPG, PNG до 5 МБ</span>
        {error && <span className={s.error} role="alert">{error}</span>}
      </div>
    </div>
  );
}
