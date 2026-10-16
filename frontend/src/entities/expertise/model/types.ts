/** Коды объектов экспертизы, которые API сохраняет в удостоверении или лицензии. */
export type ExpertiseType = "КЛ" | "ТП" | "КЛ/ТП" | "ЗС" | "ТУ" | "Д" | "ОБ";

/** Удостоверение эксперта; строковые коды сохраняются в API без переименования. */
export interface ExpertCertificate {
  area: string;
  object: string;
  category: string;
  expires_at?: string | null;
}

/** Редактируемый список удостоверений для регистрации и профиля эксперта. */
export interface ExpertiseProfileValues {
  certificates: ExpertCertificate[];
}

/** Область аттестации: код для API и полное название для пользователя. */
export interface AttestationArea {
  value: string;
  name: string;
}

/** Поля формы добавления удостоверения в анкету эксперта. */
export interface CertificateFields {
  area: string;
  object: string;
  category: string;
  expiresAt: string;
}

/** Объект экспертизы и области аттестации, в которых он доступен. */
export interface ExpertiseCodeGroup {
  type: ExpertiseType;
  areas: string[];
}

