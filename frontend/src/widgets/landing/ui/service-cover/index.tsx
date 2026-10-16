import type { DirectionCode } from "@/entities/direction";
import { ScrollToRegistrationButton } from "../scroll-to-registration-button";
import styles from "./style.module.scss";

/** Видеоролик и пояснение на обложке страницы направления. */
interface ServiceCoverProps {
  direction: DirectionCode;
  video: string;
  claim: string;
}

/** Показывает обложку направления и переход к регистрации ниже на странице. */
export function ServiceCover({ direction, video, claim }: ServiceCoverProps) {
  return (
    <div
      className={styles.cover}
      data-direction={direction}
    >
      <div className={styles.coverImage}>
        <video
          className={styles.coverVideo}
          src={video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
      <p className={styles.coverClaim}>{claim}</p>
      <ScrollToRegistrationButton className={styles.coverButton} />
    </div>
  );
}
