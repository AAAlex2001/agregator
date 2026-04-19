"use client";

import { useSearchParams } from "next/navigation";
import { SettingsWidget } from "@/source/widgets/profile/settings";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const section = searchParams.get("section") === "finance" ? "finance" : "personal";

  return <SettingsWidget initialSection={section} />;
}
