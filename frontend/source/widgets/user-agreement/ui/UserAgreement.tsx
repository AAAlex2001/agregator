import { DocContent, DocToc } from "@/source/shared/ui";
import Title from "@/source/shared/ui/Typography/Title";
import { userAgreementIntro, userAgreementSections } from "../model/user-agreement.data";
import { userAgreementToc } from "../model/user-agreement.toc";
import styles from "./user-agreement.module.scss";

const UserAgreement = () => {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <Title as="h1" text="Пользовательское соглашение" className={styles.title} />
          <p className={styles.intro}>{userAgreementIntro}</p>
        </header>

        <div className={styles.grid}>
          <DocContent sections={userAgreementSections} className={styles.content} />
          <DocToc items={userAgreementToc} className={styles.toc} />
        </div>
      </div>
    </main>
  );
};

export default UserAgreement;
