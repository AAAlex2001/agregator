"use client";

import { useSession } from "@/source/entities/session";
import { ExpertResponsesWidget } from "./ExpertResponsesWidget";
import { CustomerResponsesWidget } from "./CustomerResponsesWidget";

export function ResponsesWidget() {
  const { role } = useSession();

  if (role === "EXPERT") return <ExpertResponsesWidget />;
  if (role === "CUSTOMER") return <CustomerResponsesWidget />;
  return null;
}
