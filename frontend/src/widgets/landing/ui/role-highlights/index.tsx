"use client";

import cn from "classnames";
import type { SyntheticEvent } from "react";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import { ROLE_HIGHLIGHTS } from "../../config/role-highlights";
import styles from "./style.module.scss";

/** Объясняет возможности платформы заказчику, исполнителю и держателю документов. */
export function RoleHighlights() {
  /** Возобновляет фоновое видео после окончания воспроизведения. */
  function replayVideo(event: SyntheticEvent<HTMLVideoElement>) {
    event.currentTarget.currentTime = 0;
    void event.currentTarget.play();
  }

  return (
    <section className={styles.section}>
      {ROLE_HIGHLIGHTS.map((item, index) => (
        <article
          key={item.id}
          className={cn(styles.card, {
            [styles.cardReverse]: index % 2 === 1,
          })}
          data-role={item.id}
        >
          <div className={styles.media}>
            <video
              className={styles.video}
              src={item.video}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onEnded={replayVideo}
            />
          </div>
          <div className={styles.copy}>
            <Title
              as="h2"
              text={item.title}
            />
            <Subtitle
              className={styles.text}
              text={item.text}
            />
          </div>
        </article>
      ))}
    </section>
  );
}
