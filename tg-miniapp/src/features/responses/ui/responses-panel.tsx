import { Spinner } from "@/shared/ui";
import { Tabs } from "@/shared/ui/tabs";
import { ResponseCard, type ResponseTab } from "@/entites/response";
import { useResponses } from "../model/useResponses";
import s from "./responses-panel.module.scss";

const SUB_TABS: { id: ResponseTab; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "review", label: "На рассмотрении" },
  { id: "in_progress", label: "В работе" },
  { id: "rejected", label: "Отклонённые" },
  { id: "accepted", label: "В переговорах" },
  { id: "withdrawn_by_expert", label: "Отозванные мной" },
];

export function ResponsesPanel() {
  const r = useResponses();
  const tabs = SUB_TABS.map((t) => ({ id: t.id, label: t.label, count: r.counters[t.id] }));

  return (
    <>
      <Tabs items={tabs} active={r.tab} onChange={(id) => r.setTab(id as ResponseTab)} />
      {r.items === null ? (
        <div className={s.feedLoading}>
          <Spinner />
        </div>
      ) : r.items.length === 0 ? (
        <p className={s.emptyLine}>В этой вкладке пока пусто</p>
      ) : (
        <div className={s.feed}>
          {r.items.map((resp) => (
            <ResponseCard
              key={resp.id}
              response={resp}
              busy={r.busyId === resp.id}
              onWithdraw={r.withdraw}
              onRestore={r.restore}
            />
          ))}
        </div>
      )}
    </>
  );
}
