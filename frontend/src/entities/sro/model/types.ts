/** Направление членства СРО, определяющее подписи формы и адрес API. */
export type SroDirection = "design" | "survey";
/** Способ расчёта стоимости услуг в формате API. */
export type SroPricingKind = "PERCENT" | "FIXED" | "NEGOTIABLE";

/** Дополнительный документ члена СРО, уже сохранённый на сервере. */
export interface SroDocument {
  name: string;
  url: string;
}

/** Поля формы члена СРО; числовые значения хранятся строками, пока пользователь вводит их. */
export interface SroProfileValues {
  sro_name: string;
  sro_registry_number: string;
  hazardous_objects_right: boolean;
  nuclear_objects_right: boolean;
  liability_level: string;
  pricing_kind: SroPricingKind;
  pricing_percent: string;
  pricing_fixed_amount: string;
}

/** Анкета члена СРО, подготовленная для формы, вместе с сохранёнными документами. */
export interface SroProfile extends SroProfileValues {
  documents: SroDocument[];
}

/** Данные для сохранения анкеты в API: уровень и стоимость передаются числами. */
export interface SroProfilePayload {
  sro_name: string;
  sro_registry_number: string;
  hazardous_objects_right: boolean;
  nuclear_objects_right: boolean;
  liability_level: number;
  pricing_kind: SroPricingKind;
  pricing_percent: number | null;
  pricing_fixed_amount: number | null;
}

/** Ответ API с числовыми значениями анкеты и списком её документов. */
export interface SroProfileResponse extends SroProfilePayload {
  documents: SroDocument[];
}
