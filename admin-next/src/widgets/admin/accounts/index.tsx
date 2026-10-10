"use client";

import { ACCOUNT_ROLE_LABELS, AccountsTable } from "@/entities/account";
import { useAccountsList } from "@/features/accounts-admin";
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

const ROLE_OPTIONS = withAllOption(ACCOUNT_ROLE_LABELS, "Все роли");

/** Страница учётных записей: заказчики, исполнители и держатели разрешительных документов. */
const AdminAccounts = () => {
  const { state, pages, changeSearch, changeFilters, submitSearch, openPage } = useAccountsList();
  const { list, filters } = state;

  return (
    <Page>
      <PageHeader title="Учётные записи" description="Заказчики, исполнители и держатели разрешительных документов" />

      <Toolbar aside={list && countLabel(list.total, ["запись", "записи", "записей"])}>
        <SearchForm
          ariaLabel="Поиск учётной записи"
          placeholder="Имя, email, телефон или ИНН"
          value={state.search}
          onChange={changeSearch}
          onSubmit={submitSearch}
        />
        <Select
          ariaLabel="Роль"
          options={ROLE_OPTIONS}
          value={filters.role}
          onChange={(role) => changeFilters({ ...filters, role })}
        />
      </Toolbar>

      {state.failed && <Message tone="error">Не удалось загрузить учётные записи.</Message>}

      {!list && state.loading && <Loader size="lg" />}

      {list && (
        <LoadingArea loading={state.loading}>
          {list.items.length === 0 ? <Message>Учётных записей не найдено.</Message> : <AccountsTable accounts={list.items} />}
          <Pagination page={state.page} pages={pages} disabled={state.loading} onChange={openPage} />
        </LoadingArea>
      )}
    </Page>
  );
};

export default AdminAccounts;
