"use client";

import {
  LaborForm,
  LaborListings,
  useLaborResources,
  type LaborListTab,
  type LaborPageMode,
} from "@/source/features/labor-resources";
import {
  Accordion,
  Tabs,
} from "@/source/shared/ui";
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
  const form = (
    <LaborForm
      mode={mode}
      onCreated={resources.onCreated}
    />
  );

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

      {!resources.isDesktop && (
        <div className={s.mobileForm}>
          <Accordion
            activeId={resources.formOpen ? "labor-form" : null}
            onToggle={() =>
              resources.setFormOpen(!resources.formOpen)
            }
            items={[
              {
                id: "labor-form",
                question: resources.copy.formTitle,
                answer: form,
              },
            ]}
          />
        </div>
      )}

      <div className={s.layout}>
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

        {resources.isDesktop && (
          <aside className={s.desktopForm}>{form}</aside>
        )}
      </div>
    </main>
  );
}
