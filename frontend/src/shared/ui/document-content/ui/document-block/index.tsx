import cn from "classnames";
import type { DocumentBlock } from "../../model/types";
import { DocumentList } from "../document-list";
import { DocumentTable } from "../document-table";
import styles from "./style.module.scss";

/** Один блок содержимого документа. */
interface DocumentBlockProps {
  block: DocumentBlock;
}

/** Выбирает разметку абзаца, пункта, списка, таблицы или вложенной группы. */
export function DocumentBlockContent({ block }: DocumentBlockProps) {
  if (block.kind === "paragraph") {
    return <p className={styles.paragraph}>{block.text}</p>;
  }

  if (block.kind === "row") {
    return (
      <div className={styles.row}>
        <span className={styles.num}>{block.num}</span>
        <p className={styles.rowText}>{block.text}</p>
      </div>
    );
  }

  if (block.kind === "table") {
    return <DocumentTable table={block} />;
  }

  if (block.kind === "bulletSection") {
    return (
      <DocumentList
        number={block.num}
        items={block.items}
      />
    );
  }

  return (
    <div
      className={cn(styles.group, {
        [styles.groupTight]: block.variant === "tight",
      })}
    >
      {block.children.map((child, index) => (
        <DocumentBlockContent
          key={`${child.kind}-${index}`}
          block={child}
        />
      ))}
    </div>
  );
}
