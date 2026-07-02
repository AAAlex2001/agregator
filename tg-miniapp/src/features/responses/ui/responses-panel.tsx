import { useState } from "react";
import { Spinner } from "@/shared/ui";
import { Tabs, type TabItem } from "@/shared/ui/tabs";
import { ResponseCard, type ResponseTab } from "@/entites/response";
import { useResponses } from "../model/useResponses";
import s from "./responses-panel.module.scss";

const TABS: TabItem[] = [
  { key: "all", label: "Все отклики" },
  { key: "review", label: "На рассмотрении" },
  { key: "in_progress", label: "В работе" },
  { key: "rejected", label: "Отклонённые" },
  { key: "accepted", label: "В переговорах" },
  { key: "withdrawn_by_expert", label: "Отозванные мной" },
];

export function ResponsesPanel() {
  const [tab, setTab] = useState<ResponseTab>("all");
  const r = useResponses(tab);

  return (
    <>
      <Tabs tabs={TABS} active={tab} onChange={(k) => setTab(k as ResponseTab)} />
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
