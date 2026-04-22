import { DocContent, DocToc } from "@/source/shared/ui";
import Title from "@/source/shared/ui/Typography/Title";
import { LandingHeader, LandingFooter } from "@/source/widgets/landing";
import { requisitesIntro, requisitesSections } from "../model/requisites.data";
import { requisitesToc } from "../model/requisites.toc";
import styles from "./requisites.module.scss";

const Requisites = () => {
  return (
    <>
      <LandingHeader />
      <main className={styles.page}>
        <div className={styles.container}>
          <header className={styles.header}>
            <Title as="h1" text="Реквизиты компании" className={styles.title} />
            <p className={styles.intro}>{requisitesIntro}</p>
          </header>

          <div className={styles.grid}>
            <DocContent sections={requisitesSections} className={styles.content} />
            <DocToc items={requisitesToc} className={styles.toc} />
          </div>
        </div>
      </main>
      <LandingFooter variant="light" />
    </>
  );
};

export default Requisites;
