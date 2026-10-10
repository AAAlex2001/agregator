"use client";

import { DIRECTION_LABELS } from "@/entities/direction";
import { ORDER_STATUS_LABELS, OrdersTable } from "@/entities/order";
import { useOrdersList } from "@/features/orders-admin";
import { withAllOption } from "@/shared/lib/options";
import { countLabel } from "@/shared/lib/text";
import Loader from "@/shared/ui/loader";
import LoadingArea from "@/shared/ui/loading-area";
import Message from "@/shared/ui/message";
import Page from "@/shared/ui/page";
import PageHeader from "@/shared/ui/page-header";
import Pagination from "@/shared/ui/pagination";
import SearchForm from "@/shared/ui/search-form";
import Select from "@/shared/ui/select";
import Toolbar from "@/shared/ui/toolbar";

const STATUS_OPTIONS = withAllOption(ORDER_STATUS_LABELS, "Все статусы");
const DIRECTION_OPTIONS = withAllOption(DIRECTION_LABELS, "Все направления");

/** Страница заказов: поиск, фильтры по статусу и направлению, список и листание. */
const AdminOrders = () => {
  const { state, pages, changeSearch, changeFilters, submitSearch, openPage } = useOrdersList();
  const { list, filters } = state;

  return (
    <Page>
      <PageHeader title="Заказы" description="Заявки заказчиков на площадке" />

      <Toolbar aside={list && countLabel(list.total, ["заказ", "заказа", "заказов"])}>
        <SearchForm
          ariaLabel="Поиск заказа"
          placeholder="Название или компания"
          value={state.search}
          onChange={changeSearch}
          onSubmit={submitSearch}
        />
        <Select
          ariaLabel="Статус"
          options={STATUS_OPTIONS}
          value={filters.status}
          onChange={(status) => changeFilters({ ...filters, status })}
        />
        <Select
          ariaLabel="Направление"
          options={DIRECTION_OPTIONS}
          value={filters.workType}
          onChange={(workType) => changeFilters({ ...filters, workType })}
        />
      </Toolbar>

      {state.failed && <Message tone="error">Не удалось загрузить заказы.</Message>}

      {!list && state.loading && <Loader size="lg" />}

      {list && (
        <LoadingArea loading={state.loading}>
          {list.items.length === 0 ? <Message>Заказов не найдено.</Message> : <OrdersTable orders={list.items} />}
          <Pagination page={state.page} pages={pages} disabled={state.loading} onChange={openPage} />
        </LoadingArea>
      )}
    </Page>
  );
};

export default AdminOrders;
