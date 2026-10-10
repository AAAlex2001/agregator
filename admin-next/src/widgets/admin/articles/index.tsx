"use client";

import { ARTICLE_KIND_LABELS, ARTICLE_STATUS_LABELS, ArticlesTable } from "@/entities/article";
import { useArticlesList } from "@/features/articles-admin";
import { NEW_ARTICLE_PATH } from "@/shared/lib/admin-paths";
import { withAllOption } from "@/shared/lib/options";
import { countLabel } from "@/shared/lib/text";
import Button from "@/shared/ui/button";
import Checkbox from "@/shared/ui/checkbox";
import { PlusIcon } from "@/shared/ui/icons";
import Loader from "@/shared/ui/loader";
import LoadingArea from "@/shared/ui/loading-area";
import Message from "@/shared/ui/message";
import Page from "@/shared/ui/page";
import PageHeader from "@/shared/ui/page-header";
import Pagination from "@/shared/ui/pagination";
import SearchForm from "@/shared/ui/search-form";
import Select from "@/shared/ui/select";
import Toolbar from "@/shared/ui/toolbar";

const KIND_OPTIONS = withAllOption(ARTICLE_KIND_LABELS, "Все типы");
const STATUS_OPTIONS = withAllOption(ARTICLE_STATUS_LABELS, "Все статусы");
const ORDER_OPTIONS = [
  { value: "", label: "Недавно изменённые" },
  { value: "desc", label: "Больше просмотров" },
  { value: "asc", label: "Меньше просмотров" },
];

/** Страница статей: поиск, фильтры по типу, статусу и обсуждениям, порядок по просмотрам и кнопка добавления. */
const AdminArticles = () => {
  const { state, pages, changeSearch, changeFilters, submitSearch, openPage } = useArticlesList();
  const { list, filters } = state;

  return (
    <Page>
      <PageHeader
        title="Статьи"
        description="Новости и блог площадки"
        action={
          <Button href={NEW_ARTICLE_PATH}>
            <PlusIcon />
            Новая статья
          </Button>
        }
      />

      <Toolbar aside={list && countLabel(list.total, ["статья", "статьи", "статей"])}>
        <SearchForm
          ariaLabel="Поиск статьи"
          placeholder="Заголовок или slug"
          value={state.search}
          onChange={changeSearch}
          onSubmit={submitSearch}
        />

        <Select
          ariaLabel="Тип"
          options={KIND_OPTIONS}
          value={filters.kind}
          onChange={(kind) => changeFilters({ ...filters, kind })}
        />
        <Select
          ariaLabel="Статус"
          options={STATUS_OPTIONS}
          value={filters.status}
          onChange={(status) => changeFilters({ ...filters, status })}
        />
        <Select
          ariaLabel="Порядок"
          options={ORDER_OPTIONS}
          value={filters.views}
          onChange={(views) => changeFilters({ ...filters, views })}
        />
        <Checkbox
          checked={filters.withComments}
          onChange={(withComments) => changeFilters({ ...filters, withComments })}
        >
          С обсуждением
        </Checkbox>
      </Toolbar>

      {state.failed && <Message tone="error">Не удалось загрузить статьи.</Message>}

      {!list && state.loading && <Loader size="lg" />}

      {list && (
        <LoadingArea loading={state.loading}>
          {list.items.length === 0 ? <Message>Статей не найдено.</Message> : <ArticlesTable articles={list.items} />}
          <Pagination page={state.page} pages={pages} disabled={state.loading} onChange={openPage} />
        </LoadingArea>
      )}
    </Page>
  );
};

export default AdminArticles;
