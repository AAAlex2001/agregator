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
import CtaFooter from "./footer/CtaFooter";
import KeyAdvantages from "./key-advantages/KeyAdvantages";


export default function LandingPage() {
  return (
    <>
      <Header />
      <div className={styles.page}>
        <main className={styles.main}>
          <Hero />
          <Advantages />
          <IndustryDirections />
          <HowItWorks />
          <Orders />
          <KeyAdvantages />
          <Reviews />
          <FAQ />
        </main>
      <CtaFooter />
      <Footer />
      </div>
    </>
  );
}

