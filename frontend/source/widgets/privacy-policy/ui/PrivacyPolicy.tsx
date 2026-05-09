import { DocContent, DocToc } from "@/source/shared/ui";
import Title from "@/source/shared/ui/Typography/Title";
import { privacyPolicyIntro, privacyPolicySections } from "../model/privacy-policy.data";
import { privacyPolicyToc } from "../model/privacy-policy.toc";
import styles from "./privacy-policy.module.scss";

const PrivacyPolicy = () => {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <Title as="h1" text="Политика конфиденциальности" className={styles.title} />
          <p className={styles.intro}>{privacyPolicyIntro}</p>
        </header>

        <div className={styles.grid}>
          <DocContent sections={privacyPolicySections} className={styles.content} />
          <DocToc items={privacyPolicyToc} className={styles.toc} />
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
