import { useEffect, useRef } from "react";
import { notifyHaptic } from "@/shared/services/telegram";
import { CheckIcon } from "@/shared/ui/icons/interface";
import s from "./style.module.scss";

interface Props {
  open: boolean;
  message: string;
  onClose: () => void;
}

export function SuccessModal({ open, message, onClose }: Props) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    notifyHaptic("success");
    const timer = window.setTimeout(() => onCloseRef.current(), 1500);
    return () => window.clearTimeout(timer);
  }, [open]);

  if (!open) return null;

  return (
    <div className={s.overlay}>
      <div className={s.card}>
        <span className={s.check}>
          <CheckIcon width={36} height={36} />
        </span>
        <p className={s.text}>{message}</p>
      </div>
    </div>
  );
}
