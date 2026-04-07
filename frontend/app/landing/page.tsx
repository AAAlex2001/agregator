import styles from "./page.module.scss";
import Header from "@/widgets/header/Header";
import Hero from "@/widgets/landing-hero/Hero";
import IndustryDirections from "@/widgets/landing-industry-directions/IndustryDirections";
import HowItWorks from "@/widgets/landing-how-it-works/HowItWorks";
import Orders from "@/widgets/landing-orders/Orders";
import Advantages from "@/widgets/landing-advantages/Advantages";
import Reviews from "@/widgets/landing-reviews/Reviews";
import FAQ from "@/widgets/landing-faq/FAQ";
import Footer from "@/widgets/footer/Footer";
import CtaFooter from "@/widgets/footer/CtaFooter";
import KeyAdvantages from "@/widgets/landing-key-advantages/KeyAdvantages";

import type { Metadata } from "next";
import {
  getAdvantages,
  getFaq,
  getHowItWorksSteps,
  getIndustries,
  getKeyAdvantagesSteps,
  getOrders,
  getReviews,
} from "@/shared/config/landing.data";

export const metadata: Metadata = {
  title: "Промышленная безопасность — платформа экспертов и заказов",
  description:
    "Единая площадка для поиска аттестованных экспертов промышленной безопасности. Размещайте заказы, находите проекты, общайтесь и работайте напрямую.",
  alternates: {
    canonical: "/landing",
  },
  openGraph: {
    title: "Платформа экспертов промышленной безопасности",
    description:
      "Размещайте заказы и находите проекты среди специалистов по всей России. Аттестации Ростехнадзора, рейтинг и отзывы.",
    type: "website",
    url: "/landing",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const [howItWorksSteps, keyAdvantagesSteps, orders, industries, reviews, faq, advantages] = await Promise.all([
    getHowItWorksSteps(),
    getKeyAdvantagesSteps(),
    getOrders(),
    getIndustries(),
    getReviews(),
    getFaq(),
    getAdvantages(),
  ]);

  return (
    <>
      <Header />
      <div className={styles.page}>
        <main className={styles.main}>
          <Hero />
          <HowItWorks clientSteps={howItWorksSteps.client} expertSteps={howItWorksSteps.expert} />
          <KeyAdvantages clientSteps={keyAdvantagesSteps.client} expertSteps={keyAdvantagesSteps.expert} />
          <Orders orders={orders} />
          <Advantages features={advantages} />
          <IndustryDirections industries={industries} />
          <Reviews reviews={reviews} />
          <FAQ items={faq} />
        </main>
      <CtaFooter />
      <Footer />
      </div>
    </>
  );
}

