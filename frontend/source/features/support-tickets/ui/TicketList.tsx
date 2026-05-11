"use client";

import { useRef } from "react";
import Button from "@/source/shared/ui/Button";
import { PlusThinIcon } from "@/source/shared/ui/icons";
import { TicketCard, type SupportTicket } from "@/source/entities/ticket";
import Loader from "@/source/shared/ui/Loader";
import { useInfiniteScroll } from "@/source/shared/lib/useInfiniteScroll";
import s from "./TicketList.module.scss";

interface Props {
  tickets: SupportTicket[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onCreate: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
}

export function TicketList({ tickets, selectedId, onSelect, onCreate, hasMore = false, isLoadingMore = false, onLoadMore }: Props) {
  const scrollRef = useRef<HTMLUListElement>(null);
  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingMore,
    onLoadMore: () => onLoadMore?.(),
    root: scrollRef,
  });

  return (
    <div className={s.panel}>
      <div className={s.header}>
        <span className={s.title}>Мои обращения</span>
        <span className={s.count}>{tickets.length}</span>
      </div>

      <Button
        variant="primary"
        size="md"
        fullWidth
        onClick={onCreate}
        className={s.createButton}
      >
        <span className={s.createInner}>
          <PlusThinIcon />
          <span>Создать обращение</span>
        </span>
      </Button>

      {tickets.length === 0 ? (
        <div className={s.empty}>
          <p>У вас пока нет обращений</p>
          <span>Создайте первое — мы ответим как можно скорее.</span>
        </div>
      ) : (
        <ul ref={scrollRef} className={s.list}>
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <TicketCard
                ticket={ticket}
                isActive={selectedId === ticket.id}
                onClick={() => onSelect(ticket.id)}
              />
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
