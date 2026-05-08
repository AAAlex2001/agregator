import { TextInput } from "@/source/shared/ui/Inputs";
import { VerifiedBadge } from "./ContactFields";
import s from "./CompanyReadonly.module.scss";

interface Props {
  companyName: string;
  inn: string;
}

export function CompanyReadonly({ companyName, inn }: Props) {
  return (
    <div className={s.block}>
      <div className={s.cell}>
        <TextInput
          id="company"
          placeholder="Компания"
          aria-label="Компания"
          value={companyName}
          onChange={() => undefined}
          disabled
        />
        <VerifiedBadge>Компания подтверждена</VerifiedBadge>
      </div>
      <div className={s.cell}>
        <TextInput
          id="inn"
          placeholder="ИНН"
          aria-label="ИНН"
          value={inn}
          onChange={() => undefined}
          disabled
        />
        <VerifiedBadge>ИНН подтверждён</VerifiedBadge>
      </div>
      <p className={s.hint}>Для смены компании обратитесь в службу поддержки.</p>
    </div>
  );
}
