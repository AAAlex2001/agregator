"use client";

import { OrderSearchBar } from "@/features/search-orders";
import { ForensicLanding, LandingSearch } from "@/widgets/landing";
import { useServiceRegistration } from "../../../providers/authentication/use-service-registration";
import { ServiceFooter } from "../../shells/service-footer";
import { ServiceHeader } from "../../shells/service-header";
import { ServiceNavigation } from "../../shells/service-navigation";
import type { ServicePageContentProps } from "../../service-page-props";

/** Подключает регистрацию, поиск и карты к странице судебной экспертизы. */
export function ForensicPageContent({
  news,
  isPublic = false,
}: ServicePageContentProps) {
  const register = useServiceRegistration();
  const basePath = isPublic ? "" : "/landing";

  return (
    <ForensicLanding
      news={news}
      articleBasePath={basePath}
      onRegister={register}
      header={isPublic ? <ServiceHeader /> : undefined}
      footer={isPublic ? <ServiceFooter /> : undefined}
      navigation={
        <ServiceNavigation
          activeHref="/sudebnaya-ekspertiza"
          basePath={basePath}
        />
      }
      search={
        <LandingSearch>
          <OrderSearchBar />
        </LandingSearch>
      }
    />
  );
}
