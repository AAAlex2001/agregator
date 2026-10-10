"use client";

import { ClarificationsTable, PUBLICATION_STATUS_LABELS } from "@/entities/clarification";
import { useClarificationsList } from "@/features/clarifications-admin";
import { NEW_RTN_PATH } from "@/shared/lib/admin-paths";
import { withAllOption } from "@/shared/lib/options";
import { countLabel } from "@/shared/lib/text";
import Button from "@/shared/ui/button";
import { PlusIcon } from "@/shared/ui/icons";
import Loader from "@/shared/ui/loader";
import LoadingArea from "@/shared/ui/loading-area";
import Message from "@/shared/ui/message";
import Page from "@/shared/ui/page";
import PageHeader from "@/shared/ui/page-header";
import Select from "@/shared/ui/select";
import Toolbar from "@/shared/ui/toolbar";

const PUBLICATION_OPTIONS = withAllOption(PUBLICATION_STATUS_LABELS, "Все");

/** Страница разъяснений «Ростехнадзор отвечает». */
const AdminClarifications = () => {
  const { state, changeFilter } = useClarificationsList();
  const { list } = state;

  return (
    <Page>
      <PageHeader
        title="Ростехнадзор отвечает"
        description="Официальные разъяснения, письма и ответы на обращения"
        action={
          <Button href={NEW_RTN_PATH}>
            <PlusIcon />
            Новое разъяснение
          </Button>
        }
      />

      <Toolbar aside={list && countLabel(list.total, ["разъяснение", "разъяснения", "разъяснений"])}>
        <Select ariaLabel="Публикация" options={PUBLICATION_OPTIONS} value={state.filter} onChange={changeFilter} />
      </Toolbar>

      {state.failed && <Message tone="error">Не удалось загрузить разъяснения.</Message>}

      {!list && state.loading && <Loader size="lg" />}

      {list && (
        <LoadingArea loading={state.loading}>
          {list.items.length === 0 ? (
            <Message>Разъяснений пока нет.</Message>
          ) : (
            <ClarificationsTable clarifications={list.items} />
          )}
        </LoadingArea>
      )}
    </Page>
  );
};

export default AdminClarifications;
