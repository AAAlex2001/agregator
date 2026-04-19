"use client";

import { useSession } from "@/source/features/session";
import { ExpertResponsesWidget } from "./ExpertResponsesWidget";
import { CustomerResponsesWidget } from "./CustomerResponsesWidget";

export function ResponsesWidget() {
  const { resolvedRole } = useSession();
  const role = resolvedRole === "CUSTOMER" ? "customer" : resolvedRole === "EXPERT" ? "expert" : null;

  if (!role) {
    return null;
  }

  return role === "expert" ? <ExpertResponsesWidget /> : <CustomerResponsesWidget />;
}
