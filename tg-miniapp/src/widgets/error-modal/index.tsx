import { useEffect, useState } from "react";
import { BottomSheet, Button } from "@/shared/ui";
import { onError } from "@/shared/services/error-bus";
import { notifyHaptic } from "@/shared/services/telegram";
import s from "./style.module.scss";

export function ErrorModal() {
  const [message, setMessage] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(
    () =>
      onError((text) => {
        setMessage(text);
        setOpen(true);
        notifyHaptic("error");
      }),
    [],
  );

  return (
    <BottomSheet open={open} title="Ошибка" onClose={() => setOpen(false)}>
      <div className={s.body}>
        <p className={s.text}>{message}</p>
        <Button onClick={() => setOpen(false)}>Понятно</Button>
      </div>
    </BottomSheet>
  );
}
