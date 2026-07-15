export const FILTER_OBJECTS = ["КЛ", "ТП", "ТУ", "ЗС", "Д", "ОБ"] as const;

export function certificateMatches(code: string, areas: string[], objects: string[]): boolean {
  const [area, object] = code.split(" ");
  if (!area || !object) return false;
  const areaOk = areas.length === 0 || areas.includes(area);
  const objectOk = objects.length === 0 || object.split("/").some((part) => objects.includes(part));
  return areaOk && objectOk;
}

export function expertMatches(codes: string[], areas: string[], objects: string[]): boolean {
  if (areas.length === 0 && objects.length === 0) return true;
  return codes.some((code) => certificateMatches(code, areas, objects));
}
