/** Редактируемые поля анкеты эколога для регистрации и настройки профиля. */
export interface EcologyProfileValues {
  work_types: string[];
  practical_skills: string;
}

/** Документ анкеты, уже загруженный на сервер. */
export interface EcologyDocument {
  name: string;
  url: string;
}

/** Сохранённая анкета эколога из API: поля специалиста и его документы. */
export interface EcologyProfile extends EcologyProfileValues {
  documents: EcologyDocument[];
}

/** Один доступный вид экологических работ в списке выбора. */
export interface EcologyWorkType {
  code: string;
  title: string;
}

/** Справочники из API для заполнения анкеты эколога. */
export interface EcologyOptions {
  work_types: EcologyWorkType[];
}
