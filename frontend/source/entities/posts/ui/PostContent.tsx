import type { PostMedia } from "../model/types";
import { PostGallery } from "./PostGallery";
import s from "./post.module.scss";

/** Показывает очищенный сервером текст, фотографии и видео. */
export function PostContent({ html, media }: { html: string; media: PostMedia[] }) {
  const photos = media.filter((item) => item.kind === "photo").map((item) => item.url);
  return (
    <>
      {html && (
        <div
          className={s.text}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
      {photos.length > 0 && <PostGallery photos={photos} />}
      {media
        .filter((item) => item.kind === "video")
        .map((item) => (
          <video
            key={item.id}
            className={s.video}
            src={item.url}
            controls
            preload="metadata"
          />
        ))}
    </>
  );
}
