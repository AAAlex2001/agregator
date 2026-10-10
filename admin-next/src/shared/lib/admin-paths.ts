export const LOGIN_PATH = "/login";

export const DASHBOARD_PATH = "/";

export const ORDERS_PATH = "/orders";

export const ACCOUNTS_PATH = "/accounts";

export const ARTICLES_PATH = "/articles";

export const NEW_ARTICLE_PATH = "/articles/new";

export const TAGS_PATH = "/tags";

export const RTN_PATH = "/rtn";

export const NEW_RTN_PATH = "/rtn/new";

export const RTN_QUESTIONS_PATH = "/rtn/questions";

export const RTN_CHANGE_REPORTS_PATH = "/rtn/change-reports";

export const LEADS_PATH = "/leads";

export const CONTACT_DEALS_PATH = "/contact-deals";

/** Адрес профиля учётной записи. */
export const accountPath = (id: number) => `${ACCOUNTS_PATH}/${id}`;

/** Адрес редактирования статьи. */
export const articlePath = (id: number) => `${ARTICLES_PATH}/${id}`;

/** Адрес редактирования разъяснения. */
export const rtnPath = (id: number) => `${RTN_PATH}/${id}`;

/** Адрес нового разъяснения, заранее заполненного текстом вопроса посетителя. */
export const rtnFromQuestionPath = (questionId: number) => `${NEW_RTN_PATH}?fromQuestion=${questionId}`;

/** Адрес карточки сделки по покупке контактов. */
export const contactDealPath = (id: number) => `${CONTACT_DEALS_PATH}/${id}`;
