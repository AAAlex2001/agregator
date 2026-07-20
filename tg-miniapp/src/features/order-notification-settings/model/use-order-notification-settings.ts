import { useEffect, useReducer, useRef } from "react";
import { updateOrderNotifications } from "@/entites/profile";
import type { OrderWorkType } from "@/entites/order";
import { emitError } from "@/shared/services/error-bus";
import { createInitialState, orderNotificationSettingsReducer } from "./reducer";

type EngineeringWorkType = Exclude<OrderWorkType, "EXPERTISE">;

export function useOrderNotificationSettings(
  initialValue: string[],
  reloadProfile: () => Promise<void>,
) {
  const [state, dispatch] = useReducer(
    orderNotificationSettingsReducer,
    initialValue,
    createInitialState,
  );
  const confirmedRef = useRef(state.confirmed);
  const requestActiveRef = useRef(false);

  useEffect(() => {
    if (requestActiveRef.current) return;
    const next = Array.from(new Set(initialValue));
    confirmedRef.current = next;
    dispatch({ type: "sync", value: next });
  }, [initialValue]);

  const toggle = async (workType: EngineeringWorkType, enabled: boolean) => {
    if (requestActiveRef.current) return;

    const next = enabled
      ? Array.from(new Set([...state.selected, workType]))
      : state.selected.filter((item) => item !== workType);

    requestActiveRef.current = true;
    dispatch({ type: "optimistic", value: next });

    let saved: string[];
    try {
      const updated = await updateOrderNotifications(next);
      saved = Array.from(new Set(updated.notify_order_types ?? []));
      confirmedRef.current = saved;
    } catch (error) {
      dispatch({ type: "rollback", value: confirmedRef.current });
      emitError(error instanceof Error ? error.message : "Не удалось сохранить фильтр уведомлений");
      requestActiveRef.current = false;
      return;
    }

    try {
      await reloadProfile();
    } catch {
      // PUT уже успешно сохранил настройки; ошибка повторной загрузки не должна откатывать их.
    }
    dispatch({ type: "saved", value: saved });
    requestActiveRef.current = false;
  };

  return { selected: state.selected, saving: state.saving, toggle };
}
