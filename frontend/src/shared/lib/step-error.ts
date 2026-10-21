import { ApiError } from "@/shared/api/response-error";

/** Где поле запроса в форме: путь или его начало, шаг и название поля для текста ошибки. */
export interface FieldPlace<Step extends string> {
  path: string;
  step: Step;
  label: string;
}

/** Ошибка, привязанная к шагу формы. Шага нет, если сервер не назвал поле. */
export interface StepError<Step extends string> {
  step: Step | null;
  message: string;
}

/** Текст ошибки с шагом: «Шаг «Заказчик»: ИНН — 10 или 12 цифр». */
export function withStep(title: string, message: string): string {
  return `Шаг «${title}»: ${message}`;
}

/** Место поля по пути: точное совпадение или самое длинное начало пути. */
function placeOf<Step extends string>(
  path: string,
  places: FieldPlace<Step>[],
): FieldPlace<Step> | undefined {
  const matching = places.filter((place) => (
    path === place.path || path.startsWith(`${place.path}.`)
  ));

  return matching.sort((first, second) => second.path.length - first.path.length)[0];
}

/** Ошибка запроса с шагом, где её исправить: первое поле, которое нашлось в форме. */
export function toStepError<Step extends string>(
  error: unknown,
  places: FieldPlace<Step>[],
  titleOf: (step: Step) => string,
  fallback: string,
): StepError<Step> {
  if (!(error instanceof Error)) {
    return { step: null, message: fallback };
  }

  const fields = error instanceof ApiError ? error.fields : [];

  for (const field of fields) {
    const place = placeOf(field.path, places);

    if (place) {
      const message = field.needsLabel ? `${place.label}: ${field.message}` : field.message;

      return { step: place.step, message: withStep(titleOf(place.step), message) };
    }
  }

  return { step: null, message: error.message || fallback };
}