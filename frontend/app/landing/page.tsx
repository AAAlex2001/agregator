import styles from "./page.module.scss";
import Header from "./header/Header";
import Hero from "./hero/Hero";
import IndustryDirections from "./industry-directions/IndustryDirections";
import HowItWorks from "./how-it-works/HowItWorks";
import Orders from "./orders/Orders";
import Advantages from "./advantages/Advantages";
import Reviews from "./reviews/Reviews";
import FAQ from "./FAQ/FAQ";
import Footer from "./footer/Footer";

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <Hero />
        <Advantages />
        <HowItWorks />
        <Orders />
        <IndustryDirections />
        <Reviews />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

