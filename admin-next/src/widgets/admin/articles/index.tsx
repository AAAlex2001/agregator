"use client";

import { ARTICLE_KIND_LABELS, ARTICLE_STATUS_LABELS } from "@/entities/article";
import { ArticlesTable, useArticlesList } from "@/features/articles-admin";
import { NEW_ARTICLE_PATH } from "@/shared/lib/admin-paths";
import { withAllOption } from "@/shared/lib/options";
import { countLabel } from "@/shared/lib/text";
import Button from "@/shared/ui/button";
import { PlusIcon, SearchIcon } from "@/shared/ui/icons";
import Input from "@/shared/ui/input";
import Loader from "@/shared/ui/loader";
import LoadingArea from "@/shared/ui/loading-area";
import Message from "@/shared/ui/message";
import Page from "@/shared/ui/page";
import PageHeader from "@/shared/ui/page-header";
import Pagination from "@/shared/ui/pagination";
import Select from "@/shared/ui/select";
import Toolbar from "@/shared/ui/toolbar";
import styles from "./style.module.scss";

const KIND_OPTIONS = withAllOption(ARTICLE_KIND_LABELS, "Все типы");
const STATUS_OPTIONS = withAllOption(ARTICLE_STATUS_LABELS, "Все статусы");

/** Страница статей: поиск, фильтры, список и кнопка добавления. */
const AdminArticles = () => {
  const { state, pages, changeSearch, changeFilter, submitSearch, openPage } = useArticlesList();
  const { list } = state;

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
        <form
          className={styles.search}
          onSubmit={(event) => {
            event.preventDefault();
            submitSearch();
          }}
        >
          <Input
            type="search"
            ariaLabel="Поиск статьи"
            placeholder="Заголовок или slug"
            icon={<SearchIcon />}
            value={state.search}
            onChange={changeSearch}
          />
          <Button type="submit" variant="outline">
            Найти
          </Button>
        </form>

        <Select ariaLabel="Тип" options={KIND_OPTIONS} value={state.filters.kind} onChange={(kind) => changeFilter({ kind })} />
        <Select
          ariaLabel="Статус"
          options={STATUS_OPTIONS}
          value={state.filters.status}
          onChange={(status) => changeFilter({ status })}
        />
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
