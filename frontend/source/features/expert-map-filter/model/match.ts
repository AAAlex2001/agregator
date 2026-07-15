function objectsOverlap(codeObject: string, selected: string[]): boolean {
  const codeParts = codeObject.split("/");
  for (const choice of selected) {
    for (const part of choice.split("/")) {
      if (codeParts.includes(part)) return true;
    }
  }
  return false;
}

export function certificateMatches(code: string, areas: string[], objects: string[]): boolean {
  const [area, object] = code.split(" ");
  if (!area || !object) return false;
  const areaOk = areas.length === 0 || areas.includes(area);
  const objectOk = objects.length === 0 || objectsOverlap(object, objects);
  return areaOk && objectOk;
}

export function expertMatches(codes: string[], areas: string[], objects: string[]): boolean {
  if (areas.length === 0 && objects.length === 0) return true;
  return codes.some((code) => certificateMatches(code, areas, objects));
}
