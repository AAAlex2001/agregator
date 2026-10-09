"use client";

import { CHANGE_REPORT_STATUS_LABELS } from "@/entities/change-report";
import { ChangeReportsTable, useChangeReports } from "@/features/change-reports-admin";
import { withAllOption } from "@/shared/lib/options";
import { countLabel } from "@/shared/lib/text";
import Loader from "@/shared/ui/loader";
import LoadingArea from "@/shared/ui/loading-area";
import Message from "@/shared/ui/message";
import Page from "@/shared/ui/page";
import PageHeader from "@/shared/ui/page-header";
import Select from "@/shared/ui/select";
import Toolbar from "@/shared/ui/toolbar";

const STATUS_OPTIONS = withAllOption(CHANGE_REPORT_STATUS_LABELS, "Все статусы");

/** Сигналы «Сообщить об изменении» по разъяснениям. */
const AdminChangeReports = () => {
  const { state, changeFilter, setStatus } = useChangeReports();
  const { items } = state;

  return (
    <Page>
      <PageHeader
        title="Сообщения об изменениях"
        description="Посетители сообщают, что разъяснение устарело или в нём ошибка"
      />

      <Toolbar aside={items && countLabel(items.length, ["сообщение", "сообщения", "сообщений"])}>
        <Select ariaLabel="Статус" options={STATUS_OPTIONS} value={state.filter} onChange={changeFilter} />
      </Toolbar>

      {state.failed && <Message tone="error">Не удалось загрузить сообщения.</Message>}

      {!items && state.loading && <Loader size="lg" />}

      {items && (
        <LoadingArea loading={state.loading}>
          {items.length === 0 ? (
            <Message>Сообщений пока нет.</Message>
          ) : (
            <ChangeReportsTable reports={items} pendingId={state.pendingId} onSetStatus={setStatus} />
          )}
        </LoadingArea>
      )}
    </Page>
  );
};

export default AdminChangeReports;
