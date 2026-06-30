import { useEffect } from "react";
import { notifyHaptic } from "@/shared/services/telegram";
import { BottomSheet } from "@/shared/ui";
import { CheckIcon } from "@/shared/ui/icons/interface";
import s from "./style.module.scss";

interface Props {
  open: boolean;
  title: string;
  subtitle: string;
  onClose: () => void;
}

export function SuccessModal({ open, title, subtitle, onClose }: Props) {
  useEffect(() => {
    if (open) notifyHaptic("success");
  }, [open]);

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className={s.body}>
        <span className={s.check}>
          <CheckIcon width={36} height={36} />
        </span>
        <p className={s.title}>{title}</p>
        <p className={s.subtitle}>{subtitle}</p>
      </div>
    </BottomSheet>
  );
}
