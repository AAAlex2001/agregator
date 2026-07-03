import { useEffect, useState } from "react";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic } from "@/shared/services/telegram";
import { resetPassword, sendResetCode } from "./api";

export function useForgotPassword(open: boolean) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStep(1);
    setEmail("");
    setCode("");
    setPassword("");
    setBusy(false);
  }, [open]);

  const sendCode = async () => {
    if (email.trim() === "" || busy) return;
    setBusy(true);
    try {
      await sendResetCode(email.trim());
      notifyHaptic("success");
      setStep(2);
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось отправить код");
    } finally {
      setBusy(false);
    }
  };

  const submitReset = async () => {
    if (code.trim().length < 4 || password.length < 6 || busy) return;
    setBusy(true);
    try {
      await resetPassword(email.trim(), code.trim(), password);
      notifyHaptic("success");
      setStep(3);
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось изменить пароль");
    } finally {
      setBusy(false);
    }
  };

  return { step, email, code, password, busy, setEmail, setCode, setPassword, sendCode, submitReset };
}
