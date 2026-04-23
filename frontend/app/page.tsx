import ReactDOM from "react-dom";
import styles from "./page.module.scss";
import type { Metadata } from "next";
import {
	LandingAdvantages,
	LandingCtaFooter,
	LandingFaq,
	LandingFooter,
	LandingHeader,
	LandingHero,
	LandingHowItWorks,
	LandingIndustryDirections,
	LandingKeyAdvantages,
	LandingOrders,
	LandingReviews,
	loadLandingSnapshot,
} from "@/source/widgets/landing";

export const metadata: Metadata = {
	title: "Промышленная безопасность — платформа экспертов и заказов",
	description:
		"Единая площадка для поиска аттестованных экспертов промышленной безопасности. Размещайте заказы, находите проекты, общайтесь и работайте напрямую.",
	alternates: {
		canonical: "/",
	},
	openGraph: {
		title: "Платформа экспертов промышленной безопасности",
		description:
			"Размещайте заказы и находите проекты среди специалистов по всей России. Аттестации Ростехнадзора, рейтинг и отзывы.",
		type: "website",
		url: "/",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export const dynamic = "force-dynamic";

export default async function LandingPage() {
	ReactDOM.preload("/hero_svg.webp", { as: "image", fetchPriority: "high" });

	const { hero, sectionHeaders, howItWorks, keyAdvantages, orders, advantages, industries, reviews, faq } =
		await loadLandingSnapshot();

	return (
		<>
			<LandingHeader />
			<div className={styles.page}>
				<main>
					<LandingHero
						title={hero.title}
						subtitle={hero.subtitle}
						buttonText={hero.buttonText}
					/>
					<LandingHowItWorks
						clientSteps={howItWorks.client}
						expertSteps={howItWorks.expert}
						title={sectionHeaders.howItWorks.title}
						subtitle={sectionHeaders.howItWorks.subtitle}
					/>
					<LandingKeyAdvantages
						clientSteps={keyAdvantages.client}
						expertSteps={keyAdvantages.expert}
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
					<LandingFaq
						items={faq}
						title={sectionHeaders.faq.title}
						subtitle={sectionHeaders.faq.subtitle}
					/>
				</main>
				<LandingCtaFooter />
				<LandingFooter />
			</div>
		</>
	);
}
