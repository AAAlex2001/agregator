import { useState } from "react";
import { useSession } from "@/entites/session";
import { confirmEmailChange, requestEmailChange } from "@/entites/profile";
import { emitError } from "@/shared/services/error-bus";
import { Button, Card, TextField } from "@/shared/ui";
import { SuccessModal } from "@/widgets/success-modal";
import s from "./edit.module.scss";

export function EditEmail() {
  const { reloadProfile } = useSession();
  const [stage, setStage] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

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
      setDone(true);
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
            label="Ваша почта"
            placeholder="Новая почта"
            type="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className={s.hint}>На новый адрес придёт код подтверждения.</p>
          <Button className={s.save} onClick={() => void send()} loading={busy} disabled={!email.trim()}>
            Отправить код
          </Button>
        </Card>
      </>
    );
  }

  return (
    <>
      <Card className={s.fields}>
        <TextField
          label="Код из письма"
          placeholder="Код из письма"
          inputMode="numeric"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <p className={s.hint}>Код отправлен на {email}.</p>
        <Button className={s.save} onClick={() => void confirm()} loading={busy} disabled={!code.trim()}>
          Подтвердить
        </Button>
      </Card>
      <SuccessModal open={done} title="Готово!" subtitle="Почта обновлена" onClose={() => setDone(false)} />
    </>
  );
}
