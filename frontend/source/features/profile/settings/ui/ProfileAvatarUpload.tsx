"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState, type FocusEvent } from "react";
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
  const [isExpanded, setIsExpanded] = useState(false);
  const imageSrc = previewUrl ?? avatarUrl ?? null;
  const isInteractive = !disabled && isExpanded;

  const handleBlur = (event: FocusEvent<HTMLButtonElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsExpanded(false);
    }
  };

  return (
    <div className={s.wrapper}>
      <div className={s.heading}>
        <h2 className={s.title}>Фото профиля</h2>
      </div>

      <div className={s.content}>
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

        <div className={s.triggerWrap}>
          <motion.button
            type="button"
            className={s.trigger}
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            onHoverStart={() => {
              if (!disabled) {
                setIsExpanded(true);
              }
            }}
            onHoverEnd={() => setIsExpanded(false)}
            onFocus={() => {
              if (!disabled) {
                setIsExpanded(true);
              }
            }}
            onBlur={handleBlur}
            animate={{
              width: isInteractive ? "100%" : 72,
              backgroundColor: isInteractive ? "rgba(255, 138, 0, 0.16)" : "rgba(255, 221, 169, 0)",
              boxShadow: isInteractive ? "0 18px 40px rgba(255, 138, 0, 0.14)" : "0 0 0 rgba(255, 138, 0, 0)",
            }}
            transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.9 }}
          >
            <span className={s.avatarFrame}>
              {imageSrc ? (
                <>
                  <UserAvatar src={imageSrc} alt="Фото профиля" className={s.avatar} imageClassName={s.avatarImage} />
                  <motion.span
                    className={s.editBadge}
                    animate={{
                      x: isInteractive ? 6 : 0,
                      rotate: isInteractive ? 90 : 0,
                      backgroundColor: isInteractive ? "#FF8A00" : "#FFFFFF",
                      color: isInteractive ? "#FFFFFF" : "#FF8A00",
                    }}
                    transition={{ type: "spring", stiffness: 360, damping: 24 }}
                  >
                    <PlusIcon className={s.editBadgeIcon} />
                  </motion.span>
                </>
              ) : (
                <motion.span
                  className={s.emptyAvatar}
                  animate={{
                    backgroundColor: isInteractive ? "#FF8A00" : "#FFDDA9",
                    boxShadow: isInteractive ? "0 14px 30px rgba(255, 138, 0, 0.28)" : "0 0 0 rgba(255, 138, 0, 0)",
                  }}
                  transition={{ type: "spring", stiffness: 340, damping: 26 }}
                >
                  <motion.span
                    className={s.plusWrap}
                    animate={{
                      x: isInteractive ? 8 : 0,
                      rotate: isInteractive ? 90 : 0,
                      color: isInteractive ? "#FFFFFF" : "#FF8A00",
                    }}
                    transition={{ type: "spring", stiffness: 360, damping: 24 }}
                  >
                    <PlusIcon className={s.plus} />
                  </motion.span>
                </motion.span>
              )}
            </span>

            <span className={s.labelViewport}>
              <AnimatePresence initial={false}>
                {isInteractive ? (
                  <motion.span
                    key="avatar-upload-label"
                    className={s.labelInner}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    <span className={s.actionLabel}>Загрузите Ваше фото</span>
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </span>
          </motion.button>
        </div>

        <span className={s.hint}>JPG, PNG до 5 МБ</span>
        {error ? <span className={s.error}>{error}</span> : null}
      </div>
    </div>
  );
}