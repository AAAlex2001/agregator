import { formatDate } from "@/shared/lib/date";
import Panel from "@/shared/ui/panel";
import type { DailyCount } from "../../model/types";
import styles from "./style.module.scss";

type DailyChartProps = {
  title: string;
  days: DailyCount[];
};

/** Столбики по дням за 30 дней. Высота — доля от самого активного дня, число дня — в подсказке. */
const DailyChart = ({ title, days }: DailyChartProps) => {
  const max = Math.max(1, ...days.map((day) => day.count));
  const total = days.reduce((sum, day) => sum + day.count, 0);

  return (
    <Panel title={title} action={<span className={styles.total}>{total} за 30 дней</span>}>
      <div className={styles.bars}>
        {days.map((day) => (
          <span
            key={day.date}
            className={styles.bar}
            style={{ height: `${Math.max(2, (day.count / max) * 100)}%` }}
            title={`${formatDate(day.date)}: ${day.count}`}
          />
        ))}
      </div>

      <div className={styles.axis}>
        <span>{formatDate(days[0]?.date)}</span>
        <span>{formatDate(days[days.length - 1]?.date)}</span>
      </div>
    </Panel>
  );
};

export default DailyChart;
