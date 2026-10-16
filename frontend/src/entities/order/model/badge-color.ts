/** Цвет требования в списке заказов; неизвестный цвет отображается синим. */
export function getOrderBadgeColor(variant: string): string {
  const color = variant.toLowerCase();

  switch (color) {
    case "blue":
    case "green":
    case "gray":
    case "orange":
    case "brown":
    case "purple":
      return color;
    default:
      return "blue";
  }
}
