import { DocContent } from "@/source/shared/ui";
import { Breadcrumbs } from "@/source/shared/ui/Breadcrumbs";
import Title from "@/source/shared/ui/Typography/Title";
import { consentIntro, consentSections } from "../model/consent.data";
import s from "./personal-data-consent.module.scss";

const PersonalDataConsent = () => {
  return (
    <main className={s.page}>
      <div className={s.container}>
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Согласие на обработку персональных данных" },
          ]}
        />
        <header className={s.header}>
          <Title
            as="h1"
            text="Согласие пользователя сайта на обработку персональных данных"
            className={s.title}
          />
          <p className={s.intro}>{consentIntro}</p>
        </header>

        <DocContent sections={consentSections} className={s.content} />
      </div>
    </main>
  );
};

export default PersonalDataConsent;
