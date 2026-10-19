"use client";

import type { TelegramOptions } from "@/entities/post";
import { CalendarInput } from "@/shared/ui/calendar-input";
import { Field } from "@/shared/ui/field";
import { Select } from "@/shared/ui/select";
import { Switch } from "@/shared/ui/switch";
import { Tabs } from "@/shared/ui/tabs";
import {
  AUTO_DELETE_OPTIONS,
  LINK_PREVIEW_TABS,
  LINK_PREVIEWS,
} from "../../config/telegram-options";
import styles from "./style.module.scss";

/** Настройки поста, время публикации, можно ли его ещё откладывать и есть ли в нём медиа. */
interface TelegramSettingsProps {
  telegram: TelegramOptions;
  scheduledAt: string;
  canSchedule: boolean;
  hasMedia: boolean;
  disabled: boolean;
  onChange: (telegram: TelegramOptions) => void;
  onScheduleChange: (scheduledAt: string) => void;
}

/**
 * Настройки по группам: когда выйти, уведомление и доступ, ссылки и медиа, автоудаление.
 * Настройки, которые сейчас ни на что не влияют, скрыты.
 */
export function TelegramSettings({
  telegram,
  scheduledAt,
  canSchedule,
  hasMedia,
  disabled,
  onChange,
  onScheduleChange,
}: TelegramSettingsProps) {
  const previewHint = LINK_PREVIEW_TABS.find((tab) => tab.id === telegram.link_preview)?.hint;

  /** Меняет один переключатель. */
  function toggle(name: "silent" | "pin" | "protect" | "caption_above" | "link_preview_above") {
    return (checked: boolean) => onChange({ ...telegram, [name]: checked });
  }

  /** Превью ссылок из выбранной вкладки. */
  function changePreview(value: string) {
    const preview = LINK_PREVIEWS.find((item) => item === value) ?? "auto";

    onChange({ ...telegram, link_preview: preview });
  }

  return (
    <div className={styles.settings}>
      {canSchedule && (
        <section className={styles.group}>
          <h3 className={styles.title}>Когда опубликовать</h3>
          <CalendarInput
            value={scheduledAt}
            onChange={onScheduleChange}
            placeholder="Сразу после нажатия «Опубликовать»"
            withTime
          />
        </section>
      )}

      <section className={styles.group}>
        <h3 className={styles.title}>Уведомление и доступ</h3>
        <Switch
          id="telegram-silent"
          checked={telegram.silent}
          onChange={toggle("silent")}
          label="Без звука"
          description="Подписчики получат уведомление, но телефон не зазвонит"
          disabled={disabled}
        />
        <Switch
          id="telegram-pin"
          checked={telegram.pin}
          onChange={toggle("pin")}
          label="Закрепить пост"
          description="Пост окажется в закрепе вверху канала"
          disabled={disabled}
        />
        <Switch
          id="telegram-protect"
          checked={telegram.protect}
          onChange={toggle("protect")}
          label="Запретить пересылку"
          description="Пост нельзя будет переслать, скопировать или сохранить"
          disabled={disabled}
        />
      </section>

      <section className={styles.group}>
        <h3 className={styles.title}>Ссылки и медиа</h3>
        <Field
          label="Превью ссылки"
          hint={previewHint}
        >
          <Tabs
            tabs={LINK_PREVIEW_TABS}
            activeTab={telegram.link_preview}
            onTabChange={changePreview}
            disabled={disabled}
          />
        </Field>
        {telegram.link_preview !== "off" && (
          <Switch
            id="telegram-preview-above"
            checked={telegram.link_preview_above}
            onChange={toggle("link_preview_above")}
            label="Превью над текстом"
            description="Картинка ссылки встанет перед текстом поста"
            disabled={disabled}
          />
        )}
        {hasMedia && (
          <Switch
            id="telegram-caption-above"
            checked={telegram.caption_above}
            onChange={toggle("caption_above")}
            label="Текст над фото и видео"
            description="Обычно Telegram ставит текст под медиа"
            disabled={disabled}
          />
        )}
      </section>

      <section className={styles.group}>
        <h3 className={styles.title}>Автоудаление</h3>
        <Field
          label="Удалить пост из каналов"
          hint="На сайте пост останется"
        >
          <Select
            ariaLabel="Когда удалить пост из каналов"
            options={AUTO_DELETE_OPTIONS}
            value={telegram.auto_delete_hours === null ? "" : String(telegram.auto_delete_hours)}
            onChange={(value) => onChange({
              ...telegram,
              auto_delete_hours: value ? Number(value) : null,
            })}
          />
        </Field>
      </section>
    </div>
  );
}
