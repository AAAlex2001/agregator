"use client";

import cn from "classnames";
import Image from "next/image";
import type { PostMedia } from "@/entities/post";
import { Loader } from "@/shared/ui/loader";
import { Modal } from "@/shared/ui/modal";
import { useTelegramPreview } from "../../model/use-telegram-preview";
import styles from "./style.module.scss";

/** Текст и файлы поста, открытие окна и закрытие. */
interface TelegramPreviewProps {
  html: string;
  media: PostMedia[];
  open: boolean;
  onClose: () => void;
}

/** Пост так, как его покажет Telegram: первое фото, текст и сколько символов занято. */
export function TelegramPreview({
  html,
  media,
  open,
  onClose,
}: TelegramPreviewProps) {
  const { preview, error, isLoading } = useTelegramPreview(html, media.length, open);
  const cover = media[0];
  const isTooLong = preview !== null && preview.length > preview.limit;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      ariaLabelledBy="telegram-preview-title"
    >
      <h2
        id="telegram-preview-title"
        className={styles.title}
      >
        Так пост увидят в Telegram
      </h2>
      {isLoading && <Loader />}
      {error && <p className={styles.error}>{error}</p>}
      {preview && (
        <div className={styles.chat}>
          <div className={styles.bubble}>
            {cover && cover.kind === "photo" && (
              <span className={styles.cover}>
                <Image
                  src={cover.url}
                  alt=""
                  fill
                  sizes="400px"
                  unoptimized
                />
              </span>
            )}
            {cover && cover.kind === "video" && <span className={styles.video}>Видео</span>}
            {media.length > 1 && <span className={styles.album}>Альбом: {media.length} файлов</span>}
            <div
              className={styles.text}
              dangerouslySetInnerHTML={{ __html: preview.html }}
            />
          </div>
          <p className={cn(styles.counter, { [styles.counterOver]: isTooLong })}>
            {preview.length} из {preview.limit} символов
            {media.length > 0 && " — с фото и видео текст идёт подписью"}
          </p>
        </div>
      )}
    </Modal>
  );
}
