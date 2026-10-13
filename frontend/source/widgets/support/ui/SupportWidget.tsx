"use client";

import cn from "classnames";
import {
  CreateTicketForm,
  TicketDetail,
  TicketDetailSkeleton,
  TicketList,
  TicketListSkeleton,
  useSupportTickets,
} from "@/source/features/support-tickets";
import Button from "@/source/shared/ui/Button";
import { EmptyDetail } from "./EmptyDetail";
import s from "./SupportWidget.module.scss";

export function SupportWidget() {
  const support = useSupportTickets();

  return (
    <div className={s.body}>
      <div
        className={cn(s.contentPane, { [s.paneHiddenMobile]: support.view === "list" })}
      >
        {support.view === "detail" && (
          <div className={s.detailActions}>
            <Button variant="outlineOrange" size="sm" onClick={support.startCreate}>
              Создать обращение
            </Button>
          </div>
        )}
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

      <div
        className={cn(s.sidebarPane, { [s.paneHiddenMobile]: support.view !== "list" })}
      >
        <div className={s.mobileCreate}>
          <Button onClick={support.startCreate}>Создать обращение</Button>
        </div>
        {support.isListLoading ? (
          <TicketListSkeleton />
        ) : (
          <TicketList
            tickets={support.tickets}
            selectedId={support.selectedId}
            onSelect={support.openTicket}
            hasMore={support.hasMore}
            isLoadingMore={support.isLoadingMore}
            onLoadMore={support.loadMore}
          />
        )}
      </div>
    </div>
  );
}
