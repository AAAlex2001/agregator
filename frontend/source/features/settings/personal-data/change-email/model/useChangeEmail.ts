"use client";

import { useReducer } from "react";
import { confirmEmailChange, requestEmailChange } from "@/source/entities/user";
import { useSession } from "@/source/entities/session";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { CLOSED, changeEmailReducer } from "./reducer";

export const CODE_LENGTH = 6;

/** Смена почты в два шага: новый адрес, затем код из письма на него. */
export function useChangeEmail() {
  const { setUser } = useSession();
  const { showSuccess } = useNotifications();
  const [state, dispatch] = useReducer(changeEmailReducer, CLOSED);

  const open = () => dispatch({ type: "modal/open" });
  const close = () => dispatch({ type: "modal/close" });
  const changeEmail = (email: string) => dispatch({ type: "email/change", email });
  const changeCode = (code: string) => dispatch({ type: "code/change", code });

  const sendCode = async () => {
    dispatch({ type: "request/start" });
    try {
      await requestEmailChange(state.email.trim());
      dispatch({ type: "request/codeSent" });
    } catch (error) {
      dispatch({ type: "request/error", error: error instanceof Error ? error.message : "Не удалось отправить код" });
    }
  };

  const confirm = async () => {
    dispatch({ type: "request/start" });
    try {
      setUser(await confirmEmailChange(state.code.trim()));
      dispatch({ type: "modal/close" });
      showSuccess("Почта изменена");
    } catch (error) {
      dispatch({ type: "request/error", error: error instanceof Error ? error.message : "Не удалось подтвердить код" });
    }
  };

  return { state, open, close, changeEmail, changeCode, sendCode, confirm };
}
