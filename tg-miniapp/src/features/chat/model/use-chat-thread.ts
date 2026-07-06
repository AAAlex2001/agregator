import { useEffect, useReducer } from "react";
import { emitError } from "@/shared/services/error-bus";
import { getChat, sendChatMessage } from "@/entites/chat";
import { initialState, reducer } from "./thread-reducer";

const POLL_MS = 5000;

export function useChatThread(uuid: string | null) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: "reset" });
    if (!uuid) return;
    let active = true;
    const load = async () => {
      try {
        const detail = await getChat(uuid);
        if (active) dispatch({ type: "loaded", detail });
      } catch (e) {
        if (active) emitError(e instanceof Error ? e.message : "Не удалось открыть чат");
      }
    };
    void load();
    const id = setInterval(() => void load(), POLL_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [uuid]);

  const canSend = (state.text.trim() !== "" || state.files.length > 0) && !state.sending;

  const send = async () => {
    if (!uuid || !canSend) return;
    dispatch({ type: "sending", value: true });
    try {
      const message = await sendChatMessage(uuid, state.text.trim(), state.files);
      dispatch({ type: "sent", message });
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось отправить сообщение");
      dispatch({ type: "sending", value: false });
    }
  };

  return { state, dispatch, canSend, send };
}
