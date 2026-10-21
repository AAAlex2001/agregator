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

export const POSTS_PATH = "/posts";

export const POST_REPORTS_PATH = "/posts/reports";

/** Адрес публикации для модератора. */
export const postPath = (id: number) => `${POSTS_PATH}/${id}`;

/** Публикации и черновики выбранного пользователя. */
export const accountPostsPath = (id: number) => `${ACCOUNTS_PATH}/${id}/posts`;

export const BLITZ_PATH = "/blitz";

export const BLITZ_INVOICES_PATH = "/blitz/invoices";

export const BLITZ_TARIFFS_PATH = "/blitz/tariffs";

/** Адрес заявки Блиц-эксперта. */
export const blitzOrderPath = (id: number) => `${BLITZ_PATH}/${id}`;
