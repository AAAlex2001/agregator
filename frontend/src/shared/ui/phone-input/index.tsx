"use client";

import { PhoneIcon } from "@/shared/ui/icons";
import { TextInput, type TextInputProps } from "@/shared/ui/text-input";
import styles from "./style.module.scss";

/** Поле телефона с иконкой и цифровой клавиатурой на мобильных устройствах. */
export function PhoneInput(props: TextInputProps) {
  return (
    <TextInput
      {...props}
      type="tel"
      inputMode="tel"
      startIcon={<PhoneIcon className={styles.iconSvg} />}
    />
  );
}
