/** Редактируемые поля изыскателя для регистрации и настройки анкеты, без файлов. */
export interface SurveyProfileValues {
  education: string;
  kinds: string[];
  kinds_other: string;
  nok_passed: boolean;
  nrs_number: string;
  sro_gip_declared: boolean;
  qualification_courses: string;
  rtn_areas: string[];
}

/** Уже загруженный файл анкеты; URL также используется для удаления документа. */
export interface SurveyDocument {
  name: string;
  url: string;
}

/** Сохранённые документы, разделённые по пяти группам квалификации. */
export interface SurveyProfileDocuments {
  education_documents: SurveyDocument[];
  nok_documents: SurveyDocument[];
  nrs_documents: SurveyDocument[];
  qualification_documents: SurveyDocument[];
  rtn_documents: SurveyDocument[];
}

/** Полный ответ API: сведения об изыскателе и сохранённые документы. */
export interface SurveyProfile extends SurveyProfileValues, SurveyProfileDocuments {}

/** Значения параметра group при загрузке и удалении документа изыскателя. */
export type SurveyDocumentGroup = "education" | "nok" | "nrs" | "qualification" | "rtn";

/** Вариант из справочника: код отправляется в API, название видно в списке. */
export interface SurveyOption {
  code: string;
  title: string;
}

/** Вид изысканий с коротким обозначением для списка выбора. */
export interface SurveyKind extends SurveyOption {
  short: string;
}

/** Доступные виды изысканий и области аттестации, полученные из API. */
export interface SurveyOptions {
  kinds: SurveyKind[];
  rtn_areas: SurveyOption[];
}

/** Специалист на карте и код вида изысканий, по которому он находится в API. */
export interface SurveyMapSpecialist {
  key: string;
  title: string;
  kind: string;
}
