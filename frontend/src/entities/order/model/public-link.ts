/** Собирает публичную ссылку заказа для текущего адреса приложения. */
export function getOrderPublicLink(publicId: string, origin: string): string {
  return `${origin}/order/${publicId}`;
}
