import type { FormEventHandler, ReactNode } from "react";
import AutofillGuard from "@/source/shared/ui/AutofillGuard";
import s from "./ProfileForm.module.scss";

interface ProfileFormProps {
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
}

export function ProfileForm({ onSubmit, children }: ProfileFormProps) {
  return (
    <form className={s.form} onSubmit={onSubmit} autoComplete="off">
      <AutofillGuard idPrefix="profile" />
      {children}
    </form>
  );
}
