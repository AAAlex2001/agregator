import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { toUserRole } from "@/entities/user";
import { COOKIE_CONSENT_NAME, CookiesBanner } from "@/features/accept-cookies";
import { Analytics } from "./analytics";
import { AppProviders } from "./providers";
import { SITE_METADATA } from "./seo/site-metadata";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/900.css";
import "@fontsource/montserrat/400-italic.css";
import "@/shared/styles/colors.css";
import "./globals.css";

export const metadata = SITE_METADATA;

/** Содержимое текущего маршрута приложения. */
interface RootLayoutProps {
  children: ReactNode;
}

/** Подключает общие стили, сессию, авторизацию, согласие на cookie и аналитику. */
export default async function RootLayout({ children }: RootLayoutProps) {
  const cookieStore = await cookies();
  const initialRole = toUserRole(cookieStore.get("user_role")?.value);
  const cookiesAccepted = cookieStore.get(COOKIE_CONSENT_NAME)?.value === "true";

  return (
    <html
      lang="ru"
      data-scroll-behavior="smooth"
    >
      <body className="antialiased">
        <AppProviders initialRole={initialRole}>{children}</AppProviders>
        {!cookiesAccepted && <CookiesBanner />}
        <Analytics />
      </body>
    </html>
  );
}
