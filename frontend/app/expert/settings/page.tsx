import { Suspense } from "react";
import { SettingsWidget } from "@/source/widgets/profile/settings";

export default function ExpertSettingsPage() {
  return (
    <Suspense>
      <SettingsWidget />
    </Suspense>
  );
}
