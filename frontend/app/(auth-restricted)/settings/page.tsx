"use client";

import { useSearchParams } from "next/navigation";
import { SettingsWidget } from "@/source/widgets/profile/settings";

type Section = "personal" | "notifications" | "subscription";

function resolveExplicitSection(value: string | null): Section | null {
  if (value === "subscription") return "subscription";
  if (value === "notifications") return "notifications";
  if (value === "personal") return "personal";
  return null;
}

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const explicitSection = resolveExplicitSection(searchParams.get("section"));

  return <SettingsWidget explicitSection={explicitSection} />;
}
