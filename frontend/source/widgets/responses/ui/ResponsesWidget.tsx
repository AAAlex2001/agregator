"use client";

import { useSession } from "@/source/features/session";
import { ExpertResponsesWidget } from "./ExpertResponsesWidget";
import { CustomerResponsesWidget } from "./CustomerResponsesWidget";

export function ResponsesWidget() {
  const { role } = useSession();
  const currentRole = role === "CUSTOMER" ? "customer" : role === "EXPERT" ? "expert" : null;

  if (!currentRole) {
    return null;
  }

  return currentRole === "expert" ? <ExpertResponsesWidget /> : <CustomerResponsesWidget />;
}
