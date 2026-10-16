/** Работа от своего имени либо от экспертной организации; эти значения принимает API. */
export type ForensicWorkplaceKind = "INDIVIDUAL" | "ORGANIZATION";

/** Редактируемые сведения судебного эксперта, отдельно от прикреплённых файлов. */
export interface ForensicProfileValues {
  education: string;
  extra_education: string;
  has_similar_experience: boolean;
  has_degree: boolean;
  degree: string;
  city: string;
  workplace_kind: ForensicWorkplaceKind;
  workplace_name: string;
}

/** Загруженный документ, который показываем в анкете по имени и адресу файла. */
export interface ForensicDocument {
  name: string;
  url: string;
}

/** Полная анкета из API: поля, заменяемый диплом и дополнительные документы. */
export interface ForensicProfile extends ForensicProfileValues {
  education_diploma: ForensicDocument | null;
  documents: ForensicDocument[];
}
