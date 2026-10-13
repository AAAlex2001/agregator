"use client";

import { REPORT_STATUSES, ReportCard } from "@/entities/posts";
import { ReportActions, useReportsList } from "@/features/posts-admin";
import { POSTS_PATH } from "@/shared/lib/admin-paths";
import Button from "@/shared/ui/button";
import Chip from "@/shared/ui/chip";
import Loader from "@/shared/ui/loader";
import Message from "@/shared/ui/message";
import Page from "@/shared/ui/page";
import PageHeader from "@/shared/ui/page-header";
import Pagination from "@/shared/ui/pagination";
import Toolbar from "@/shared/ui/toolbar";
import styles from "./style.module.scss";

/** Очередь жалоб на публикации и комментарии, включая рассмотренные. */
export default function AdminPostReports() {
  const list = useReportsList();

  return (
    <Page>
      <PageHeader
        title="Жалобы на публикации"
        description="Проверка публикаций и комментариев по обращениям пользователей"
        backHref={POSTS_PATH}
      />

      <Toolbar aside={list.list && `Всего: ${list.list.total}`}>
        {REPORT_STATUSES.map((status) => (
          <Chip
            key={status.value}
            active={list.status === status.value}
            onClick={() => list.changeStatus(status.value)}
          >
            {status.label}
          </Chip>
        ))}
      </Toolbar>

      {list.error && (
        <div role="alert">
          <Message tone="error">{list.error}</Message>
          <Button variant="outline" onClick={list.reload}>Повторить</Button>
        </div>
      )}
      {list.loading && <Loader size="lg" />}
      {list.list?.items.length === 0 && <Message>Жалоб в этом разделе нет.</Message>}

      <div className={styles.list}>
        {list.list?.items.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            actions={report.status === "open" && <ReportActions report={report} onDone={list.reload} />}
          />
        ))}
      </div>

      <Pagination page={list.page} pages={list.pages} disabled={list.loading} onChange={list.openPage} />
    </Page>
  );
}
