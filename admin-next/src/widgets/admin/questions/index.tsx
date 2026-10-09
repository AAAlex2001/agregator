"use client";

import { QUESTION_STATUS_LABELS } from "@/entities/question";
import { DismissModal, QuestionsTable, useQuestions } from "@/features/questions-admin";
import { withAllOption } from "@/shared/lib/options";
import { countLabel } from "@/shared/lib/text";
import ConfirmModal from "@/shared/ui/confirm-modal";
import Loader from "@/shared/ui/loader";
import LoadingArea from "@/shared/ui/loading-area";
import Message from "@/shared/ui/message";
import Page from "@/shared/ui/page";
import PageHeader from "@/shared/ui/page-header";
import Select from "@/shared/ui/select";
import Toolbar from "@/shared/ui/toolbar";

const STATUS_OPTIONS = withAllOption(QUESTION_STATUS_LABELS, "Все статусы");

/** Очередь вопросов «Не нашли ответ?» с модерацией. */
const AdminQuestions = () => {
  const questions = useQuestions();
  const { state } = questions;
  const { items } = state;

  return (
    <Page>
      <PageHeader title="Вопросы посетителей" description="Форма «Не нашли ответ?» в разделе «Ростехнадзор отвечает»" />

      <Toolbar aside={items && countLabel(items.length, ["вопрос", "вопроса", "вопросов"])}>
        <Select ariaLabel="Статус" options={STATUS_OPTIONS} value={state.filter} onChange={questions.changeFilter} />
      </Toolbar>

      {state.failed && <Message tone="error">Не удалось загрузить вопросы.</Message>}

      {!items && state.loading && <Loader size="lg" />}

      {items && (
        <LoadingArea loading={state.loading}>
          {items.length === 0 ? (
            <Message>Вопросов пока нет.</Message>
          ) : (
            <QuestionsTable
              questions={items}
              pendingId={state.pendingId}
              onTakeInReview={questions.takeInReview}
              onDismiss={questions.openDismiss}
              onRemove={questions.askRemove}
            />
          )}
        </LoadingArea>
      )}

      <DismissModal
        open={state.dismissing !== null}
        reason={state.dismissReason}
        pending={state.pendingId !== null}
        onChange={questions.changeDismissReason}
        onConfirm={questions.dismiss}
        onClose={questions.closeDismiss}
      />

      <ConfirmModal
        open={state.removing !== null}
        title="Удалить вопрос?"
        text="Вопрос исчезнет из ленты вместе с ответами сообщества и подписками на ответ."
        confirmLabel="Удалить"
        pending={state.pendingId !== null}
        onConfirm={questions.remove}
        onCancel={questions.cancelRemove}
      />
    </Page>
  );
};

export default AdminQuestions;
