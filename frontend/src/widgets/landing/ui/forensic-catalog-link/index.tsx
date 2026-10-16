import { ArrowUpRightIcon } from "@/shared/ui/icons";
import type { ForensicCatalogItem } from "../../model/types";
import styles from "./style.module.scss";

/** Вид судебного исследования и его номер в выбранной группе. */
interface ForensicCatalogLinkProps {
  item: ForensicCatalogItem;
  index: number;
}

/** Открывает подробное описание судебного исследования на внешнем сайте. */
export function ForensicCatalogLink({ item, index }: ForensicCatalogLinkProps) {
  return (
    <li className={styles.gridItem}>
      <a
        className={styles.card}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className={styles.cardNum}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className={styles.cardLabel}>{item.label}</span>
        <ArrowUpRightIcon className={styles.cardArrow} />
      </a>
    </li>
  );
}
