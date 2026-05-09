import { DocContent, DocToc } from "@/source/shared/ui";
import Title from "@/source/shared/ui/Typography/Title";
import { offerIntro, offerSections } from "../model/offer.data";
import { offerToc } from "../model/offer.toc";
import styles from "./offer.module.scss";

const Offer = () => {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <Title as="h1" text="Публичная оферта" className={styles.title} />
          <p className={styles.intro}>{offerIntro}</p>
        </header>

        <div className={styles.grid}>
          <DocContent sections={offerSections} className={styles.content} />
          <DocToc items={offerToc} className={styles.toc} />
        </div>
      </div>
    </main>
  );
};

export default Offer;
