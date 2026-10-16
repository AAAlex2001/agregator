import { ChatPersonIcon } from "@/shared/ui/icons";
import { UserAvatar } from "@/shared/ui/user-avatar";
import styles from "./style.module.scss";

/** Фото участника переписки и подпись для скринридера. */
interface ChatAvatarProps {
  src: string | null;
  alt: string;
}

/** Круглое фото участника; без фото показывает силуэт. */
export function ChatAvatar({ src, alt }: ChatAvatarProps) {
  return (
    <UserAvatar
      src={src}
      alt={alt}
      className={styles.avatar}
      fallback={<ChatPersonIcon className={styles.fallback} />}
    />
  );
}
