/** Ответ подсказки компании: value — название для поля, data — реквизиты для API регистрации. */
export interface CompanySuggestion {
  value: string;
  unrestricted_value: string;
  data: {
    inn?: string | null;
    kpp?: string | null;
    ogrn?: string | null;
    name?: {
      full_with_opf?: string | null;
      short_with_opf?: string | null;
      full?: string | null;
      short?: string | null;
      latin?: string | null;
    } | null;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}
