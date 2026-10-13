import Image from "next/image";
import type { OriginalPost } from "../../model/types";
import { mediaUrl } from "../../lib/media-url";
import styles from "./style.module.scss";

type PostContentProps = {
  post: OriginalPost;
};

/** Текст публикации, очищенный сервером, фото и видео. */
export default function PostContent({ post }: PostContentProps) {
  return (
    <div className={styles.content}>
      {post.html && <div className={styles.text} dangerouslySetInnerHTML={{ __html: post.html }} />}

      {post.media.length > 0 && (
        <div className={styles.media}>
          {post.media.map((file) =>
            file.kind === "video" ? (
              <video key={file.id} controls preload="metadata" src={mediaUrl(file.url)} />
            ) : (
              <a key={file.id} href={mediaUrl(file.url)} target="_blank" rel="noopener noreferrer">
                <Image src={mediaUrl(file.url)} alt="Фото публикации" width={240} height={180} unoptimized />
              </a>
            ),
          )}
        </div>
      )}
    </div>
  );
}
