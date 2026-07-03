import { useEffect, useReducer } from "react";
import { useSession } from "@/features/session";
import { confirmEmailChange, requestEmailChange, updateProfile } from "@/entites/profile";
import { emitError } from "@/shared/services/error-bus";
import { formatPhone, isPhoneComplete, phoneApiValue } from "@/shared/lib/phone";
import { CODE_LENGTH } from "./constants";
import { initialState, reducer } from "./reducer";
import type { EditProfileAction, EditProfileKind } from "./types";

export function useEditProfile(kind: EditProfileKind | null) {
  const { profile, reloadProfile } = useSession();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!kind || !profile) return;
    dispatch({
      type: "init",
      first: profile.first_name ?? "",
      last: profile.last_name ?? "",
      phone: formatPhone(profile.phone ?? ""),
    });
  }, [kind, profile]);

  const canSubmit =
    kind === "name"
      ? state.first.trim() !== "" || state.last.trim() !== ""
      : kind === "phone"
        ? isPhoneComplete(state.phone)
        : state.stage === "email"
          ? state.email.trim() !== ""
          : state.code.length === CODE_LENGTH;

  const run = async (action: () => Promise<unknown>, fallback: string) => {
    dispatch({ type: "busy", value: true });
    try {
      await action();
      return true;
    } catch (e) {
      emitError(e instanceof Error ? e.message : fallback);
      dispatch({ type: "busy", value: false });
      return false;
    }
  };

  const submit = async () => {
    if (!kind || !canSubmit || state.busy) return;

    if (kind === "name") {
      const saved = await run(
        () => updateProfile({ first_name: state.first.trim(), last_name: state.last.trim() }),
        "Не удалось сохранить",
      );
      if (!saved) return;
      await reloadProfile();
      dispatch({ type: "done" });
      return;
    }

    if (kind === "phone") {
      const saved = await run(
        () => updateProfile({ phone: phoneApiValue(state.phone) }),
        "Не удалось сохранить",
      );
      if (!saved) return;
      await reloadProfile();
      dispatch({ type: "done" });
      return;
    }

    if (state.stage === "email") {
      const sent = await run(() => requestEmailChange(state.email.trim()), "Не удалось отправить код");
      if (!sent) return;
      dispatch({ type: "busy", value: false });
      dispatch({ type: "stage", stage: "code" });
      return;
    }

    const confirmed = await run(() => confirmEmailChange(state.code), "Неверный код");
    if (!confirmed) return;
    await reloadProfile();
    dispatch({ type: "done" });
  };

  const setField = (action: EditProfileAction) => dispatch(action);

  return { state, canSubmit, submit, setField };
}
