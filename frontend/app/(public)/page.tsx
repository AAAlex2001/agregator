import styles from "./page.module.scss";
import type { Metadata } from "next";
import {
	LandingAdvantages,
	LandingArticlesPreview,
	// LandingComingSoon,
	LandingCtaFooter,
	LandingFooter,
	LandingHeader,
	LandingHero,
	LandingHowItWorks,
	LandingIndustryDirections,
	LandingKeyAdvantages,
	LandingNotificationsCta,
	LandingOrders,
	LandingReviews,
	LandingSearchBlock,
	LandingSeoText,
	LandingServiceFaq,
	LandingStructuredData,
	loadLandingSnapshot,
} from "@/source/widgets/landing";
import { PricingSection } from "@/source/widgets/pricing-section";
import { fetchPricingPlans } from "@/source/features/pricing/subscribe";
import { fetchArticleList } from "@/source/entities/article";
import { RedirectIfAuthed } from "@/source/features/session";

export const metadata: Metadata = {
	title: "Экспертиза промышленной безопасности ОПО — тендерная площадка",
	description:
		"Тендерная площадка экспертизы промышленной безопасности (ЭПБ) опасных производственных объектов. Аттестованные исполнители промышленной безопасности Ростехнадзора, обследование, диагностирование и экспертиза, прозрачный выбор исполнителя, отчёты в PDF.",
	keywords: [
		"экспертиза промышленной безопасности",
		"ЭПБ",
		"исполнители промышленной безопасности",
		"исполнитель промышленной безопасности",
		"исполнитель в области промышленной безопасности",
		"исполнитель по промышленной безопасности",
		"тендерная площадка",
		"тендерная площадка экспертиза промышленной безопасности",
		"тендер на экспертизу промышленной безопасности",
		"проведение экспертизы промышленной безопасности",
		"правила проведения экспертизы промышленной безопасности",
		"заключение экспертизы промышленной безопасности",
		"реестр заключений экспертизы промышленной безопасности",
		"реестр экспертиз промышленной безопасности",
		"реестр исполнителей промышленной безопасности",
		"объекты экспертизы промышленной безопасности",
		"лицензия на проведение экспертизы промышленной безопасности",
		"организации экспертизы промышленной безопасности",
		"аттестация исполнителей по промышленной безопасности",
		"категории исполнителей промышленной безопасности",
		"экспертиза промышленной безопасности ОПО",
		"экспертиза опасных производственных объектов",
		"найти исполнителя Ростехнадзора",
		"аттестованные исполнители Ростехнадзора",
		"обследование диагностирование экспертиза",
		"техническое диагностирование",
		"экспертиза зданий и сооружений",
		"экспертиза технических устройств",
		"экспертиза документации ОПО",
		"диагностика опасных производственных объектов",
		"регистрация заключения ЭПБ Ростехнадзор",
		"Ростехнадзор экспертиза",
	],
	alternates: { canonical: "/" },
	openGraph: {
		title: "Экспертиза промышленной безопасности ОПО | Ресурс-Плюс",
		description:
			"Найдите аттестованного исполнителя Ростехнадзора или разместите заказ на экспертизу промышленной безопасности (ЭПБ). Тендеры, отзывы, отчёты в PDF.",
		type: "website",
		url: "/",
		images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Ресурс-Плюс" }],
	},
	robots: { index: true, follow: true },
};

export const dynamic = "force-dynamic";

export default async function LandingPage() {
	const [
		{ hero, sectionHeaders, howItWorks, keyAdvantages, orders, advantages, industries, reviews, faq, pricingContent },
		pricingPlans,
		newsPage,
		blogPage,
	] = await Promise.all([
		loadLandingSnapshot(),
		fetchPricingPlans(),
		fetchArticleList({ kind: "news", limit: 3, offset: 0 }, { server: true }),
		fetchArticleList({ kind: "blog", limit: 3, offset: 0 }, { server: true }),
	]);

	return (
		<>
			<RedirectIfAuthed to="/landing" />
			<LandingStructuredData faq={faq} />
			<LandingHeader />
			<div className={styles.page}>
				<main>
					<LandingHero
						title={hero.title}
						subtitle={hero.subtitle}
						buttonText={hero.buttonText}
						bullets={hero.bullets}
					/>
					{/* <LandingComingSoon /> */}
					<LandingSearchBlock />
					<LandingNotificationsCta />
					<LandingHowItWorks
						clientSteps={howItWorks.client}
						expertSteps={howItWorks.expert}
						licenseHolderSteps={howItWorks.licenseHolder}
						title={sectionHeaders.howItWorks.title}
						subtitle={sectionHeaders.howItWorks.subtitle}
					/>
					<LandingKeyAdvantages
						clientSteps={keyAdvantages.client}
						expertSteps={keyAdvantages.expert}
						licenseHolderSteps={keyAdvantages.licenseHolder}
						title={sectionHeaders.keyAdvantages.title}
						subtitle={sectionHeaders.keyAdvantages.subtitle}
					/>
					<LandingOrders
						orders={orders}
						title={sectionHeaders.orders.title}
						subtitle={sectionHeaders.orders.subtitle}
					/>
					<LandingAdvantages features={advantages} />
					<LandingIndustryDirections
						industries={industries}
						title={sectionHeaders.industries.title}
						subtitle={sectionHeaders.industries.subtitle}
					/>
					<LandingReviews
						reviews={reviews}
						title={sectionHeaders.reviews.title}
						subtitle={sectionHeaders.reviews.subtitle}
					/>
					<LandingArticlesPreview
						title="Новости отрасли"
						subtitle="Что происходит в горной, нефтегазовой и других отраслях промышленности"
						ctaHref="/news"
						ctaLabel="Все новости"
						items={newsPage.items}
					/>
					<LandingArticlesPreview
						title="Блог платформы"
						subtitle="Развитие Ресурс-Плюс, кейсы и инструкции по работе с экспертизой"
						ctaHref="/blog"
						ctaLabel="Все статьи"
						items={blogPage.items}
					/>
					{pricingPlans.length > 0 ? (
						<PricingSection
							expert={{
								title: pricingContent.expertTitle,
								subtitle: pricingContent.expertSubtitle,
							}}
							customer={{
								title: pricingContent.customerTitle,
								subtitle: pricingContent.customerSubtitle,
							}}
							footnote={pricingContent.expertFootnote}
							plans={pricingPlans}
							customerHeadline={pricingContent.customerHeadline}
							customerFeatures={pricingContent.customerFeatures}
							customerFootnote={pricingContent.customerFootnote}
							customerCta={{ label: pricingContent.customerCtaLabel, href: pricingContent.customerCtaHref }}
							licenseHolder={{
								title: pricingContent.licenseHolderTitle,
								subtitle: pricingContent.licenseHolderSubtitle,
								headline: pricingContent.licenseHolderHeadline,
								features: pricingContent.licenseHolderFeatures,
								footnote: pricingContent.licenseHolderFootnote,
								cta: {
									label: pricingContent.licenseHolderCtaLabel,
									href: pricingContent.licenseHolderCtaHref,
								},
							}}
							redirectOnSelect="/register"
						/>
					) : null}
					<LandingServiceFaq
						items={faq}
						title={sectionHeaders.faq.title}
						subtitle={sectionHeaders.faq.subtitle}
						decoration
					/>
					<LandingSeoText />
				</main>
				<LandingCtaFooter />
				<LandingFooter />
			</div>
		</>
	);
}
