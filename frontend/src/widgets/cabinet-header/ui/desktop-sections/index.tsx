import type { ChatUnreadCounts } from "@/entities/chat";
import type { HeaderNavigationSection } from "../../model/types";
import { DesktopSection } from "../desktop-section";
import styles from "./style.module.scss";

/** Доступные разделы и счётчики непрочитанных. */
interface DesktopSectionsProps {
  sections: HeaderNavigationSection[];
  badges: ChatUnreadCounts;
}

/** Располагает разделы в строку и выравнивает последние два меню вправо. */
export function DesktopSections({ sections, badges }: DesktopSectionsProps) {
  if (sections.length === 0) {
    return null;
  }

  return (
    <div className={styles.plates}>
      {sections.map((section, index) => (
        <DesktopSection
          key={section.key}
          section={section}
          align={index >= sections.length - 2 ? "right" : "left"}
          badges={badges}
        />
      ))}
    </div>
  );
}
