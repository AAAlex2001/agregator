"use client";

import cn from "classnames";
import { useState } from "react";
import { useTicketList } from "@/entities/ticket";
import type { Ticket } from "@/entities/ticket";
import { CreateTicketForm } from "@/features/create-ticket";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { TabSupportIcon } from "@/shared/ui/icons";
import { TicketChat } from "../ticket-chat";
import { TicketList } from "../ticket-list";
import { TicketListSkeleton } from "../ticket-list-skeleton";
import styles from "./style.module.scss";

/** Подсказка в центре страницы, пока обращение не выбрано. */
const EMPTY_PANE_HINT =
  "Здесь появится переписка с поддержкой. Выберите обращение в списке или создайте новое.";

/** Что открыто в центре страницы: подсказка, новое обращение или переписка. */
type SupportPane =
  | { kind: "empty" }
  | { kind: "create" }
  | { kind: "ticket"; id: number };

/** Поддержка: список обращений сбоку, переписка или форма нового обращения в центре. */
export function SupportCenter() {
  const { state, loadMore, markRead, upsertTicket } = useTicketList();
  const [pane, setPane] = useState<SupportPane>({ kind: "empty" });
  const selectedId = pane.kind === "ticket" ? pane.id : null;

  /** Открывает форму нового обращения. */
  function showCreate() {
    setPane({ kind: "create" });
  }

  /** Возвращает к списку обращений. */
  function showList() {
    setPane({ kind: "empty" });
  }

  /** Открывает переписку и снимает отметку непрочитанного. */
  function openTicket(id: number) {
    markRead(id);
    setPane({ kind: "ticket", id });
  }

  /** Добавляет созданное обращение в список и открывает его переписку. */
  function openCreated(ticket: Ticket) {
    upsertTicket(ticket);
    setPane({ kind: "ticket", id: ticket.id });
  }

  return (
    <div className={styles.body}>
      <div
        className={cn(styles.contentPane, {
          [styles.paneHiddenMobile]: pane.kind === "empty",
        })}
      >
        {pane.kind === "empty" && (
          <EmptyState
            icon={<TabSupportIcon />}
            title="Выберите обращение"
            subtitle={EMPTY_PANE_HINT}
            actionLabel="Создать обращение"
            onAction={showCreate}
          />
        )}
        {pane.kind === "create" && (
          <CreateTicketForm
            onCancel={showList}
            onCreated={openCreated}
          />
        )}
        {pane.kind === "ticket" && (
          <>
            <div className={styles.detailActions}>
              <Button
                variant="outlineOrange"
                size="sm"
                onClick={showCreate}
              >
                Создать обращение
              </Button>
            </div>
            <TicketChat
              key={pane.id}
              ticketId={pane.id}
              onBack={showList}
              onReplied={upsertTicket}
            />
          </>
        )}
      </div>

      <div
        className={cn(styles.sidebarPane, {
          [styles.paneHiddenMobile]: pane.kind !== "empty",
        })}
      >
        <div className={styles.mobileCreate}>
          <Button onClick={showCreate}>Создать обращение</Button>
        </div>
        {state.isLoading ? (
          <TicketListSkeleton />
        ) : (
          <TicketList
            tickets={state.tickets}
            selectedId={selectedId}
            error={state.error}
            hasMore={state.hasMore}
            isLoadingMore={state.isLoadingMore}
            onSelect={openTicket}
            onLoadMore={loadMore}
          />
        )}
      </div>
    </div>
  );
}
