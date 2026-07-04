import { type ReactNode } from "react";
import { EmptyState, Spinner } from "@/shared/ui";
import { Tabs } from "@/shared/ui/tabs";
import {
  EmptyAcceptedIcon,
  EmptyInWorkIcon,
  EmptyNewResponsesIcon,
  EmptyRejectedIcon,
  EmptyResponsesIcon,
} from "@/shared/ui/icons/empty";
import { CustomerResponseCard, type CustomerSortBy, type ResponseTab, type SortDir } from "@/entites/response";
import { useCustomerResponses } from "../model/use-customer-responses";
import s from "./customer-responses-panel.module.scss";

const TAB_LABELS: { key: ResponseTab; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "review", label: "Новые" },
  { key: "in_progress", label: "В работе" },
  { key: "rejected", label: "Отклоненные" },
  { key: "accepted", label: "В переговорах" },
];

const EMPTY_META: Record<string, { icon: ReactNode; title: string; subtitle: string }> = {
  all: {
    icon: <EmptyResponsesIcon />,
    title: "Пока нет откликов",
    subtitle: "Отклики экспертов на ваши заказы появятся здесь",
  },
  review: {
    icon: <EmptyNewResponsesIcon />,
    title: "Новых откликов нет",
    subtitle: "Когда эксперт откликнется на заказ, вы увидите его здесь",
  },
  in_progress: {
    icon: <EmptyInWorkIcon />,
    title: "Нет откликов в работе",
    subtitle: "Выберите исполнителя из новых откликов — работа начнётся здесь",
  },
  rejected: {
    icon: <EmptyRejectedIcon />,
    title: "Нет отклонённых откликов",
    subtitle: "Сюда попадают отклики, которые вы отклонили",
  },
  accepted: {
    icon: <EmptyAcceptedIcon />,
    title: "Переговоры не ведутся",
    subtitle: "Примите отклик, чтобы обсудить детали с экспертом",
  },
};

interface Props {
  sortBy: CustomerSortBy;
  sortDir: SortDir;
}

export function CustomerResponsesPanel({ sortBy, sortDir }: Props) {
  const { tab, setTab, items, counters } = useCustomerResponses(sortBy, sortDir);

  return (
    <div className={s.wrap}>
      <Tabs
        tabs={TAB_LABELS.map((t) => ({
          key: t.key,
          label: t.label,
          badge: counters && counters[t.key] > 0 ? String(counters[t.key]) : undefined,
        }))}
        active={tab}
        onChange={(key) => setTab(key as ResponseTab)}
      />

      {items === null ? (
        <div className={s.loading}>
          <Spinner />
        </div>
      ) : items.length === 0 ? (
        <EmptyState {...EMPTY_META[tab]} />
      ) : (
        <div className={s.list}>
          {items.map((response) => (
            <CustomerResponseCard key={response.id} response={response} />
          ))}
        </div>
      )}
    </div>
  );
}
