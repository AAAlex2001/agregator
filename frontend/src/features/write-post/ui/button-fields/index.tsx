"use client";

import type { TelegramButton } from "@/entities/post";
import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import { TrashIcon } from "@/shared/ui/icons";
import { Tabs } from "@/shared/ui/tabs";
import { TextInput } from "@/shared/ui/text-input";
import {
  BUTTON_KIND_TABS,
  BUTTON_KINDS,
  BUTTON_STYLE_TABS,
  BUTTON_STYLES,
} from "../../config/telegram-options";
import styles from "./style.module.scss";

/** Выбранная кнопка и действия с ней. */
interface ButtonFieldsProps {
  button: TelegramButton;
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

/** Подсказка в поле значения для каждого вида кнопки. */
function valuePlaceholder(button: TelegramButton): string {
  if (button.kind === "copy") {
    return "SALE2026";
  }

  return button.kind === "hidden" ? "Промокод SALE2026 — скидка 20%" : "https://";
}

/** Настройка выбранной кнопки: что делает, надпись, ссылка или текст, цвет. */
export function ButtonFields({ button, onChange, onRemove }: ButtonFieldsProps) {
  const kindHint = BUTTON_KIND_TABS.find((tab) => tab.id === button.kind)?.hint;

  /** Вид кнопки из выбранной вкладки. */
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
        <span className={styles.title}>Настройка кнопки</span>
        <Button
          variant="transparent"
          size="sm"
          className={styles.remove}
          onClick={onRemove}
        >
          <TrashIcon />
          Удалить
        </Button>
      </div>
      <Field
        label="Что делает"
        hint={kindHint}
      >
        <Tabs
          tabs={BUTTON_KIND_TABS}
          activeTab={button.kind}
          onTabChange={changeKind}
        />
      </Field>
      <div className={styles.grid}>
        <Field label="Надпись на кнопке">
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
            placeholder={valuePlaceholder(button)}
            onChange={(event) => onChange({ ...button, value: event.target.value })}
          />
        </Field>
      </div>
      {button.kind === "hidden" && (
        <Field label="Что увидят те, кто не подписан">
          <TextInput
            value={button.alt}
            maxLength={200}
            placeholder="Подпишитесь на канал, чтобы увидеть"
            onChange={(event) => onChange({ ...button, alt: event.target.value })}
          />
        </Field>
      )}
      <Field label="Цвет">
        <Tabs
          tabs={BUTTON_STYLE_TABS}
          activeTab={button.style ?? ""}
          onTabChange={changeStyle}
        />
      </Field>
    </div>
  );
}
