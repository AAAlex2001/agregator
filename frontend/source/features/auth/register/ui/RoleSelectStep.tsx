import Image from "next/image";
import Button from "@/source/shared/ui/Button";
import { ChevronIcon, BulletIcon } from "@/source/shared/ui/icons";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import type { Role } from "../model/types";
import s from "./RoleSelectStep.module.scss";

interface Props {
  roles: Role[];
  openedCardId: number | null;
  onToggleCard: (id: number) => void;
  onSelectRole: (id: number) => void;
}

export function RoleSelectStep({ roles, openedCardId, onToggleCard, onSelectRole }: Props) {
  return (
    <div className={s.stepContent}>
      <div className={s.rolesContainer}>
        {roles.map((role) => {
          const isOpen = openedCardId === role.id;
          return (
            <div
              key={role.id}
              className={`${s.roleCard} ${isOpen ? s.roleCardOpen : ""}`}
              onClick={() => onToggleCard(role.id)}
            >
              {role.photo && (
                <div className={`${s.roleImage} ${isOpen ? s.visible : ""}`}>
                  <Image src={role.photo} alt={role.title} fill style={{ objectFit: "cover" }} />
                </div>
              )}
              <div className={s.roleContent}>
                <div className={s.roleHeader}>
                  <div className={s.roleIcon}>{role.icon}</div>
                  <Title as="h3" text={role.title} className={s.roleTitle} />
                  <ChevronIcon className={`${s.chevron} ${isOpen ? s.chevronOpen : ""}`} color="#FFB800" />
                </div>
                <div className={`${s.roleDescriptionWrapper} ${isOpen ? s.roleDescriptionOpen : ""}`}>
                  <div className={s.roleDescriptionInner}>
                    <Subtitle text={role.expandedTitle} className={s.expandedTitle} />
                    <ul className={s.descriptionList}>
                      {role.description.map((item, i) => (
                        <li key={i} className={s.descriptionItem}>
                          <span className={s.bullet}><BulletIcon /></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant="outlineOrange"
                      size="md"
                      fullWidth
                      className={s.selectButton}
                      onClick={(e: React.MouseEvent) => { e.stopPropagation(); onSelectRole(role.id); }}
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
