import { useState } from "react";
import { useSession } from "@/features/session";
import { LicenseHoldersPanel, UsefulLinks, usefulCategories } from "@/features/useful";
import { Screen } from "@/widgets/app-shell";
import { Tabs } from "@/shared/ui/tabs";
import s from "./style.module.scss";

export function UsefulPage() {
  const { role } = useSession();
  const categories = usefulCategories(role);
  const [tab, setTab] = useState(categories[0]?.key ?? "");
  const active = categories.find((c) => c.key === tab) ?? categories[0];

  return (
    <Screen bare heading="Полезное" panel>
      <div className={s.wrap}>
        <Tabs
          tabs={categories.map((c) => ({ key: c.key, label: c.label }))}
          active={active?.key ?? ""}
          onChange={setTab}
        />
        {active && (active.key === "license" ? <LicenseHoldersPanel /> : <UsefulLinks links={active.links} />)}
      </div>
    </Screen>
  );
}
