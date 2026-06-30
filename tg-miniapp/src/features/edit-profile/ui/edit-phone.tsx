import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/entites/session";
import { updateProfile } from "@/entites/profile";
import { emitError } from "@/shared/services/error-bus";
import { Button, Card, TextField } from "@/shared/ui";
import { SuccessModal } from "@/widgets/success-modal";
import { PHONE_PLACEHOLDER, formatPhone, isPhoneComplete, phoneApiValue } from "@/shared/lib/phone";
import s from "./edit.module.scss";

export function EditPhone() {
  const navigate = useNavigate();
  const { profile, reloadProfile } = useSession();
  const [phone, setPhone] = useState(formatPhone(profile?.phone ?? ""));
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await updateProfile({ phone: phoneApiValue(phone) });
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
        <TextField
          placeholder={PHONE_PLACEHOLDER}
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
        />
      </Card>
      <Button className={s.save} onClick={() => void save()} loading={saving} disabled={!isPhoneComplete(phone)}>
        Сохранить
      </Button>
      <SuccessModal open={done} message="Телефон обновлён" onClose={() => navigate("/profile", { replace: true })} />
    </>
  );
}
