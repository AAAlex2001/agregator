import Link from "next/link";
import type { FooterLink } from "../../model/types";

/** Заголовок и ссылки одной колонки подвала. */
interface LinkGroupProps {
  title: string;
  links: FooterLink[];
}

/** Выводит навигационные ссылки с их исходными адресами. */
export function LinkGroup({ title, links }: LinkGroupProps) {
  return (
    <div>
      <h2>{title}</h2>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
