"use client";

import cn from "classnames";
import { useState } from "react";
import type { Ticket } from "@/source/entities/ticket";
import { CreateTicketForm } from "@/source/features/support/create-ticket";
import { TicketChat } from "@/source/features/support/ticket-chat";
import { TicketList, TicketListSkeleton, useTicketList } from "@/source/features/support/ticket-list";
import Button from "@/source/shared/ui/Button";
import { EmptyDetail } from "./EmptyDetail";
import s from "./SupportWidget.module.scss";

type Pane = { kind: "empty" } | { kind: "create" } | { kind: "ticket"; id: number };

/** Страница поддержки: список обращений сбоку, переписка или форма нового обращения в центре. */
export function SupportWidget() {
  const list = useTicketList();
  const [pane, setPane] = useState<Pane>({ kind: "empty" });
  const showCreate = () => setPane({ kind: "create" });
  const showList = () => setPane({ kind: "empty" });
  const openTicket = (id: number) => {
    list.markRead(id);
    setPane({ kind: "ticket", id });
  };
  const openCreated = (ticket: Ticket) => {
    list.upsert(ticket);
    setPane({ kind: "ticket", id: ticket.id });
  };

  return (
    <div className={s.body}>
      <div className={cn(s.contentPane, { [s.paneHiddenMobile]: pane.kind === "empty" })}>
        {pane.kind === "empty" && <EmptyDetail onCreate={showCreate} />}
        {pane.kind === "create" && <CreateTicketForm onCancel={showList} onCreated={openCreated} />}
        {pane.kind === "ticket" && (
          <>
            <div className={s.detailActions}>
              <Button variant="outlineOrange" size="sm" onClick={showCreate}>
                Создать обращение
              </Button>
            </div>
            <TicketChat key={pane.id} ticketId={pane.id} onBack={showList} onReplied={list.upsert} />
          </>
        )}
      </div>

      <div className={cn(s.sidebarPane, { [s.paneHiddenMobile]: pane.kind !== "empty" })}>
        <div className={s.mobileCreate}>
          <Button onClick={showCreate}>Создать обращение</Button>
        </div>
        {list.state.isLoading ? (
          <TicketListSkeleton />
        ) : (
          <TicketList
            tickets={list.state.tickets}
            selectedId={pane.kind === "ticket" ? pane.id : null}
            hasMore={list.state.hasMore}
            isLoadingMore={list.state.isLoadingMore}
            onSelect={openTicket}
            onLoadMore={list.loadMore}
          />
        )}
      </div>
    </div>
  );
}
