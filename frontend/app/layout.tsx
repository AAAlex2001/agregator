import type { Metadata } from "next";
import { cookies } from "next/headers";
import Script from "next/script";
import { SITE_URL } from "@/source/shared/api/config";
import { NotificationProvider } from "@/source/shared/ui/Notifications";
import { CookiesBanner } from "@/source/widgets/cookies-banner";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "./globals.css";

const YANDEX_METRIKA_ID = 108708847;
const GOOGLE_TAG_ID = "G-QGC88WQWTJ";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Экспертиза промышленной безопасности ОПО | Ресурс-Плюс",
    template: "%s | Ресурс-Плюс",
  },
  description:
    "Платформа для заказа экспертизы промышленной безопасности опасных производственных объектов. Аттестованные эксперты Ростехнадзора, прозрачные тендеры, договоры, отчёты в PDF.",
  keywords: [
    "экспертиза промышленной безопасности",
    "ЭПБ",
    "эксперты промышленной безопасности",
    "тендерная площадка",
    "тендерная площадка экспертиза промышленной безопасности",
    "экспертиза ОПО",
    "опасные производственные объекты",
    "Ростехнадзор",
    "аттестованные эксперты Ростехнадзора",
    "аттестация экспертов",
    "промышленная безопасность",
    "тендеры на экспертизу",
    "обследование диагностирование экспертиза",
    "техническое диагностирование",
    "экспертиза зданий и сооружений",
    "экспертиза технических устройств",
    "экспертиза документации ОПО",
    "Ресурс-Плюс",
  ],
  applicationName: "Ресурс-Плюс",
  authors: [{ name: "Ресурс-Плюс" }],
  category: "industrial safety",
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: "website",
    siteName: "Ресурс-Плюс",
    locale: "ru_RU",
    title: "Экспертиза промышленной безопасности ОПО | Ресурс-Плюс",
    description:
      "Найдите аттестованного эксперта Ростехнадзора или разместите заказ на экспертизу промышленной безопасности. Тендеры, отзывы, отчёты в PDF.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Ресурс-Плюс" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Экспертиза промышленной безопасности ОПО | Ресурс-Плюс",
    description:
      "Платформа для тендеров на экспертизу промышленной безопасности. Аттестованные эксперты Ростехнадзора.",
    images: ["/og-default.png"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookiesAccepted = cookieStore.get("cookies_accepted")?.value === "true";

  return (
    <html lang="ru">
      <body className="antialiased">
        <noscript>
          <div>
            <img
              src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
        <NotificationProvider>
          {children}
        </NotificationProvider>
        {!cookiesAccepted && <CookiesBanner />}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_TAG_ID}');
          `}
        </Script>
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {
                if (document.scripts[j].src === r) {
                  return;
                }
              }
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);
            })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_ID}', 'ym');

            window.dataLayer = window.dataLayer || [];
            ym(${YANDEX_METRIKA_ID}, 'init', {
              ssr: true,
              webvisor: true,
              clickmap: true,
              ecommerce: 'dataLayer',
              referrer: document.referrer,
              url: location.href,
              accurateTrackBounce: true,
              trackLinks: true
            });
          `}
        </Script>
      </body>
    </html>
  );
}
