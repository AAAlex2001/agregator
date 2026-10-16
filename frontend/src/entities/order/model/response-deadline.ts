/** Проверяет, закончился ли указанный заказчиком срок приёма откликов. */
export function isResponsesClosed(deadline: string | null): boolean {
  return deadline !== null && new Date(deadline).getTime() <= Date.now();
}
