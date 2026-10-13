import type { PostMedia } from "../model/types";
import { PostGallery } from "./PostGallery";
import s from "./post.module.scss";

interface PostContentProps {
  html: string;
  media: PostMedia[];
}

/** Текст, очищенный сервером, фотографии и видео. */
export function PostContent({ html, media }: PostContentProps) {
  const photos = media
    .filter((item) => item.kind === "photo")
    .map((item) => item.url);
  const videos = media.filter((item) => item.kind === "video");

  return (
    <>
      {html && (
        <div
          className={s.text}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
      {photos.length > 0 && <PostGallery photos={photos} />}
      {videos.map((item) => (
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
