import cn from "classnames";
import { Spinner } from "@/shared/ui";
import { Tabs } from "@/shared/ui/tabs";
import { tapHaptic } from "@/shared/services/telegram";
import { SortAscIcon, SortDescIcon, SortIcon } from "@/shared/ui/icons/interface";
import { CustomerResponseCard, type CustomerSortBy, type ResponseTab } from "@/entites/response";
import { useCustomerResponses } from "../model/use-customer-responses";
import s from "./customer-responses-panel.module.scss";

const TAB_LABELS: { key: ResponseTab; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "review", label: "Новые" },
  { key: "in_progress", label: "В работе" },
  { key: "rejected", label: "Отклоненные" },
  { key: "accepted", label: "В переговорах" },
];

const SORTS: { key: CustomerSortBy; label: string }[] = [
  { key: "created_at", label: "По дате" },
  { key: "proposed_sum_amount", label: "По цене" },
  { key: "expert_rating", label: "По рейтингу" },
];

export function CustomerResponsesPanel() {
  const { tab, setTab, sortBy, sortDir, toggleSort, items, counters } = useCustomerResponses();

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

      <div className={s.sortRow}>
        {SORTS.map((sort) => {
          const active = sortBy === sort.key;
          return (
            <button
              key={sort.key}
              type="button"
              className={cn(s.sortPill, { [s.sortOn]: active })}
              onClick={() => {
                tapHaptic();
                toggleSort(sort.key);
              }}
            >
              {sort.label}
              {active ? (
                sortDir === "desc" ? (
                  <SortDescIcon width={15} height={15} />
                ) : (
                  <SortAscIcon width={15} height={15} />
                )
              ) : (
                <SortIcon width={15} height={15} />
              )}
            </button>
          );
        })}
      </div>

      {items === null ? (
        <div className={s.loading}>
          <Spinner />
        </div>
      ) : items.length === 0 ? (
        <p className={s.empty}>Пока нет откликов</p>
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
