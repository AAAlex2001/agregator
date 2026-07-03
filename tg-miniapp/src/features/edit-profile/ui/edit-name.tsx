import { useState } from "react";
import { useSession } from "@/features/session";
import { updateProfile } from "@/entites/profile";
import { emitError } from "@/shared/services/error-bus";
import { Button, Card, TextField, ThemedImage } from "@/shared/ui";
import { SuccessModal } from "@/widgets/success-modal";
import s from "./edit.module.scss";

export function EditName({ onDone }: { onDone: () => void }) {
  const { profile, reloadProfile } = useSession();
  const [first, setFirst] = useState(profile?.first_name ?? "");
  const [last, setLast] = useState(profile?.last_name ?? "");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await updateProfile({ first_name: first.trim(), last_name: last.trim() });
      await reloadProfile();
      setDone(true);
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Card className={s.fields}>
        <TextField label="Ваше имя" placeholder="Имя" value={first} onChange={(e) => setFirst(e.target.value)} />
        <TextField label="Ваша фамилия" placeholder="Фамилия" value={last} onChange={(e) => setLast(e.target.value)} />
        <div className={s.picture}>
          <ThemedImage light="/profile-hero/change-fio-light.webp" dark="/profile-hero/change-fio-dark.webp" />
        </div>
        <Button className={s.save} onClick={() => void save()} loading={saving} disabled={!first.trim() && !last.trim()}>
          Сохранить
        </Button>
      </Card>
      <SuccessModal
        open={done}
        title="Готово!"
        subtitle="Имя обновлено"
        onClose={() => {
          setDone(false);
          onDone();
        }}
      />
    </>
  );
}
