"use client";

import {
  CreateTicketForm,
  TicketDetail,
  TicketDetailSkeleton,
  TicketList,
  TicketListSkeleton,
  useSupportTickets,
} from "@/source/features/support-tickets";
import { EmptyDetail } from "./EmptyDetail";
import s from "./SupportWidget.module.scss";

export function SupportWidget() {
  const support = useSupportTickets();

  return (
    <main className={s.body}>
      <div
        className={`${s.sidebarPane} ${support.view !== "list" ? s.paneHiddenMobile : ""}`.trim()}
      >
        {support.isListLoading ? (
          <TicketListSkeleton />
        ) : (
          <TicketList
            tickets={support.tickets}
            selectedId={support.selectedId}
            onSelect={support.openTicket}
            onCreate={support.startCreate}
            hasMore={support.hasMore}
            isLoadingMore={support.isLoadingMore}
            onLoadMore={support.loadMore}
          />
        )}
      </div>

      <div
        className={`${s.contentPane} ${support.view === "list" ? s.paneHiddenMobile : ""}`.trim()}
      >
        {support.view === "create" && (
          <CreateTicketForm onCancel={support.backToList} onSubmit={support.create} />
        )}
        {support.view === "detail" && (
          support.showDetailSkeleton || !support.selected ? (
            <TicketDetailSkeleton />
          ) : (
            <TicketDetail
              ticket={support.selected}
              onBack={support.backToList}
              onReply={support.reply}
            />
          )
        )}
        {support.view === "list" && <EmptyDetail onCreate={support.startCreate} />}
      </div>
    </main>
  );
}
