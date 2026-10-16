"use client";

import type { LandingContent } from "@/entities/landing-content";
import { OrderSearchBar } from "@/features/search-orders";
import { ExpertiseLanding, LandingSearch } from "@/widgets/landing";
import { useServiceRegistration } from "../../../providers/authentication/use-service-registration";
import { ServiceFooter } from "../../shells/service-footer";
import { ServiceHeader } from "../../shells/service-header";
import { ServiceNavigation } from "../../shells/service-navigation";
import type { ServicePageContentProps } from "../../service-page-props";

/** Редактируемый контент экспертизы, новости и выбор публичной оболочки. */
interface ExpertisePageContentProps extends ServicePageContentProps {
  content: LandingContent;
}

/** Подключает регистрацию, поиск и карты к странице экспертизы промышленной безопасности. */
export function ExpertisePageContent({
  content,
  news,
  isPublic = false,
}: ExpertisePageContentProps) {
  const register = useServiceRegistration();
  const basePath = isPublic ? "" : "/landing";

  return (
    <ExpertiseLanding
      content={content}
      news={news}
      articleBasePath={basePath}
      onRegister={register}
      header={isPublic ? <ServiceHeader /> : undefined}
      footer={isPublic ? <ServiceFooter /> : undefined}
      navigation={
        <ServiceNavigation
          activeHref="/ekspertiza-promyshlennoy-bezopasnosti"
          basePath={basePath}
        />
      }
      search={
        <LandingSearch>
          <OrderSearchBar withFilters />
        </LandingSearch>
      }
    />
  );
}
