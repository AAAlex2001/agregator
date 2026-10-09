"use client";

import { ClarificationActions, ClarificationForm, useClarificationEditor } from "@/features/clarifications-admin";
import { SITE_URL } from "@/shared/api";
import { RTN_PATH } from "@/shared/lib/admin-paths";
import { formatDateTime } from "@/shared/lib/date";
import Button from "@/shared/ui/button";
import { ExternalLinkIcon } from "@/shared/ui/icons";
import Loader from "@/shared/ui/loader";
import Message from "@/shared/ui/message";
import Page from "@/shared/ui/page";
import PageHeader from "@/shared/ui/page-header";
import styles from "./style.module.scss";

type ClarificationEditorProps = {
  clarificationId: number | null;
  fromQuestionId?: number | null;
};

/** Подпись под заголовком: сведения о записи или подсказка для новой. */
const describe = (
  clarification: { id: number; views_count: number; updated_at: string } | null,
  fromQuestionId: number | null,
) => {
  if (clarification) {
    return `#${clarification.id} · ${clarification.views_count} просмотров · обновлено ${formatDateTime(clarification.updated_at)}`;
  }
  if (fromQuestionId) return `Ответ на вопрос посетителя #${fromQuestionId}: после сохранения вопрос станет обработанным`;

  return "Заполните поля и сохраните — разъяснение появится в списке";
};

/** Редактирование разъяснения, а без clarificationId — создание нового, при fromQuestionId — из вопроса посетителя. */
const ClarificationEditor = ({ clarificationId, fromQuestionId = null }: ClarificationEditorProps) => {
  const { state, change, toggleTag, toggleTaxonomy, save, remove, askRemove, cancelRemove } = useClarificationEditor(
    clarificationId,
    fromQuestionId,
  );
  const { clarification, taxonomy } = state;

  if (state.status === "failed") return <Message tone="error">Не удалось загрузить разъяснение.</Message>;
  if (state.status === "loading" || !taxonomy) return <Loader size="lg" />;

  return (
    <Page>
      <PageHeader
        backHref={RTN_PATH}
        title={clarification ? clarification.title || "Без заголовка" : "Новое разъяснение"}
        description={describe(clarification, fromQuestionId)}
        action={
          clarification && (
            <div className={styles.actions}>
              {clarification.publication_status === "PUBLISHED" && (
                <Button variant="ghost" href={`${SITE_URL}/rtn/${clarification.slug}`} target="_blank">
                  <ExternalLinkIcon />
                  На сайте
                </Button>
              )}
              <ClarificationActions
                title={clarification.title}
                confirming={state.confirming}
                pending={state.pending}
                onAskRemove={askRemove}
                onCancelRemove={cancelRemove}
                onRemove={remove}
              />
            </div>
          )
        }
      />

      <ClarificationForm
        fields={state.fields}
        tags={state.tags}
        taxonomy={taxonomy}
        pending={state.pending}
        isNew={!clarification}
        onChange={change}
        onToggleTag={toggleTag}
        onToggleTaxonomy={toggleTaxonomy}
        onSubmit={save}
      />
    </Page>
  );
};

export default ClarificationEditor;
