import type { RtnRegulationLink } from "../model/clarification";
import s from "./RtnRegulations.module.scss";

interface RtnRegulationsProps {
  links: RtnRegulationLink[];
}

/** Нормативные документы, на которые ссылается разъяснение. */
export function RtnRegulations({ links }: RtnRegulationsProps) {
  return (
    <ul className={s.list}>
      {links.map((link) => (
        <li key={link.url}>
          <a href={link.url} target="_blank" rel="noreferrer">
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
