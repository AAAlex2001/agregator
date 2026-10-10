"use client";

import { LEAD_STATUS_LABELS } from "@/entities/lead";
import { LeadsTable, useLeads } from "@/features/leads-admin";
import { withAllOption } from "@/shared/lib/options";
import { countLabel } from "@/shared/lib/text";
import ConfirmModal from "@/shared/ui/confirm-modal";
import Loader from "@/shared/ui/loader";
import LoadingArea from "@/shared/ui/loading-area";
import Message from "@/shared/ui/message";
import Page from "@/shared/ui/page";
import PageHeader from "@/shared/ui/page-header";
import Pagination from "@/shared/ui/pagination";
import Select from "@/shared/ui/select";
import Toolbar from "@/shared/ui/toolbar";

const STATUS_OPTIONS = withAllOption(LEAD_STATUS_LABELS, "Все статусы");

/** Заявки с сайта: форма «Оставьте заявку» на страницах и в статьях. */
const AdminLeads = () => {
  const leads = useLeads();
  const { state } = leads;
  const { list } = state;

  return (
    <Page>
      <PageHeader title="Заявки с сайта" description="Форма «Оставьте заявку — подберём исполнителя»" />

      <Toolbar aside={list && countLabel(list.total, ["заявка", "заявки", "заявок"])}>
        <Select ariaLabel="Статус" options={STATUS_OPTIONS} value={state.filter} onChange={leads.changeFilter} />
      </Toolbar>

      {state.failed && <Message tone="error">Не удалось загрузить заявки.</Message>}

      {!list && state.loading && <Loader size="lg" />}

      {list && (
        <LoadingArea loading={state.loading}>
          {list.items.length === 0 ? (
            <Message>Заявок пока нет.</Message>
          ) : (
            <LeadsTable
              leads={list.items}
              pendingId={state.pendingId}
              noteFor={state.noteFor}
              noteDraft={state.noteDraft}
              onSetStatus={leads.setStatus}
              onOpenNote={leads.openNote}
              onChangeNote={leads.changeNote}
              onSaveNote={leads.saveNote}
              onCloseNote={leads.closeNote}
              onRemove={leads.askRemove}
            />
          )}
          <Pagination page={state.page} pages={leads.pages} disabled={state.loading} onChange={leads.openPage} />
        </LoadingArea>
      )}

      <ConfirmModal
        open={state.removing !== null}
        title="Удалить заявку?"
        text={`Заявка от «${state.removing?.name ?? ""}» удалится без возможности восстановления.`}
        confirmLabel="Удалить"
        pending={state.pendingId !== null}
        onConfirm={leads.remove}
        onCancel={leads.cancelRemove}
      />
    </Page>
  );
};

export default AdminLeads;
