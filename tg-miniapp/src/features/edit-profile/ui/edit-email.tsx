import { useState } from "react";
import { useSession } from "@/features/session";
import { confirmEmailChange, requestEmailChange } from "@/entites/profile";
import { emitError } from "@/shared/services/error-bus";
import { Button, Card, CodeInput, TextField, ThemedImage } from "@/shared/ui";
import { SuccessModal } from "@/widgets/success-modal";
import s from "./edit.module.scss";

const CODE_LENGTH = 6;

export function EditEmail({ onDone }: { onDone: () => void }) {
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
          <div className={s.picture}>
            <ThemedImage light="/profile-hero/change-mail-light.webp" dark="/profile-hero/change-mail-dark.webp" />
          </div>
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
        <p className={s.codeLab}>Код из письма</p>
        <CodeInput length={CODE_LENGTH} value={code} onChange={setCode} />
        <p className={s.hint}>Код отправлен на {email}.</p>
        <div className={s.picture}>
          <ThemedImage light="/profile-hero/change-mail-light.webp" dark="/profile-hero/change-mail-dark.webp" />
        </div>
        <Button
          className={s.save}
          onClick={() => void confirm()}
          loading={busy}
          disabled={code.length !== CODE_LENGTH}
        >
          Подтвердить
        </Button>
      </Card>
      <SuccessModal
        open={done}
        title="Готово!"
        subtitle="Почта обновлена"
        onClose={() => {
          setDone(false);
          onDone();
        }}
      />
    </>
  );
}
