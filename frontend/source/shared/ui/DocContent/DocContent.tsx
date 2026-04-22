import Title from "@/source/shared/ui/Typography/Title";
import type { DocBlock, DocSection } from "./types";
import styles from "./DocContent.module.scss";

function BlockNode({ block }: { block: DocBlock }) {
  if (block.kind === "paragraph") {
    return <p className={styles.paragraph}>{block.text}</p>;
  }

  if (block.kind === "table") {
    return (
      <>
        <table className={styles.table}>
          <thead>
            <tr>
              {block.headers.map((h, i) => (
                <th key={i} className={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} className={styles.td}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.tableMobile}>
          {block.headers.map((h, ci) => {
            const vals = [...new Set(block.rows.map((r) => r[ci]))];
            return (
              <div key={ci}>
                <div className={styles.mHead}>{h}</div>
                {vals.map((v, vi) => (
                  <div key={vi} className={vi % 2 === 0 ? styles.mCellAlt : styles.mCell}>
                    {v}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </>
    );
  }

  if (block.kind === "row") {
    return (
      <div className={styles.row}>
        <span className={styles.num}>{block.num}</span>
        <p className={styles.rowText}>{block.text}</p>
      </div>
    );
  }

  if (block.kind === "bulletSection") {
    return (
      <div className={styles.row}>
        <span className={styles.num}>{block.num}</span>
        <div className={styles.bulletColumn}>
          <ul className={styles.bulletList}>
            {block.items.map((item, i) => (
              <li key={i} className={styles.bulletListItem}>
                <p className={styles.bulletItemText}>{item.text}</p>
                {item.subitems && item.subitems.length > 0 ? (
                  <ul className={styles.subBulletList}>
                    {item.subitems.map((line, j) => (
                      <li key={j} className={styles.subBulletListItem}>
                        <p className={styles.bulletItemText}>{line}</p>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  const groupClass = block.variant === "tight"
    ? `${styles.group} ${styles.groupTight}`
    : styles.group;

  return (
    <div className={groupClass}>
      {block.children.map((child, i) => (
        <BlockNode key={`${child.kind}-${i}`} block={child} />
      ))}
    </div>
  );
}

export type DocContentProps = {
  sections: DocSection[];
  className?: string;
};

export function DocContent({ sections, className }: DocContentProps) {
  return (
    <div className={className}>
      {sections.map((section) => (
        <section key={section.id} id={section.id} className={styles.section}>
          {section.title ? <Title as="h2" text={section.title} className={styles.sectionTitle} /> : null}
          <div className={styles.blocks}>
            {section.blocks.map((block, i) => (
              <BlockNode key={`${block.kind}-${i}`} block={block} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
