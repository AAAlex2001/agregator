import type { BlitzTeamMember } from "@/entities/blitz-order";
import styles from "./style.module.scss";

/** Аудиторы группы. */
interface AuditTeamProps {
  team: BlitzTeamMember[];
}

/** Состав аудиторской группы: руководитель первым, у каждого — области аттестации. */
export function AuditTeam({ team }: AuditTeamProps) {
  return (
    <ul className={styles.list}>
      {team.map((member) => (
        <li
          key={member.id}
          className={styles.member}
        >
          <span className={styles.name}>
            {member.name}
            {member.lead && <span className={styles.lead}>Руководитель</span>}
          </span>
          {member.areas.length > 0 && (
            <span className={styles.areas}>{member.areas.join(", ")}</span>
          )}
        </li>
      ))}
    </ul>
  );
}