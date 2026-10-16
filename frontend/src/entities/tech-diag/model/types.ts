/** Поля анкеты специалиста НК для регистрации и редактирования профиля. */
export interface TechDiagProfileValues {
  qualification_certificates: string;
  methods: string[];
  control_objects: string[];
}

/** Загруженный документ специалиста: отображаемое имя и адрес файла. */
export interface TechDiagDocument {
  name: string;
  url: string;
}

/** Полная анкета специалиста НК из API с подтверждающими документами. */
export interface TechDiagProfile extends TechDiagProfileValues {
  documents: TechDiagDocument[];
}

/** Анкета лаборатории НК: выполняемые виды контроля и город организации. */
export interface TechDiagHolderProfile {
  methods: string[];
  organization_city: string;
}

/** Вариант справочника НК: код сохраняется в анкете, название выводится в списке. */
export interface TechDiagOption {
  code: string;
  title: string;
}

/** Справочники видов и объектов контроля, полученные из API. */
export interface TechDiagOptions {
  methods: TechDiagOption[];
  control_objects: TechDiagOption[];
}
