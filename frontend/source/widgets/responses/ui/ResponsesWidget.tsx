"use client";

import { useSession } from "@/source/features/session";
import { Loader } from "@/shared/ui";
import { ExpertResponsesWidget } from "./ExpertResponsesWidget";
import { CustomerResponsesWidget } from "./CustomerResponsesWidget";
import s from "./ResponsesWidget.module.scss";

export function ResponsesWidget() {
  const { user, isLoading: isSessionLoading } = useSession();
  const role = user?.role === "CUSTOMER" ? "customer" : user?.role === "EXPERT" ? "expert" : null;

  if (isSessionLoading || !role) {
    return <div className={s.statusState}><Loader label="" size="lg" /></div>;
  }

  return role === "expert" ? <ExpertResponsesWidget /> : <CustomerResponsesWidget />;
}
