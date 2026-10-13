"use client";

import { useRef } from "react";
import Button from "@/source/shared/ui/Button";
import { UserAvatar } from "@/source/shared/ui/UserAvatar";
import { useUpdatePhoto } from "../model/useUpdatePhoto";
import s from "./PhotoPicker.module.scss";

interface PhotoPickerProps {
  avatarUrl: string | null;
}

/** Фото профиля и кнопка «Изменить фото»: файл загружается сразу после выбора. */
export function PhotoPicker({ avatarUrl }: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isUploading, upload } = useUpdatePhoto();

  return (
    <div className={s.picker}>
      <UserAvatar src={avatarUrl} alt="Фото профиля" className={s.avatar} />

      <div className={s.actions}>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          className={s.input}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) upload(file);
            event.target.value = "";
          }}
        />
        <Button variant="secondary" size="sm" isLoading={isUploading} onClick={() => inputRef.current?.click()}>
          Изменить фото
        </Button>
        <span className={s.hint}>JPG или PNG до 5 МБ</span>
      </div>
    </div>
  );
}
