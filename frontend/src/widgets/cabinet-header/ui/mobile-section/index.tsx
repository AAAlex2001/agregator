import cn from "classnames";
import Link from "next/link";
import { ChevronIcon, TechExpertLogoIcon } from "@/shared/ui/icons";
import type { HeaderNavigationSection } from "../../model/types";
import { MobileItem } from "../mobile-item";
import { MobileRegions } from "../mobile-regions";
import styles from "./style.module.scss";

/** Раздел мобильного меню и управление его раскрытием. */
interface MobileSectionProps {
  section: HeaderNavigationSection;
  isOpen: boolean;
  onToggle: (key: string) => void;
  onNavigate: () => void;
}

/** Показывает ссылку раздела либо его раскрываемый список сервисов. */
export function MobileSection({
  section,
  isOpen,
  onToggle,
  onNavigate,
}: MobileSectionProps) {
  /** Передаёт родительскому меню выбранный раздел. */
  function toggleSection() {
    onToggle(section.key);
  }

  return (
    <div className={styles.group}>
      {section.href ? (
        <Link
          href={section.href}
          className={cn(styles.groupHead, styles.logoHead)}
          aria-label={section.label}
          onClick={onNavigate}
        >
          {section.logo ? (
            <TechExpertLogoIcon
              title={section.label}
              width={160}
              height={38}
            />
          ) : (
            section.label
          )}
        </Link>
      ) : (
        <button
          type="button"
          className={cn(
            styles.groupHead,
            {
              [styles.gold]: section.color === "gold",
            },
            isOpen && cn(styles.groupOpen, styles[section.color]),
          )}
          onClick={toggleSection}
          aria-expanded={isOpen}
        >
          {section.label}
          <ChevronIcon
            className={styles.chevron}
            color="currentColor"
          />
        </button>
      )}
      {isOpen && (
        <div className={styles.groupBody}>
          {section.items?.map((item) =>
            item.regions ? (
              <MobileRegions
                key={item.label}
                item={item}
                onNavigate={onNavigate}
              />
            ) : (
              <MobileItem
                key={item.label}
                item={item}
                onNavigate={onNavigate}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}
