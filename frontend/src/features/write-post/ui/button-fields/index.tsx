"use client";

import type { TelegramButton } from "@/entities/post";
import { Field } from "@/shared/ui/field";
import { RemoveButton } from "@/shared/ui/remove-button";
import { Select } from "@/shared/ui/select";
import { TextInput } from "@/shared/ui/text-input";
import {
  BUTTON_KIND_OPTIONS,
  BUTTON_KINDS,
  BUTTON_STYLE_OPTIONS,
  BUTTON_STYLES,
} from "../../config/telegram-options";
import styles from "./style.module.scss";

/** Кнопка, её место для подписей и действия с ней. */
interface ButtonFieldsProps {
  button: TelegramButton;
  number: string;
  onChange: (button: TelegramButton) => void;
  onRemove: () => void;
}

/** Подпись поля значения для каждого вида кнопки. */
function valueLabel(button: TelegramButton): string {
  if (button.kind === "copy") {
    return "Что скопируется";
  }

  return button.kind === "hidden" ? "Текст для подписчиков" : "Ссылка";
}

/** Поля одной кнопки: вид, надпись, ссылка или текст, цвет. */
export function ButtonFields({
  button,
  number,
  onChange,
  onRemove,
}: ButtonFieldsProps) {
  /** Вид кнопки из выбранного варианта списка. */
  function changeKind(value: string) {
    const kind = BUTTON_KINDS.find((item) => item === value) ?? "url";

    onChange({ ...button, kind });
  }

  /** Цвет кнопки; пустое значение — обычная. */
  function changeStyle(value: string) {
    const style = BUTTON_STYLES.find((item) => item === value) ?? null;

    onChange({ ...button, style });
  }

  return (
    <div className={styles.button}>
      <div className={styles.head}>
        <span className={styles.number}>Кнопка {number}</span>
        <RemoveButton
          label={`Удалить кнопку ${number}`}
          onClick={onRemove}
        />
      </div>
      <div className={styles.grid}>
        <Field label="Что делает">
          <Select
            ariaLabel="Что делает кнопка"
            options={BUTTON_KIND_OPTIONS}
            value={button.kind}
            onChange={changeKind}
          />
        </Field>
        <Field label="Надпись">
          <TextInput
            value={button.text}
            maxLength={64}
            placeholder="Подробнее"
            onChange={(event) => onChange({ ...button, text: event.target.value })}
          />
        </Field>
        <Field label={valueLabel(button)}>
          <TextInput
            value={button.value}
            maxLength={button.kind === "url" ? 512 : 200}
            placeholder={button.kind === "url" ? "https://" : ""}
            onChange={(event) => onChange({ ...button, value: event.target.value })}
          />
        </Field>
        {button.kind === "hidden" && (
          <Field label="Тем, кто не подписан">
            <TextInput
              value={button.alt}
              maxLength={200}
              placeholder="Подпишитесь, чтобы увидеть"
              onChange={(event) => onChange({ ...button, alt: event.target.value })}
            />
          </Field>
        )}
        <Field label="Цвет">
          <Select
            ariaLabel="Цвет кнопки"
            options={BUTTON_STYLE_OPTIONS}
            value={button.style ?? ""}
            onChange={changeStyle}
          />
        </Field>
      </div>
    </div>
  );
}
