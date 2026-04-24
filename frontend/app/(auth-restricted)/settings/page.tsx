"use client";

import { useSearchParams } from "next/navigation";
import { SettingsWidget } from "@/source/widgets/profile/settings";

type Section = "personal" | "notifications" | "subscription";

function resolveSection(value: string | null): Section {
  if (value === "subscription") {
    return "subscription";
  }
  if (value === "notifications") {
    return "notifications";
  }
  return "personal";
}

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const section = resolveSection(searchParams.get("section"));

  return <SettingsWidget initialSection={section} />;
}
