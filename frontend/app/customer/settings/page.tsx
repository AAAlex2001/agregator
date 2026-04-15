import { Suspense } from "react";
import { SettingsWidget } from "@/source/widgets/profile/settings";

export default function CustomerSettingsPage() {
  return (
    <Suspense>
      <SettingsWidget />
    </Suspense>
  );
}
