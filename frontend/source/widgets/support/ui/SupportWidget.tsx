"use client";

import { useEffect, useState } from "react";
import { useNotifications } from "@/source/shared/ui/Notifications";
import type { SupportTicket } from "@/source/entities/ticket";
import {
  TicketList,
  TicketListSkeleton,
  TicketDetail,
  TicketDetailSkeleton,
  CreateTicketForm,
  fetchTickets,
  fetchTicket,
  createTicket,
  replyToTicket,
  type CreateTicketPayload,
} from "@/source/features/support-tickets";
import { EmptyDetail } from "./EmptyDetail";
import s from "./SupportWidget.module.scss";

type View = "list" | "detail" | "create";
const PAGE_SIZE = 50;

export function SupportWidget() {
  const { showError } = useNotifications();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [view, setView] = useState<View>("list");
  const [isListLoading, setIsListLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchTickets()
      .then((data) => {
        if (cancelled) return;
        setTickets(data.items);
        setHasMore(data.hasMore);
      })
      .catch((error) => {
        if (cancelled) return;
        showError(error instanceof Error ? error.message : "Ошибка загрузки");
      })
      .finally(() => {
        if (cancelled) return;
        setIsListLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = async () => {
    if (isListLoading || isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const data = await fetchTickets(tickets.length, PAGE_SIZE);
      setTickets((prev) => [...prev, ...data.items]);
      setHasMore(data.hasMore);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Ошибка загрузки");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const upsertTicket = (ticket: SupportTicket) => {
    setTickets((prev) => {
      const exists = prev.some((t) => t.id === ticket.id);
      if (exists) {
        return prev.map((t) => (t.id === ticket.id ? ticket : t));
      }
      return [ticket, ...prev];
    });
  };

  const selected = tickets.find((t) => t.id === selectedId) ?? null;
  const isSelectedHydrated =
    selected !== null && (selected.messages?.length ?? 0) > 0;

  const openTicket = async (id: number) => {
    setSelectedId(id);
    setView("detail");
    setIsDetailLoading(true);
    try {
      const ticket = await fetchTicket(id);
      upsertTicket(ticket);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось загрузить обращение");
    } finally {
      setIsDetailLoading(false);
    }
  };

  const startCreate = () => {
    setSelectedId(null);
    setView("create");
  };

  const backToList = () => {
    setSelectedId(null);
    setView("list");
  };

  const handleCreate = async (payload: CreateTicketPayload) => {
    try {
      const ticket = await createTicket(payload);
      upsertTicket(ticket);
      setSelectedId(ticket.id);
      setView("detail");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось создать обращение");
    }
  };

  const handleReply = async (text: string, files: File[]) => {
    if (!selected) return;
    try {
      const ticket = await replyToTicket(selected.id, { text, files });
      upsertTicket(ticket);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось отправить сообщение");
    }
  };

  const showDetailSkeleton =
    view === "detail" && (isDetailLoading || !isSelectedHydrated);

  return (
    <main className={s.body}>
      <div
        className={`${s.sidebarPane} ${view !== "list" ? s.paneHiddenMobile : ""}`.trim()}
      >
        {isListLoading ? (
          <TicketListSkeleton />
        ) : (
          <TicketList
            tickets={tickets}
            selectedId={selectedId}
            onSelect={openTicket}
            onCreate={startCreate}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={loadMore}
          />
        )}
      </div>

      <div
        className={`${s.contentPane} ${view === "list" ? s.paneHiddenMobile : ""}`.trim()}
      >
        {view === "create" && (
          <CreateTicketForm onCancel={backToList} onSubmit={handleCreate} />
        )}
        {view === "detail" && (
          showDetailSkeleton || !selected ? (
            <TicketDetailSkeleton />
          ) : (
            <TicketDetail
              ticket={selected}
              onBack={backToList}
              onReply={handleReply}
            />
          )
        )}
        {view === "list" && <EmptyDetail onCreate={startCreate} />}
      </div>
    </main>
  );
}
