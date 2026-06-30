import { useState } from "react";
import { useSession } from "@/entites/session";
import { updateProfile } from "@/entites/profile";
import { emitError } from "@/shared/services/error-bus";
import { Button, Card, TextField } from "@/shared/ui";
import { SuccessModal } from "@/widgets/success-modal";
import s from "./edit.module.scss";

export function EditName() {
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
        <TextField placeholder="Имя" value={first} onChange={(e) => setFirst(e.target.value)} />
        <TextField placeholder="Фамилия" value={last} onChange={(e) => setLast(e.target.value)} />
        <Button onClick={() => void save()} loading={saving} disabled={!first.trim() && !last.trim()}>
          Сохранить
        </Button>
      </Card>
      <SuccessModal open={done} title="Готово!" subtitle="Имя обновлено" onClose={() => setDone(false)} />
    </>
  );
}
