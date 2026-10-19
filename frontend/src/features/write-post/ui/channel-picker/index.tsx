"use client";

import { channelProblem, describeChannel, useChannels } from "@/entities/poster-channel";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Выбранные каналы, уже вышедшие и действие выбора. */
interface ChannelPickerProps {
  selectedIds: number[];
  sentIds: number[];
  disabled: boolean;
  onToggle: (channelId: number) => void;
}

/** Свои каналы флажками. Канал, куда бот не может публиковать, выбрать нельзя. */
export function ChannelPicker({
  selectedIds,
  sentIds,
  disabled,
  onToggle,
}: ChannelPickerProps) {
  const { channels, error, isLoading } = useChannels();

  if (isLoading) {
    return <Skeleton className={styles.skeleton} />;
  }

  if (error) {
    return <p className={styles.problem}>{error}</p>;
  }

  if (channels.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>Подключите канал или группу, чтобы публиковать в Telegram.</p>
        <Button
          variant="outline"
          size="sm"
          href="/posts/channels"
        >
          Подключить канал
        </Button>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {channels.map((channel) => {
        const problem = channelProblem(channel);
        const isSent = sentIds.includes(channel.id);

        return (
          <li
            key={channel.id}
            className={styles.item}
          >
            <Checkbox
              id={`post-channel-${channel.id}`}
              checked={selectedIds.includes(channel.id)}
              disabled={disabled || isSent || problem !== null}
              onChange={() => onToggle(channel.id)}
            >
              <span className={styles.label}>
                <span className={styles.title}>{channel.title}</span>
                <span className={styles.meta}>{isSent ? "Пост уже вышел здесь" : describeChannel(channel)}</span>
                {problem && <span className={styles.problem}>{problem}</span>}
              </span>
            </Checkbox>
          </li>
        );
      })}
    </ul>
  );
}
