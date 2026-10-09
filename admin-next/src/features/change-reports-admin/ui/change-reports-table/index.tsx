import cn from "classnames";
import {
  CHANGE_REPORT_STATUS_LABELS,
  CHANGE_REPORT_STATUS_TONES,
  type ChangeReport,
  type ChangeReportStatus,
} from "@/entities/change-report";
import { rtnPath } from "@/shared/lib/admin-paths";
import { formatDateTime } from "@/shared/lib/date";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import List from "@/shared/ui/list";
import ListRow from "@/shared/ui/list-row";
import styles from "./style.module.scss";

type ChangeReportsTableProps = {
  reports: ChangeReport[];
  pendingId: number | null;
  onSetStatus: (report: ChangeReport, status: ChangeReportStatus) => void;
};

/** Список сообщений об изменениях со ссылкой на разъяснение и кнопками статуса. */
const ChangeReportsTable = ({ reports, pendingId, onSetStatus }: ChangeReportsTableProps) => (
  <List>
    {reports.map((report) => (
      <ListRow key={report.id} className={cn(styles.row, pendingId === report.id && styles.pending)}>
        <div className={styles.head}>
          <span className={styles.meta}>
            #{report.id} · {formatDateTime(report.created_at)} ·{" "}
            <a className={styles.link} href={rtnPath(report.clarification_id)}>
              разъяснение #{report.clarification_id}
            </a>
          </span>
          <Badge tone={CHANGE_REPORT_STATUS_TONES[report.status]}>{CHANGE_REPORT_STATUS_LABELS[report.status]}</Badge>
        </div>

        <p className={styles.text}>{report.description}</p>

        {report.status !== "APPLIED" && (
          <div className={styles.actions}>
            {report.status === "NEW" && (
              <Button variant="outline" size="sm" onClick={() => onSetStatus(report, "REVIEWED")}>
                Рассмотрено
              </Button>
            )}
            <Button size="sm" onClick={() => onSetStatus(report, "APPLIED")}>
              Применено
            </Button>
          </div>
        )}
      </ListRow>
    ))}
  </List>
);

export default ChangeReportsTable;
