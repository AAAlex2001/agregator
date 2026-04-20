"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { PlusIcon } from "@/source/shared/ui/icons";
import { UserAvatar } from "@/source/shared/ui/UserAvatar";
import s from "./ProfileAvatarUpload.module.scss";

interface ProfileAvatarUploadProps {
  avatarUrl?: string | null;
  previewUrl?: string | null;
  disabled?: boolean;
  error?: string | null;
  onSelect: (file: File | null) => void;
}

export function ProfileAvatarUpload({
  avatarUrl,
  previewUrl,
  disabled = false,
  error,
  onSelect,
}: ProfileAvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hover, setHover] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const imageSrc = previewUrl ?? avatarUrl ?? null;
  const expanded = hover && canHover && !disabled;

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div className={s.wrapper}>
      <h2 className={s.title}>Фото профиля</h2>
      <div className={s.content}>
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          className={s.input}
          disabled={disabled}
          onChange={(e) => {
            onSelect(e.target.files?.[0] ?? null);
            e.currentTarget.value = "";
          }}
        />
        <motion.button
          type="button"
          className={s.trigger}
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          animate={{
            width: expanded ? 260 : 72,
            backgroundColor: expanded ? "#FFDDA9" : "rgba(255, 221, 169, 0)",
          }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
        >
          <AnimatePresence>
            {expanded && (
              <motion.span
                key="label"
                className={s.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                Загрузите Ваше фото
              </motion.span>
            )}
          </AnimatePresence>
          <span className={s.avatar}>
            {imageSrc ? (
              <UserAvatar src={imageSrc} alt="Фото профиля" className={s.avatar} imageClassName={s.avatarImage} />
            ) : (
              <PlusIcon className={s.plus} />
            )}
          </span>
        </motion.button>
        <span className={s.hint}>JPG, PNG до 5 МБ</span>
        {error ? <span className={s.error}>{error}</span> : null}
      </div>
    </div>
  );
}
