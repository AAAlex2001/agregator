import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/entites/session";
import { confirmEmailChange, requestEmailChange } from "@/entites/profile";
import { emitError } from "@/shared/services/error-bus";
import { Button, Card, TextField } from "@/shared/ui";
import s from "./edit.module.scss";

export function EditEmail() {
  const navigate = useNavigate();
  const { reloadProfile } = useSession();
  const [stage, setStage] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async () => {
    setBusy(true);
    try {
      await requestEmailChange(email.trim());
      setStage("code");
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось отправить код");
    } finally {
      setBusy(false);
    }
  };

  const confirm = async () => {
    setBusy(true);
    try {
      await confirmEmailChange(code.trim());
      await reloadProfile();
      navigate("/profile", { replace: true });
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Неверный код");
    } finally {
      setBusy(false);
    }
  };

  if (stage === "email") {
    return (
      <>
        <Card className={s.fields}>
          <TextField
            placeholder="Новая почта"
            type="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
        </Card>
        <p className={s.hint}>На новый адрес придёт код подтверждения.</p>
        <Button onClick={() => void send()} loading={busy} disabled={!email.trim()}>
          Отправить код
        </Button>
      </>
    );
  }

  return (
    <>
      <Card className={s.fields}>
        <TextField
          placeholder="Код из письма"
          inputMode="numeric"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoFocus
        />
      </Card>
      <p className={s.hint}>Код отправлен на {email}.</p>
      <Button onClick={() => void confirm()} loading={busy} disabled={!code.trim()}>
        Подтвердить
      </Button>
    </>
  );
}
