import { createAuditHolderProfileValues } from "@/entities/audit";
import type { AuditHolderProfileValues } from "@/entities/audit";
import { TextInput } from "@/shared/ui/text-input";
import { DirectionOption } from "../direction-option";

/** Свидетельство инспекционного органа; области уточняются после регистрации. */
interface AuditHolderDirectionProps {
  value: AuditHolderProfileValues | null;
  onChange: (value: AuditHolderProfileValues | null) => void;
}

/** Запрашивает номер аккредитации держателя документов по аудиту СУПБ. */
export function AuditHolderDirection({ value, onChange }: AuditHolderDirectionProps) {
  return (
    <DirectionOption
      id="AUDIT_SUPB"
      title="Аудит СУПБ"
      description="Аккредитованный инспекционный орган — независимая третья сторона по аудиту СУПБ"
      checked={value !== null}
      onToggle={() => onChange(value ? null : createAuditHolderProfileValues())}
      note="Области аккредитации по аудиту СУПБ укажете в личном кабинете."
    >
      {value && (
        <TextInput
          id="register-audit-certificate"
          value={value.certificate_number}
          onChange={(event) => onChange({
            ...value,
            certificate_number: event.target.value,
          })}
          placeholder="№ свидетельства об аккредитации"
        />
      )}
    </DirectionOption>
  );
}

