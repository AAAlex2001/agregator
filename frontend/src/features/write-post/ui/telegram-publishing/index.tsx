"use client";

import { useState } from "react";
import type { TelegramOptions } from "@/entities/post";
import { Button } from "@/shared/ui/button";
import { FormSection } from "@/shared/ui/form-section";
import { EyeIcon } from "@/shared/ui/icons";
import { Switch } from "@/shared/ui/switch";
import type { PostFormState } from "../../model/types";
import { ButtonsEditor } from "../buttons-editor";
import { ChannelPicker } from "../channel-picker";
import { PollEditor } from "../poll-editor";
import { TelegramPreview } from "../telegram-preview";
import { TelegramSettings } from "../telegram-settings";
import styles from "./style.module.scss";

/** Поля формы, каналы, где пост уже вышел, и что ещё можно менять. */
interface TelegramPublishingProps {
  state: PostFormState;
  sentIds: number[];
  canSchedule: boolean;
  disabled: boolean;
  onToggleChannel: (channelId: number) => void;
  onOnSiteChange: (onSite: boolean) => void;
  onTelegramChange: (telegram: TelegramOptions) => void;
  onScheduleChange: (scheduledAt: string) => void;
}

/** Каналы, лента сайта, кнопки, опрос, настройки и предпросмотр Telegram-поста. */
export function TelegramPublishing({
  state,
  sentIds,
  canSchedule,
  disabled,
  onToggleChannel,
  onOnSiteChange,
  onTelegramChange,
  onScheduleChange,
}: TelegramPublishingProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { telegram } = state;
  const isEmpty = !state.html && state.media.length === 0;

  return (
    <div className={styles.publishing}>
      <section className={styles.where}>
        <h2 className={styles.title}>Где опубликовать</h2>
        <ChannelPicker
          selectedIds={state.channelIds}
          sentIds={sentIds}
          disabled={disabled}
          onToggle={onToggleChannel}
        />
        <Switch
          id="post-on-site"
          checked={state.onSite}
          onChange={onOnSiteChange}
          label="Также в ленте сайта"
          description="Пост появится в разделе «Публикации» на сайте"
          disabled={disabled}
        />
      </section>

      <FormSection
        title="Кнопки под постом"
        hint="Ссылка, промокод или скрытый текст. К альбому из нескольких фото кнопки не добавить"
        collapsible
        defaultOpen={telegram.buttons.length > 0}
      >
        <ButtonsEditor
          rows={telegram.buttons}
          disabled={disabled}
          onChange={(buttons) => onTelegramChange({ ...telegram, buttons })}
        />
      </FormSection>

      <FormSection
        title="Опрос"
        hint="Бот отправит опрос сразу после поста"
        collapsible
        defaultOpen={telegram.poll !== null}
      >
        <PollEditor
          poll={telegram.poll}
          disabled={disabled}
          onChange={(poll) => onTelegramChange({ ...telegram, poll })}
        />
      </FormSection>

      <FormSection
        title="Настройки публикации"
        hint="Время выхода, звук, закреп, превью ссылок и автоудаление"
        collapsible
        defaultOpen={Boolean(state.scheduledAt)}
      >
        <TelegramSettings
          telegram={telegram}
          scheduledAt={state.scheduledAt}
          canSchedule={canSchedule}
          hasMedia={state.media.length > 0}
          disabled={disabled}
          onChange={onTelegramChange}
          onScheduleChange={onScheduleChange}
        />
      </FormSection>

      <Button
        variant="outline"
        size="sm"
        className={styles.previewButton}
        disabled={isEmpty}
        onClick={() => setIsPreviewOpen(true)}
      >
        <EyeIcon />
        Предпросмотр в Telegram
      </Button>
      <TelegramPreview
        html={state.html}
        media={state.media}
        telegram={telegram}
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
