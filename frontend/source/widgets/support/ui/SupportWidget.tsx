"use client";

import { useEffect, useState } from "react";
import { useNotifications } from "@/source/shared/ui/Notifications";
import type { SupportTicket } from "@/source/entities/ticket";
import {
  TicketList,
  TicketDetail,
  CreateTicketForm,
  fetchTickets,
  fetchTicket,
  createTicket,
  replyToTicket,
  type CreateTicketPayload,
} from "@/source/features/support-tickets";
import { EmptyDetail } from "./EmptyDetail";
import { SupportSkeleton } from "./SupportSkeleton";
import s from "./SupportWidget.module.scss";

type View = "list" | "detail" | "create";

export function SupportWidget() {
  const { showError } = useNotifications();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [view, setView] = useState<View>("list");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchTickets()
      .then((data) => {
        if (cancelled) return;
        setTickets(data.items);
      })
      .catch((error) => {
        if (cancelled) return;
        showError(error instanceof Error ? error.message : "Ошибка загрузки");
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const openTicket = async (id: number) => {
    setSelectedId(id);
    setView("detail");
    try {
      const ticket = await fetchTicket(id);
      upsertTicket(ticket);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось загрузить обращение");
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

  if (isLoading) {
    return <SupportSkeleton />;
  }

  return (
    <main className={s.body}>
      <div
        className={`${s.sidebarPane} ${view !== "list" ? s.paneHiddenMobile : ""}`.trim()}
      >
        <TicketList
          tickets={tickets}
          selectedId={selectedId}
          onSelect={openTicket}
          onCreate={startCreate}
        />
      </div>

      <div
        className={`${s.contentPane} ${view === "list" ? s.paneHiddenMobile : ""}`.trim()}
      >
        {view === "create" && (
          <CreateTicketForm onCancel={backToList} onSubmit={handleCreate} />
        )}
        {view === "detail" && selected && (
          <TicketDetail
            ticket={selected}
            onBack={backToList}
            onReply={handleReply}
          />
        )}
        {view === "list" && <EmptyDetail onCreate={startCreate} />}
      </div>
    </main>
  );
}
