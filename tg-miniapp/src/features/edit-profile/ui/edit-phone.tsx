import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/entites/session";
import { updateProfile } from "@/entites/profile";
import { emitError } from "@/shared/services/error-bus";
import { Button, Card, TextField } from "@/shared/ui";
import s from "./edit.module.scss";

export function EditPhone() {
  const navigate = useNavigate();
  const { profile, reloadProfile } = useSession();
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await updateProfile({ phone: phone.trim() });
      await reloadProfile();
      navigate("/profile", { replace: true });
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Card className={s.fields}>
        <TextField
          placeholder="Телефон"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoFocus
        />
      </Card>
      <Button onClick={() => void save()} loading={saving} disabled={!phone.trim()}>
        Сохранить
      </Button>
    </>
  );
}
