"use client";

import {
  LaborForm,
  LaborListings,
  useLaborResources,
  type LaborListTab,
  type LaborPageMode,
} from "@/source/features/labor-resources";
import { Tabs } from "@/source/shared/ui";
import {
  Subtitle,
  Title,
} from "@/source/shared/ui/Typography";
import s from "./LaborResourcesWidget.module.scss";

interface LaborResourcesWidgetProps {
  mode: LaborPageMode;
}

export function LaborResourcesWidget({
  mode,
}: LaborResourcesWidgetProps) {
  const resources = useLaborResources(mode);

  return (
    <main className={s.wrapper}>
      <header className={s.pageHead}>
        <Title
          text={resources.copy.title}
          as="h1"
          className={s.pageTitle}
        />
        <Subtitle
          text={resources.copy.subtitle}
          className={s.pageSubtitle}
        />
      </header>

      <section className={s.formSection}>
        <LaborForm
          mode={mode}
          onCreated={resources.onCreated}
        />
      </section>

      <section className={s.content}>
        <Tabs
          variant="pill"
          activeTab={resources.tab}
          onTabChange={(value) =>
            resources.setTab(value as LaborListTab)
          }
          tabs={[
            {
              id: "browse",
              label: resources.copy.browseTab,
            },
            {
              id: "mine",
              label: "Мои заявки",
            },
          ]}
        />

        <LaborListings
          items={resources.items}
          tab={resources.tab}
          role={resources.role}
          loading={resources.loading}
          error={resources.error}
          busyId={resources.busyId}
          onContact={(item) => void resources.contact(item)}
          onClose={(item) => void resources.close(item)}
        />
      </section>
    </main>
  );
}
