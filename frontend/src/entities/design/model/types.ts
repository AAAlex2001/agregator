/** Поля анкеты проектировщика, редактируемые при регистрации и в настройках. */
export interface DesignProfileValues {
  education: string;
  specialties: string[];
  nok_passed: boolean;
  nrs_number: string;
  sro_gip_declared: boolean;
  qualification_courses: string;
  rtn_areas: string[];
}

/** Сохранённый на сервере документ: имя для галереи и адрес файла. */
export interface DesignDocument {
  name: string;
  url: string;
}

/** Пять групп подтверждающих документов, сохраняемых отдельно от полей анкеты. */
export interface DesignProfileDocuments {
  education_documents: DesignDocument[];
  nok_documents: DesignDocument[];
  nrs_documents: DesignDocument[];
  qualification_documents: DesignDocument[];
  rtn_documents: DesignDocument[];
}

/** Полная анкета проектировщика из API вместе с загруженными документами. */
export interface DesignProfile extends DesignProfileValues, DesignProfileDocuments {}

/** Значение параметра group в запросах загрузки и удаления документов. */
export type DesignDocumentGroup = "education" | "nok" | "nrs" | "qualification" | "rtn";

/** Вариант справочника: code отправляется в API, title отображается в форме. */
export interface DesignOption {
  code: string;
  title: string;
}

/** Специальность проектирования с сокращением для подписи в списке. */
export interface DesignSpecialty extends DesignOption {
  short: string;
}

/** Доступные специальности и области РТН для заполнения анкеты. */
export interface DesignOptions {
  specialties: DesignSpecialty[];
  rtn_areas: DesignOption[];
}

/** Справочники для условий заказа на проектирование, полученные от API. */
export interface DesignOrderOptions {
  specialties: DesignSpecialty[];
  doc_categories: DesignOption[];
  documentation_kinds: DesignOption[];
  approvals: DesignOption[];
}

/** Специальность на карте и виды документации, с которыми она связана. */
export interface DesignMapSpecialty {
  key: string;
  code: string;
  title: string;
  categories: string[];
}
