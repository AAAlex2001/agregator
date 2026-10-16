"use client";

import { EmailIcon } from "@/shared/ui/icons";
import { TextInput, type TextInputProps } from "@/shared/ui/text-input";
import styles from "./style.module.scss";

/** Поле электронной почты с иконкой и браузерной проверкой адреса. */
export function EmailInput(props: TextInputProps) {
  return (
    <TextInput
      {...props}
      type="email"
      inputMode="email"
      startIcon={<EmailIcon className={styles.iconSvg} />}
    />
  );
}
