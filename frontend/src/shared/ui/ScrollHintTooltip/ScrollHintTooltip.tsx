"use client";

import styles from "./scrollHintTooltip.module.scss";

interface ScrollHintTooltipProps {
  message: string;
  ariaLabel?: string;
}

export default function ScrollHintTooltip({
  message,
  ariaLabel = "Подсказка по прокрутке карточек",
}: ScrollHintTooltipProps) {
  return (
    <div className={styles.scrollHint}>
      <button type="button" className={styles.infoButton} aria-label={ariaLabel}>
        <span className={styles.infoLabel}>i</span>
      </button>
      <div className={styles.hintTooltip} role="tooltip">
        {message}
      </div>
    </div>
  );
}
