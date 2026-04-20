import { Button } from "@/shared/ui";
import { EmptyStateCard } from "@/source/shared/ui";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import Tabs from "@/source/shared/ui/Tabs";
import { ResponsesState } from "@/widgets/responses-state";
import { ResponsesSwiper } from "@/widgets/responses-swiper";
import { ResponseCard } from "@/source/entities/response";
import type { ResponseTabKey, UserRole } from "@/source/entities/response";
import { getCardActions } from "@/source/features/responses";
import type { useResponses } from "@/source/features/responses";
import { ResponsesSkeleton } from "./ResponsesSkeleton";
import s from "./ResponsesWidget.module.scss";

type ResponsesModel = ReturnType<typeof useResponses>;

interface Props {
  role: UserRole;
  title: string;
  subtitle: string;
  model: ResponsesModel;
  actionHandlers: Parameters<typeof getCardActions>[3];
}

export function ResponsesList({ role, title, subtitle, model, actionHandlers }: Props) {
  const activeLabel = model.tabs.find((tab) => tab.id === model.activeTab)?.label ?? "";

  return (
    <div className={s.wrapper}>
      <div className={s.pageHead}>
        <Title text={title} as="h1" className={s.pageTitle} />
        <Subtitle text={subtitle} className={s.pageSubtitle} />
      </div>

      {model.isLoading ? (
        <ResponsesSkeleton compact />
      ) : (
        <div className={s.contentArea}>
          <Tabs
            variant="pill"
            tabs={model.tabs.map((tab) => ({ id: tab.id, label: tab.label, count: tab.count }))}
            activeTab={model.activeTab}
            onTabChange={(id) => model.setTab(id as ResponseTabKey)}
            className={s.tabs}
          />

          <div className={s.contentBody}>
            {model.error ? (
              <ResponsesState
                title="Ошибка загрузки"
                subtitle={model.error}
                styles={s}
                action={<Button variant="primary" size="sm" onClick={() => void model.reload()}>Повторить</Button>}
              />
            ) : model.items.length === 0 ? (
              <div className={s.emptyState}>
                <EmptyStateCard
                  title="Пока нет откликов"
                  subtitle={activeLabel ? `В разделе «${activeLabel}» пока пусто` : "Здесь пока нет откликов"}
                />
              </div>
            ) : (
              <ResponsesSwiper
                items={model.items}
                resetKey={model.activeTab}
                getKey={(item) => item.id}
                renderItem={(item) => (
                  <ResponseCard
                    card={item}
                    role={role}
                    actions={getCardActions(item, model.actionLoading[item.id] ?? null, role, actionHandlers)}
                  />
                )}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}