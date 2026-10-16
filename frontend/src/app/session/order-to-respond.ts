/** Ключ публичного заказа, к которому исполнитель вернётся после входа. */
const ORDER_TO_RESPOND_KEY = "pendingOrderUuid";

/** Запоминает заказ, открытый гостем, чтобы вернуть к нему после входа. */
export function rememberOrderToRespond(uuid: string) {
  try {
    sessionStorage.setItem(ORDER_TO_RESPOND_KEY, uuid);
  } catch {
    // Браузер запретил хранилище: после входа откроется стартовая страница роли.
  }
}

/** Читает запомненный заказ; без доступа к хранилищу заказа нет. */
export function readOrderToRespond(): string | null {
  try {
    return sessionStorage.getItem(ORDER_TO_RESPOND_KEY);
  } catch {
    return null;
  }
}

/** Забывает запомненный заказ. */
export function forgetOrderToRespond() {
  try {
    sessionStorage.removeItem(ORDER_TO_RESPOND_KEY);
  } catch {
    // Браузер запретил хранилище: забывать нечего.
  }
}
