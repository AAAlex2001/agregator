"use client";

import { APPLICATION_STATUS_LABELS, APPLICATION_STATUSES } from "@/entities/commission-application";
import { ApplicationCard, useApplications } from "@/features/commission-admin";
import { SITE_URL } from "@/shared/api";
import Button from "@/shared/ui/button";
import Chip from "@/shared/ui/chip";
import Loader from "@/shared/ui/loader";
import Message from "@/shared/ui/message";
import Page from "@/shared/ui/page";
import PageHeader from "@/shared/ui/page-header";
import Pagination from "@/shared/ui/pagination";
import Toolbar from "@/shared/ui/toolbar";
import styles from "./style.module.scss";

/** Заявки кандидатов в эксперты: статусы, решение комиссии и письмо кандидату. */
const Commission = () => {
  const list = useApplications();

  return (
    <Page>
      <PageHeader
        title="Конкурсная комиссия"
        description="Заявки кандидатов в эксперты со страницы конкурсного отбора"
        action={
          <Button variant="outline" href={`${SITE_URL}/konkursnaya-komissiya`}>
            Страница на сайте
          </Button>
        }
      />

      <Toolbar aside={list.list && `Всего: ${list.list.total}`}>
        {APPLICATION_STATUSES.map((status) => (
          <Chip key={status} active={list.status === status} onClick={() => list.changeStatus(status)}>
            {APPLICATION_STATUS_LABELS[status]}
          </Chip>
        ))}
        <Chip active={list.status === ""} onClick={() => list.changeStatus("")}>
          Все
        </Chip>
      </Toolbar>

      {list.error && (
        <div role="alert">
          <Message tone="error">{list.error}</Message>
          <Button variant="outline" onClick={list.reload}>Повторить</Button>
        </div>
      )}
      {!list.list && !list.error && <Loader size="lg" />}
      {list.list?.items.length === 0 && <Message>Заявок нет.</Message>}

      <div className={styles.list}>
        {list.list?.items.map((application) => (
          <ApplicationCard
            key={`${application.id}-${application.status}`}
            application={application}
            onChange={list.replace}
            onDeleted={list.reload}
          />
        ))}
      </div>

      <Pagination page={list.page} pages={list.pages} disabled={!list.list} onChange={list.openPage} />
    </Page>
  );
};

export default Commission;
