"use client";

import { ChannelCard, ChannelCardSkeleton, useChannels } from "@/entities/poster-channel";
import { ConnectChannelButton } from "@/features/connect-channel";
import { DisconnectChannelButton } from "@/features/disconnect-channel";
import { RefreshChannelButton } from "@/features/refresh-channel";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import { CONNECT_STEPS } from "../../config/connect-steps";
import styles from "./style.module.scss";

/** Свои Telegram-каналы и группы: как подключить, список, обновление и отключение. */
export function PosterChannels() {
  const {
    channels,
    error,
    isLoading,
    replaceChannel,
    removeChannel,
  } = useChannels();

  return (
    <div className={styles.section}>
      <div className={styles.heading}>
        <Title
          as="h1"
          text="Каналы и группы"
        />
        <Subtitle
          text="Подключите свои Telegram-каналы и группы — и публикуйте в них посты прямо с сайта."
          className={styles.subtitle}
        />
      </div>

      <section className={styles.howTo}>
        <h2 className={styles.howToTitle}>Как подключить</h2>
        <ol className={styles.steps}>
          {CONNECT_STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <ConnectChannelButton />
      </section>

      {isLoading && (
        <div className={styles.list}>
          <ChannelCardSkeleton />
          <ChannelCardSkeleton />
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}
      {!isLoading && !error && channels.length === 0 && (
        <p className={styles.empty}>Подключённых каналов пока нет.</p>
      )}

      <div className={styles.list}>
        {channels.map((channel) => (
          <ChannelCard
            key={channel.id}
            channel={channel}
            actions={(
              <>
                <RefreshChannelButton
                  channel={channel}
                  onRefreshed={replaceChannel}
                />
                <DisconnectChannelButton
                  channel={channel}
                  onDisconnected={removeChannel}
                />
              </>
            )}
          />
        ))}
      </div>
    </div>
  );
}
