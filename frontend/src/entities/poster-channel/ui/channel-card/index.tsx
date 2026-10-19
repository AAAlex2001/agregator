import type { ReactNode } from "react";
import { channelProblem, describeChannel } from "../../model/channel-status";
import type { PosterChannel } from "../../model/types";
import styles from "./style.module.scss";

/** Подключённый канал и кнопки действий с ним. */
interface ChannelCardProps {
  channel: PosterChannel;
  actions?: ReactNode;
}

/** Буква-аватар, название, вид и участники, а при проблеме — что исправить. */
export function ChannelCard({ channel, actions }: ChannelCardProps) {
  const problem = channelProblem(channel);
  const letter = channel.title.trim().charAt(0).toUpperCase() || "#";

  return (
    <article className={styles.card}>
      <span
        className={styles.avatar}
        aria-hidden="true"
      >
        {letter}
      </span>
      <div className={styles.body}>
        <h3 className={styles.title}>{channel.title || "Без названия"}</h3>
        <p className={styles.meta}>{describeChannel(channel)}</p>
        {problem && <p className={styles.problem}>{problem}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </article>
  );
}
