"use client";

import { useSession } from "@/source/features/session";
import { ExpertResponsesWidget } from "./ExpertResponsesWidget";
import { CustomerResponsesWidget } from "./CustomerResponsesWidget";
import { ResponsesSkeleton } from "./ResponsesSkeleton";

export function ResponsesWidget() {
  const { user, isLoading: isSessionLoading } = useSession();
  const role = user?.role === "CUSTOMER" ? "customer" : user?.role === "EXPERT" ? "expert" : null;

  if (isSessionLoading || !role) {
    return <ResponsesSkeleton />;
  }

  return role === "expert" ? <ExpertResponsesWidget /> : <CustomerResponsesWidget />;
}
