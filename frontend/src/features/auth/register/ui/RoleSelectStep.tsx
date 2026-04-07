import Image from "next/image";
import { Button } from "@/shared/ui";
import { ChevronIcon, BulletIcon } from "@/shared/ui/icons";
import type { Role } from "../model/types";

interface RoleSelectStepProps {
  roles: Role[];
  openedCardId: number | null;
  onToggleCard: (id: number) => void;
  onSelectRole: (id: number) => void;
  styles: Record<string, string>;
}

export function RoleSelectStep({ roles, openedCardId, onToggleCard, onSelectRole, styles }: RoleSelectStepProps) {
  return (
    <div className={styles.stepContent} key="step1">
      <div className={styles.rolesContainer}>
        {roles.map((role) => {
          const isOpen = openedCardId === role.id;
          return (
            <div
              key={role.id}
              className={`${styles.roleCard} ${isOpen ? styles.roleCardOpen : ""}`}
              onClick={() => onToggleCard(role.id)}
            >
              {role.photo && (
                <div className={`${styles.roleImage} ${isOpen ? styles.visible : ""}`}>
                  <Image src={role.photo} alt={role.title} fill style={{ objectFit: "cover" }} />
                </div>
              )}
              <div className={styles.roleContent}>
                <div className={styles.roleHeader}>
                  <div className={styles.roleIcon}>{role.icon}</div>
                  <h3 className={styles.roleTitle}>{role.title}</h3>
                  <ChevronIcon className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`} color="#FFB800" />
                </div>
                <div className={`${styles.roleDescriptionWrapper} ${isOpen ? styles.roleDescriptionOpen : ""}`}>
                  <div className={styles.roleDescriptionInner}>
                    <h4 className={styles.expandedTitle}>{role.expandedTitle}</h4>
                    <ul className={styles.descriptionList}>
                      {role.description.map((item, index) => (
                        <li key={index} className={styles.descriptionItem}>
                          <span className={styles.bullet}><BulletIcon /></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant="outlineOrange"
                      size="md"
                      fullWidth
                      className={styles.selectButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRole(role.id);
                      }}
                    >
                      Выбрать
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
