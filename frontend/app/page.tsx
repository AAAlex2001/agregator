import styles from "./page.module.scss";
import type { Metadata } from "next";
import {
	getAdvantages,
	getFaq,
	getHowItWorksSteps,
	getIndustries,
	getKeyAdvantagesSteps,
	getOrders,
	getReviews,
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

export const dynamic = "force-static";

export default function LandingPage() {
	const howItWorksSteps = getHowItWorksSteps();
	const keyAdvantagesSteps = getKeyAdvantagesSteps();
	const orders = getOrders();
	const industries = getIndustries();
	const reviews = getReviews();
	const faq = getFaq();
	const advantages = getAdvantages();

	return (
		<>
			<LandingHeader />
			<div className={styles.page}>
				<main>
					<LandingHero />
					<LandingHowItWorks clientSteps={howItWorksSteps.client} expertSteps={howItWorksSteps.expert} />
					<LandingKeyAdvantages clientSteps={keyAdvantagesSteps.client} expertSteps={keyAdvantagesSteps.expert} />
					<LandingOrders orders={orders} />
					<LandingAdvantages features={advantages} />
					<LandingIndustryDirections industries={industries} />
					<LandingReviews reviews={reviews} />
					<LandingFaq items={faq} />
				</main>
				<LandingCtaFooter />
				<LandingFooter />
			</div>
		</>
	);
}
