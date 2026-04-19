"use client";

import { useSession } from "@/source/features/session";
import Tabs from "@/source/shared/ui/Tabs";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { ExpertResponsesWidget } from "./ExpertResponsesWidget";
import { CustomerResponsesWidget } from "./CustomerResponsesWidget";
import { ResponsesSkeleton } from "./ResponsesSkeleton";
import s from "./ResponsesWidget.module.scss";

const PENDING_TABS = [
  { id: "review", label: "На рассмотрении" },
  { id: "in_progress", label: "В работе" },
  { id: "rejected", label: "Отклоненные" },
  { id: "accepted", label: "В переговорах" },
  { id: "completed", label: "Завершены" },
];

export function ResponsesWidget() {
  const { resolvedRole } = useSession();
  const role = resolvedRole === "CUSTOMER" ? "customer" : resolvedRole === "EXPERT" ? "expert" : null;

  if (!role) {
    return (
      <div className={s.wrapper}>
        <div className={s.pageHead}>
          <Title text="Отклики" as="h1" className={s.pageTitle} />
          <Subtitle text="Отслеживайте статусы откликов" className={s.pageSubtitle} />
        </div>

        <Tabs
          variant="pill"
          tabs={PENDING_TABS}
          activeTab="review"
          onTabChange={() => {}}
        />

        <ResponsesSkeleton compact />
      </div>
    );
  }

  return role === "expert" ? <ExpertResponsesWidget /> : <CustomerResponsesWidget />;
}
