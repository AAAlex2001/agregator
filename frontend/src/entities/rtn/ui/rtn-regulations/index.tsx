import type { RtnRegulationLink } from "../../model/types";
import styles from "./style.module.scss";

/** Нормативные документы, упомянутые в разъяснении. */
interface RtnRegulationsProps {
  links: RtnRegulationLink[];
}

/** Показывает ссылки на нормативные документы в отдельной вкладке. */
export function RtnRegulations({ links }: RtnRegulationsProps) {
  return (
    <ul className={styles.list}>
      {links.map((link) => (
        <li key={link.url}>
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
