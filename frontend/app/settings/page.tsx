import { Suspense } from "react";
import { SettingsWidget } from "@/source/widgets/profile/settings";

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsWidget />
    </Suspense>
  );
}
