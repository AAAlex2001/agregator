import { useState, type ReactNode } from "react";
import { BottomSheet, Button, EmptyState, Spinner, TextArea } from "@/shared/ui";
import { Tabs } from "@/shared/ui/tabs";
import {
  EmptyAcceptedIcon,
  EmptyInWorkIcon,
  EmptyNewResponsesIcon,
  EmptyRejectedIcon,
  EmptyResponsesIcon,
} from "@/shared/ui/icons/empty";
import {
  CustomerResponseCard,
  type CustomerSortBy,
  type ExpertResponse,
  type ResponseTab,
  type SortDir,
} from "@/entites/response";
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
    subtitle: "Отклики исполнителей на ваши заказы появятся здесь",
  },
  review: {
    icon: <EmptyNewResponsesIcon />,
    title: "Новых откликов нет",
    subtitle: "Когда исполнитель откликнется на заказ, вы увидите его здесь",
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
    subtitle: "Примите отклик, чтобы обсудить детали с исполнителем",
  },
};

interface Props {
  sortBy: CustomerSortBy;
  sortDir: SortDir;
  onOpenChat: (uuid: string) => void;
  onCompleted: (response: ExpertResponse) => void;
}

export function CustomerResponsesPanel({ sortBy, sortDir, onOpenChat, onCompleted }: Props) {
  const r = useCustomerResponses(sortBy, sortDir, onOpenChat);
  const [rejectTarget, setRejectTarget] = useState<ExpertResponse | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const openReject = (response: ExpertResponse) => {
    setRejectReason("");
    setRejectTarget(response);
  };

  const completeAndReview = async (id: number) => {
    const target = r.items?.find((item) => item.id === id) ?? null;
    const done = await r.complete(id);
    if (done && target) onCompleted(target);
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;
    const done = await r.reject(rejectTarget.id, rejectReason);
    if (done) setRejectTarget(null);
  };

  return (
    <div className={s.wrap}>
      <Tabs
        tabs={TAB_LABELS.map((t) => ({
          key: t.key,
          label: t.label,
          badge: r.counters && r.counters[t.key] > 0 ? String(r.counters[t.key]) : undefined,
        }))}
        active={r.tab}
        onChange={(key) => r.setTab(key as ResponseTab)}
      />

      {r.items === null ? (
        <div className={s.loading}>
          <Spinner />
        </div>
      ) : r.items.length === 0 ? (
        <EmptyState {...EMPTY_META[r.tab]} />
      ) : (
        <div className={s.list}>
          {r.items.map((response) => (
            <CustomerResponseCard
              key={response.id}
              response={response}
              busy={r.busyId === response.id}
              onAccept={r.accept}
              onHire={r.hire}
              onReject={openReject}
              onComplete={(id) => void completeAndReview(id)}
              onReturn={r.returnToReview}
              onDeleteRejected={r.removeRejected}
              onChat={r.openChat}
            />
          ))}
        </div>
      )}

      <BottomSheet open={rejectTarget !== null} title="Отклонить отклик" onClose={() => setRejectTarget(null)}>
        <div className={s.reject}>
          <p className={s.rejectHint}>
            Исполнитель {rejectTarget?.expert_name} получит уведомление. Можно указать причину — она видна исполнителю.
          </p>
          <TextArea
            placeholder="Причина отклонения (необязательно)…"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <div className={s.rejectActions}>
            <Button variant="outline" onClick={() => setRejectTarget(null)}>
              Отмена
            </Button>
            <Button variant="danger" loading={r.busyId === rejectTarget?.id} onClick={() => void confirmReject()}>
              Отклонить
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
