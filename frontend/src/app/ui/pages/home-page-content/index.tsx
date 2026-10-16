"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/entities/user";
import {
  HomeLanding,
  LandingInvitation,
  LandingNotifications,
  LandingPricing,
} from "@/widgets/landing";
import { SiteFooter } from "@/widgets/site-footer";
import { SiteHeader } from "@/widgets/site-header";
import type { HomePageData } from "../../../content/load-home-page";
import { useAuthentication } from "../../../providers/authentication";
import { HOME_PAGE_SEO } from "../../../seo/home";

/** Загруженные данные главной и выбор публичной оболочки вместо кабинета. */
interface HomePageContentProps {
  data: HomePageData;
  isPublic?: boolean;
}

/** Связывает секции главной с регистрацией и переходом в кабинет после входа. */
export function HomePageContent({
  data,
  isPublic = false,
}: HomePageContentProps) {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { openLogin, openRegistration } = useAuthentication();

  useEffect(() => {
    if (isPublic && !isLoading && user) {
      router.replace("/landing");
    }
  }, [isPublic, isLoading, user, router]);

  /** Открывает прежнюю общую регистрацию без предустановленной роли или тарифа. */
  function register() {
    openRegistration();
  }

  return (
    <>
      {isPublic && (
        <SiteHeader
          onOpenLogin={openLogin}
          onOpenRegister={register}
        />
      )}
      <HomeLanding
        content={data.content}
        news={data.news}
        blog={data.blog}
        heroTitle={HOME_PAGE_SEO.title}
        heroDescription={HOME_PAGE_SEO.description}
        articleBasePath={isPublic ? "" : "/landing"}
        notifications={
          <LandingNotifications
            isAuthenticated={Boolean(user)}
            onRegister={register}
          />
        }
        pricing={data.plans.length > 0 ? (
          <LandingPricing
            content={data.content.pricing_content}
            plans={data.plans}
            onSelectPlan={register}
          />
        ) : null}
        invitation={<LandingInvitation onRegister={register} />}
        footer={<SiteFooter onOpenRegister={register} />}
      />
    </>
  );
}
