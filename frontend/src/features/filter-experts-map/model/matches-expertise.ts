/** Проверяет общую часть составных объектов, например КЛ и КЛ/ТП. */
function objectsOverlap(object: string, selected: string[]): boolean {
  const parts = object.split("/");

  return selected.some((choice) => (
    choice.split("/").some((part) => parts.includes(part))
  ));
}

/** Проверяет область и объект одного удостоверения по выбранным фильтрам. */
function certificateMatches(
  code: string,
  areas: string[],
  objects: string[],
): boolean {
  const [area, object] = code.split(" ");

  if (!area || !object) {
    return false;
  }

  const matchesArea = areas.length === 0 || areas.includes(area);
  const matchesObject = objects.length === 0 || objectsOverlap(object, objects);

  return matchesArea && matchesObject;
}

/** Оставляет эксперта, если хотя бы одно удостоверение подходит под оба фильтра. */
export function matchesExpertise(
  codes: string[],
  areas: string[],
  objects: string[],
): boolean {
  if (areas.length === 0 && objects.length === 0) {
    return true;
  }

  return codes.some((code) => certificateMatches(code, areas, objects));
}
