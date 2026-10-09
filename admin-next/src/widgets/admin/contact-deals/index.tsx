"use client";

import { DEAL_STATUS_LABELS } from "@/entities/contact-deal";
import { DealsTable, useDealsList } from "@/features/contact-deals-admin";
import { withAllOption } from "@/shared/lib/options";
import { countLabel } from "@/shared/lib/text";
import Loader from "@/shared/ui/loader";
import LoadingArea from "@/shared/ui/loading-area";
import Message from "@/shared/ui/message";
import Page from "@/shared/ui/page";
import PageHeader from "@/shared/ui/page-header";
import Select from "@/shared/ui/select";
import Toolbar from "@/shared/ui/toolbar";

const STATUS_OPTIONS = withAllOption(DEAL_STATUS_LABELS, "Все статусы");

/** Сделки по покупке контактов исполнителей. */
const AdminContactDeals = () => {
  const { state, changeFilter } = useDealsList();
  const { list } = state;

  return (
    <Page>
      <PageHeader
        title="Покупка контактов"
        description="Договоры между заказчиками и исполнителями: подписи, чеки и выдача контактов"
      />

      <Toolbar aside={list && countLabel(list.total, ["сделка", "сделки", "сделок"])}>
        <Select ariaLabel="Статус" options={STATUS_OPTIONS} value={state.filter} onChange={changeFilter} />
      </Toolbar>

      {state.failed && <Message tone="error">Не удалось загрузить сделки.</Message>}

      {!list && state.loading && <Loader size="lg" />}

      {list && (
        <LoadingArea loading={state.loading}>
          {list.items.length === 0 ? <Message>Сделок пока нет.</Message> : <DealsTable deals={list.items} />}
        </LoadingArea>
      )}
    </Page>
  );
};

export default AdminContactDeals;
