"use client";

import cn from "classnames";
import { ChevronIcon, TechExpertLogoIcon } from "@/shared/ui/icons";
import { GUEST_CAPABILITIES } from "../../config/navigation";
import styles from "./style.module.scss";

/** Состояние списка сервисов, которое сохраняется при закрытии меню бургером. */
interface MobileCapabilitiesProps {
  isOpen: boolean;
  onToggle: () => void;
}

/** Раскрывает список сервисов в мобильном меню гостя. */
export function MobileCapabilities({ isOpen, onToggle }: MobileCapabilitiesProps) {

  return (
    <div className={styles.capabilities}>
      <button
        type="button"
        className={styles.capabilitiesToggle}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span>
          <span className={styles.capabilitiesTitle}>Возможности платформы</span>
          <span className={styles.capabilitiesHint}>Сервисы и полезные материалы</span>
        </span>
        <ChevronIcon
          className={cn(styles.capabilitiesChevron, {
            [styles.capabilitiesChevronOpen]: isOpen,
          })}
          color="currentColor"
        />
      </button>

      {isOpen && (
        <div className={styles.capabilitiesList}>
          {GUEST_CAPABILITIES.map((capability) => (
            <div
              key={capability.id}
              className={cn(styles.capabilityPlate, styles[capability.color])}
              aria-label={`${capability.label}. Доступно после регистрации`}
            >
              <span className={styles.capabilityLabel}>
                {capability.logo ? (
                  <TechExpertLogoIcon title={capability.label} />
                ) : (
                  capability.label
                )}
              </span>
              <span className={styles.lockedBadge}>после регистрации</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
