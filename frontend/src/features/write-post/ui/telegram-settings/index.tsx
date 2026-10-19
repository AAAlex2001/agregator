"use client";

import type { TelegramOptions } from "@/entities/post";
import { CalendarInput } from "@/shared/ui/calendar-input";
import { Field } from "@/shared/ui/field";
import { Select } from "@/shared/ui/select";
import { Switch } from "@/shared/ui/switch";
import { AUTO_DELETE_OPTIONS, LINK_PREVIEW_OPTIONS, LINK_PREVIEWS } from "../../config/telegram-options";
import styles from "./style.module.scss";

/** Настройки поста, время публикации и можно ли его ещё откладывать. */
interface TelegramSettingsProps {
  telegram: TelegramOptions;
  scheduledAt: string;
  canSchedule: boolean;
  disabled: boolean;
  onChange: (telegram: TelegramOptions) => void;
  onScheduleChange: (scheduledAt: string) => void;
}

/** Когда выйти, звук, закреп, пересылка, превью ссылок, подпись над медиа и автоудаление. */
export function TelegramSettings({
  telegram,
  scheduledAt,
  canSchedule,
  disabled,
  onChange,
  onScheduleChange,
}: TelegramSettingsProps) {
  /** Меняет один переключатель. */
  function toggle(name: "silent" | "pin" | "protect" | "caption_above" | "link_preview_above") {
    return (checked: boolean) => onChange({ ...telegram, [name]: checked });
  }

  /** Превью ссылок из выбранного варианта списка. */
  function changePreview(value: string) {
    const preview = LINK_PREVIEWS.find((item) => item === value) ?? "auto";

    onChange({ ...telegram, link_preview: preview });
  }

  return (
    <div className={styles.settings}>
      {canSchedule && (
        <Field
          label="Когда опубликовать"
          hint="Оставьте пустым, чтобы опубликовать сразу"
        >
          <CalendarInput
            value={scheduledAt}
            onChange={onScheduleChange}
            placeholder="Сразу"
            withTime
          />
        </Field>
      )}
      <Switch
        id="telegram-silent"
        checked={telegram.silent}
        onChange={toggle("silent")}
        label="Без звука"
        description="Подписчики получат уведомление без звука"
        disabled={disabled}
      />
      <Switch
        id="telegram-pin"
        checked={telegram.pin}
        onChange={toggle("pin")}
        label="Закрепить в канале"
        disabled={disabled}
      />
      <Switch
        id="telegram-protect"
        checked={telegram.protect}
        onChange={toggle("protect")}
        label="Запретить пересылку и сохранение"
        disabled={disabled}
      />
      <Switch
        id="telegram-caption-above"
        checked={telegram.caption_above}
        onChange={toggle("caption_above")}
        label="Подпись над фото и видео"
        disabled={disabled}
      />
      <Field label="Превью ссылок">
        <Select
          ariaLabel="Превью ссылок"
          options={LINK_PREVIEW_OPTIONS}
          value={telegram.link_preview}
          onChange={changePreview}
        />
      </Field>
      <Switch
        id="telegram-preview-above"
        checked={telegram.link_preview_above}
        onChange={toggle("link_preview_above")}
        label="Превью ссылки над текстом"
        disabled={disabled}
      />
      <Field
        label="Автоудаление"
        hint="Пост исчезнет из каналов, на сайте останется"
      >
        <Select
          ariaLabel="Автоудаление"
          options={AUTO_DELETE_OPTIONS}
          value={telegram.auto_delete_hours === null ? "" : String(telegram.auto_delete_hours)}
          onChange={(value) => onChange({ ...telegram, auto_delete_hours: value ? Number(value) : null })}
        />
      </Field>
    </div>
  );
}
