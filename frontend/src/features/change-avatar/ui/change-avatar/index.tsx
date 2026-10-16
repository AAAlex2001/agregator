"use client";

import { useRef } from "react";
import type { ChangeEvent } from "react";
import { Button } from "@/shared/ui/button";
import { UserAvatar } from "@/shared/ui/user-avatar";
import { useChangeAvatar } from "../../model/use-change-avatar";
import styles from "./style.module.scss";

/** Текущее фото, обновляемое общим профилем после загрузки. */
interface ChangeAvatarProps {
  avatarUrl: string | null;
}

/** Показывает фотографию профиля и привычную кнопку выбора нового файла. */
export function ChangeAvatar({ avatarUrl }: ChangeAvatarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isUploading, changeAvatar } = useChangeAvatar();

  /** Открывает системное окно выбора фотографии. */
  function openFileDialog() {
    inputRef.current?.click();
  }

  /** Загружает выбранный файл и разрешает повторно выбрать тот же файл. */
  function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (file) {
      void changeAvatar(file);
    }
  }

  return (
    <div className={styles.picker}>
      <UserAvatar
        src={avatarUrl}
        alt="Фото профиля"
        className={styles.avatar}
      />

      <div className={styles.actions}>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          className={styles.input}
          onChange={selectFile}
        />
        <Button
          variant="secondary"
          size="sm"
          isLoading={isUploading}
          onClick={openFileDialog}
        >
          Изменить фото
        </Button>
        <span className={styles.hint}>JPG или PNG до 5 МБ</span>
      </div>
    </div>
  );
}
