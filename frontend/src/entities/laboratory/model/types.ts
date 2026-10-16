/** Редактируемые сведения лаборатории для регистрации и настройки профиля. */
export interface LaboratoryProfileValues {
  accreditation_area: string;
  comment: string;
}

/** Ответ API содержит те же два текстовых поля; файлов и справочников здесь нет. */
export type LaboratoryProfile = LaboratoryProfileValues;
