"use client";

import { TicketCard } from "@/entities/ticket";
import type { TicketSummary } from "@/entities/ticket";
import { useInfiniteScroll } from "@/shared/lib/use-infinite-scroll";
import { EmptyState } from "@/shared/ui/empty-state";
import { TabSupportIcon } from "@/shared/ui/icons";
import { Loader } from "@/shared/ui/loader";
import styles from "./style.module.scss";

/** Обращения, выбранное из них, ошибка загрузки и подгрузка следующей страницы. */
interface TicketListProps {
  tickets: TicketSummary[];
  selectedId: number | null;
  error: string | null;
  hasMore: boolean;
  isLoadingMore: boolean;
  onSelect: (id: number) => void;
  onLoadMore: () => void;
}

/** Список обращений с подгрузкой при прокрутке. */
export function TicketList({
  tickets,
  selectedId,
  error,
  hasMore,
  isLoadingMore,
  onSelect,
  onLoadMore,
}: TicketListProps) {
  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingMore,
    onLoadMore,
  });

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h1 className={styles.title}>Обращения</h1>
        <span className={styles.count}>{tickets.length}</span>
      </div>

      {error && (
        <EmptyState
          icon={<TabSupportIcon />}
          title="Не удалось загрузить обращения"
          subtitle={error}
        />
      )}

      {!error && tickets.length === 0 && (
        <EmptyState
          icon={<TabSupportIcon />}
          title="Обращений пока нет"
          subtitle="Создайте первое — мы ответим как можно скорее."
        />
      )}

      {tickets.length > 0 && (
        <ul className={styles.list}>
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <TicketCard
                ticket={ticket}
                isActive={selectedId === ticket.id}
                onSelect={onSelect}
              />
            </li>
          ))}
          {isLoadingMore && (
            <li className={styles.loadMore}>
              <Loader label="" />
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
