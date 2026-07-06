import { useState, type ReactNode } from "react";
import { EmptyState, Spinner } from "@/shared/ui";
import { Tabs, type TabItem } from "@/shared/ui/tabs";
import {
  EmptyAcceptedIcon,
  EmptyInWorkIcon,
  EmptyNewResponsesIcon,
  EmptyRejectedIcon,
  EmptyResponsesIcon,
} from "@/shared/ui/icons/empty";
import { ResponseCard, type ExpertResponse, type ResponseTab } from "@/entites/response";
import { useResponses } from "../model/use-responses";
import { EditResponseSheet } from "./edit-response-sheet";
import s from "./responses-panel.module.scss";

const STATUS: { key: ResponseTab; label: string }[] = [
  { key: "all", label: "Все отклики" },
  { key: "review", label: "На рассмотрении" },
  { key: "in_progress", label: "В работе" },
  { key: "rejected", label: "Отклонённые" },
  { key: "accepted", label: "В переговорах" },
  { key: "withdrawn_by_expert", label: "Отозванные мной" },
];

const EMPTY_META: Record<ResponseTab, { icon: ReactNode; title: string; subtitle: string }> = {
  all: {
    icon: <EmptyResponsesIcon />,
    title: "Пока нет откликов",
    subtitle: "Откликнитесь на подходящий заказ — ваши отклики появятся здесь",
  },
  review: {
    icon: <EmptyNewResponsesIcon />,
    title: "Нет откликов на рассмотрении",
    subtitle: "Отклики, ожидающие решения заказчика, появятся здесь",
  },
  in_progress: {
    icon: <EmptyInWorkIcon />,
    title: "Нет заказов в работе",
    subtitle: "Когда заказчик выберет вас исполнителем, заказ появится здесь",
  },
  rejected: {
    icon: <EmptyRejectedIcon />,
    title: "Нет отклонённых откликов",
    subtitle: "Сюда попадают отклики, отклонённые заказчиком",
  },
  accepted: {
    icon: <EmptyAcceptedIcon />,
    title: "Переговоры не ведутся",
    subtitle: "Когда заказчик примет ваш отклик, здесь начнутся переговоры",
  },
  withdrawn_by_expert: {
    icon: <EmptyRejectedIcon />,
    title: "Нет отозванных откликов",
    subtitle: "Отклики, которые вы отозвали, появятся здесь",
  },
};

interface Props {
  onOpenChat: (uuid: string) => void;
}

export function ResponsesPanel({ onOpenChat }: Props) {
  const [tab, setTab] = useState<ResponseTab>("all");
  const [editTarget, setEditTarget] = useState<ExpertResponse | null>(null);
  const r = useResponses(tab, onOpenChat);

  const tabs: TabItem[] = STATUS.map((t) => ({
    key: t.key,
    label: t.label,
    badge: r.counters[t.key] > 0 ? String(r.counters[t.key]) : undefined,
  }));

  return (
    <>
      <Tabs tabs={tabs} active={tab} onChange={(k) => setTab(k as ResponseTab)} />
      {r.items === null ? (
        <div className={s.feedLoading}>
          <Spinner />
        </div>
      ) : r.items.length === 0 ? (
        <EmptyState {...EMPTY_META[tab]} />
      ) : (
        <div className={s.feed}>
          {r.items.map((resp) => (
            <ResponseCard
              key={resp.id}
              response={resp}
              busy={r.busyId === resp.id}
              onWithdraw={r.withdraw}
              onRestore={r.restore}
              onEdit={setEditTarget}
              onChat={r.openChat}
              onConfirm={r.confirmProject}
            />
          ))}
        </div>
      )}

      <EditResponseSheet
        response={editTarget}
        onClose={() => setEditTarget(null)}
        onSaved={() => {
          setEditTarget(null);
          void r.reload();
        }}
      />
    </>
  );
}
