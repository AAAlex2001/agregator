import type { PostMedia } from "../../model/types";
import { PostGallery } from "../post-gallery";
import styles from "./style.module.scss";

/** Очищенный сервером текст и прикреплённые медиа публикации. */
interface PostContentProps {
  html: string;
  media: PostMedia[];
}

/** Показывает текст, затем фотографии и видео в прежнем порядке. */
export function PostContent({ html, media }: PostContentProps) {
  const photos = media
    .filter((item) => item.kind === "photo")
    .map((item) => item.url);
  const videos = media.filter((item) => item.kind === "video");

  return (
    <>
      {html && (
        <div
          className={styles.text}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
      {photos.length > 0 && <PostGallery photos={photos} />}
      {videos.map((item) => (
        <video
          key={item.id}
          className={styles.video}
          src={item.url}
          controls
          preload="metadata"
        />
      ))}
    </>
  );
}
