import Link from "next/link";
import type { ReactNode } from "react";
import { accountPath, postPath } from "@/shared/lib/admin-paths";
import { formatDateTime } from "@/shared/lib/date";
import Badge from "@/shared/ui/badge";
import type { PostReport } from "../../model/types";
import PostCard from "../post-card";
import styles from "./style.module.scss";

type ReportCardProps = {
  report: PostReport;
  actions?: ReactNode;
};

/** Жалоба с причиной, автором обращения и материалом для проверки. */
export default function ReportCard({ report, actions }: ReportCardProps) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div>
          <strong>Жалоба №{report.id}</strong>
          <p className={styles.meta}>
            <Link href={accountPath(report.reporter.id)}>
              {report.reporter.name || `Пользователь №${report.reporter.id}`}
            </Link>
            {" · "}{formatDateTime(report.created_at)}
          </p>
        </div>
        <Badge tone={report.status === "open" ? "warning" : "neutral"}>
          {report.status === "open" ? "Ждёт решения" : "Рассмотрена"}
        </Badge>
      </header>

      <p className={styles.reason}>{report.reason}</p>

      {report.post && <PostCard post={report.post} />}

      {report.comment && (
        <div className={styles.comment}>
          <p className={styles.meta}>
            Комментарий №{report.comment.id} · {" "}
            <Link href={accountPath(report.comment.author.id)}>
              {report.comment.author.name || `Пользователь №${report.comment.author.id}`}
            </Link>
          </p>
          <p className={styles.reason}>{report.comment.text}</p>
          <Link href={postPath(report.comment.post_id)}>Открыть публикацию</Link>
        </div>
      )}

      {!report.post && !report.comment && (
        <p className={styles.meta}>Материал уже удалён.</p>
      )}
      {actions}
    </article>
  );
}
