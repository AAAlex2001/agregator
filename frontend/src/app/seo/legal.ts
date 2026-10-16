import type { Metadata } from "next";

/** Метаданные публичной оферты. */
export const OFFER_METADATA: Metadata = {
  title: "Публичная оферта — Ресурс Плюс",
  description:
    "Публичная оферта ООО «НПИ «Недра» на предоставление услуг сервиса Ресурс-Плюс.",
  alternates: {
    canonical: "/offer",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/** Метаданные согласия на обработку персональных данных. */
export const PERSONAL_DATA_CONSENT_METADATA: Metadata = {
  title: "Согласие на обработку персональных данных — Ресурс-Плюс",
  description:
    "Согласие пользователя сайта plus-resurs.com на обработку персональных данных "
    + "ООО «НПИ «Недра» в соответствии с Федеральным законом № 152-ФЗ "
    + "«О персональных данных».",
  alternates: {
    canonical: "/personal-data-consent",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/** Метаданные политики конфиденциальности. */
export const PRIVACY_POLICY_METADATA: Metadata = {
  title: "Политика конфиденциальности — Ресурс Плюс",
  description:
    "Политика конфиденциальности сайта plus-resurs.com — какие персональные данные "
    + "собирает ООО «НПИ «Недра», как они обрабатываются и защищаются, ваши права.",
  alternates: {
    canonical: "/privacy-policy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/** Метаданные страницы реквизитов компании. */
export const REQUISITES_METADATA: Metadata = {
  title: "Реквизиты компании — Ресурс Плюс",
  description:
    "Официальные реквизиты ООО «НПИ «Недра»: ИНН, ОГРН, банковские реквизиты, лицензии.",
  alternates: {
    canonical: "/requisites",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/** Метаданные пользовательского соглашения. */
export const USER_AGREEMENT_METADATA: Metadata = {
  title: "Пользовательское соглашение — Ресурс Плюс",
  description:
    "Пользовательское соглашение сайта plus-resurs.com — условия использования сервиса.",
  alternates: {
    canonical: "/user-agreement",
  },
  robots: {
    index: true,
    follow: true,
  },
};
