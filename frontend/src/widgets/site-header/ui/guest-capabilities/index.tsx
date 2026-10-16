import cn from "classnames";
import { ChevronIcon, TechExpertLogoIcon } from "@/shared/ui/icons";
import { Tooltip } from "@/shared/ui/tooltip";
import { GUEST_CAPABILITIES } from "../../config/navigation";
import styles from "./style.module.scss";

/** Показывает сервисы платформы, которые открываются после регистрации. */
export function GuestCapabilities() {
  return (
    <div className={cn(styles.plates, styles.platesCompact)}>
      {GUEST_CAPABILITIES.map((capability) => (
        <Tooltip
          key={capability.id}
          message="Доступно после регистрации"
          ariaLabel={`${capability.label}. Доступно после регистрации`}
          side="bottom"
        >
          <span
            className={cn(
              styles.plateWrap,
              styles[capability.color],
              styles.plateWrapLocked,
            )}
          >
            <button
              type="button"
              className={cn(styles.plate, {
                [styles.plateLogo]: capability.logo,
              })}
              aria-disabled="true"
            >
              {capability.logo ? (
                <TechExpertLogoIcon title={capability.label} />
              ) : (
                <>
                  {capability.id === "license" ? (
                    <span className={cn(styles.plateLabel, styles.plateLabelMultiline)}>
                      <span>Держатели</span>
                      <span>разрешительных документов</span>
                    </span>
                  ) : (
                    <span className={styles.plateLabel}>{capability.label}</span>
                  )}
                  {capability.hasSubmenu && (
                    <ChevronIcon
                      className={styles.chevron}
                      color="currentColor"
                    />
                  )}
                </>
              )}
            </button>
          </span>
        </Tooltip>
      ))}
    </div>
  );
}
