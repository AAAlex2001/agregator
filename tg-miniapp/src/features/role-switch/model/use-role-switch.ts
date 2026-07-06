import { useReducer } from "react";
import { useSession } from "@/features/session";
import { switchRole } from "@/entites/profile";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic } from "@/shared/services/telegram";
import type { Role } from "@/shared/services/api";
import { initialState, reducer } from "./reducer";

export function useRoleSwitch() {
  const { role, availableRoles, reloadProfile } = useSession();
  const [state, dispatch] = useReducer(reducer, initialState);

  const pick = (next: Role) => {
    if (next === role) return;
    const item = availableRoles.find((a) => a.role === next);
    if (item && !item.email_verified) {
      emitError("Сначала подтвердите почту для этой роли");
      return;
    }
    dispatch({ type: "open", target: next });
  };

  const canConfirm = state.password.length >= 6;

  const confirm = async () => {
    if (!state.target || !canConfirm) return;
    dispatch({ type: "busy", value: true });
    try {
      await switchRole(state.target, state.password);
      notifyHaptic("success");
      await reloadProfile();
      dispatch({ type: "close" });
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось сменить роль");
      dispatch({ type: "busy", value: false });
    }
  };

  return { role, availableRoles, state, dispatch, pick, confirm, canConfirm };
}
