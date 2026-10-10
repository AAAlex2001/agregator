import Panel from "@/shared/ui/panel";
import styles from "./style.module.scss";

type BreakdownListProps = {
  title: string;
  counts: Record<string, number>;
  labels: Record<string, string>;
};

/** Распределение по ролям или статусам: подпись, число и полоса доли от самой большой группы. */
const BreakdownList = ({ title, counts, labels }: BreakdownListProps) => {
  const rows = Object.entries(counts).sort((left, right) => right[1] - left[1]);
  const max = Math.max(1, ...rows.map((row) => row[1]));

  return (
    <Panel title={title}>
      <ul className={styles.list}>
        {rows.map(([key, count]) => (
          <li key={key} className={styles.row}>
            <span className={styles.line}>
              {labels[key] ?? key}
              <strong>{count}</strong>
            </span>
            <span className={styles.track}>
              <span className={styles.fill} style={{ width: `${(count / max) * 100}%` }} />
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
};

export default BreakdownList;
