/** Данные заявки посетителя, которые принимает публичный API. */
export interface LeadRequest {
  direction: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  inn: string;
  region: string;
  work_kinds: string;
  object_name: string;
  task: string;
  deadline: string;
  budget: string;
  source_url: string;
}

/** Направление заявки с подсказками, вариантами работ и материалами страницы. */
export interface LeadDirection {
  value: string;
  label: string;
  hint: string;
  href: string;
  image: string;
  video: string;
  taskPlaceholder: string;
  objectPlaceholder: string;
  kinds: string[];
}
