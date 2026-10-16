/** Поля анкеты кадастрового инженера, редактируемые при регистрации и в кабинете. */
export interface CadastralProfileValues {
  education: string;
  registry_joined_at: string | null;
  certificate_number: string | null;
  registry_number: string | null;
  has_equipment: boolean;
  city: string;
  workplace: string;
}

/** Файл, уже сохранённый сервером и доступный по указанному URL. */
export interface CadastralDocument {
  name: string;
  url: string;
}

/** Ответ API с полями инженера, одиночными файлами и дополнительными документами. */
export interface CadastralProfile extends CadastralProfileValues {
  education_diploma: CadastralDocument | null;
  certificate_file: CadastralDocument | null;
  documents: CadastralDocument[];
}
