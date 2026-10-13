"use client";

import { useRef } from "react";
import { TicketCard, type TicketSummary } from "@/source/entities/ticket";
import { useInfiniteScroll } from "@/source/shared/lib/useInfiniteScroll";
import { EmptyState } from "@/source/shared/ui/EmptyState";
import { TabSupportIcon } from "@/source/shared/ui/icons";
import Loader from "@/source/shared/ui/Loader";
import s from "./TicketList.module.scss";

interface TicketListProps {
  tickets: TicketSummary[];
  selectedId: number | null;
  hasMore: boolean;
  isLoadingMore: boolean;
  onSelect: (id: number) => void;
  onLoadMore: () => void;
}

/** Список обращений с подгрузкой при прокрутке. */
export function TicketList({ tickets, selectedId, hasMore, isLoadingMore, onSelect, onLoadMore }: TicketListProps) {
  const scrollRef = useRef<HTMLUListElement>(null);
  const sentinelRef = useInfiniteScroll({ hasMore, isLoading: isLoadingMore, onLoadMore, root: scrollRef });

  return (
    <div className={s.panel}>
      <div className={s.header}>
        <h1 className={s.title}>Обращения</h1>
        <span className={s.count}>{tickets.length}</span>
      </div>

      {tickets.length === 0 ? (
        <EmptyState
          icon={<TabSupportIcon />}
          title="Обращений пока нет"
          subtitle="Создайте первое — мы ответим как можно скорее."
        />
      ) : (
        <ul ref={scrollRef} className={s.list}>
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <TicketCard ticket={ticket} isActive={selectedId === ticket.id} onClick={() => onSelect(ticket.id)} />
            </li>
          ))}
          {isLoadingMore && (
            <li className={s.loadMore}>
              <Loader label="" size="md" />
            </li>
          )}
          <li aria-hidden="true">
            <div ref={sentinelRef} />
          </li>
        </ul>
      )}
    </div>
  );
}
