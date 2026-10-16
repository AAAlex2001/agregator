import { TypesPicker } from "@/entities/expertise";
import { RentalPriceField } from "@/entities/license-holder";
import { TextInput } from "@/shared/ui/text-input";
import type { RegistrationFiles } from "../../model/files";
import type { LicenseRegistration, RegulatoryDocuments } from "../../model/holder";
import { DirectionOption } from "../direction-option";
import { FilePicker } from "../file-picker";
import { RegulatoryDocumentsFields } from "../regulatory-documents-fields";

/** Лицензия ЭПБ и дополнительные документы, раскрываемые при её выборе. */
interface LicenseDirectionProps {
  value: LicenseRegistration;
  onChange: (value: LicenseRegistration) => void;
  documents: RegulatoryDocuments;
  onDocumentsChange: (value: RegulatoryDocuments) => void;
  files: RegistrationFiles;
}

/** Собирает номер, объекты и цену лицензии вместе с разрешительными документами. */
export function LicenseDirection({
  value,
  onChange,
  documents,
  onDocumentsChange,
  files,
}: LicenseDirectionProps) {
  return (
    <DirectionOption
      id="EPB_LICENSE"
      title="Лицензия на проведение экспертизы промышленной безопасности"
      description={
        "Области действия лицензии, условия предоставления "
        + "и файлы разрешительных документов"
      }
      checked={value.enabled}
      onToggle={() => onChange({ ...value, enabled: !value.enabled })}
    >
      <TextInput
        id="register-license-number"
        value={value.number}
        autoComplete="off"
        onChange={(event) => onChange({ ...value, number: event.target.value })}
        placeholder="Номер лицензии ЭПБ ОПО"
      />
      <FilePicker
        label="Файл лицензии"
        hint="PDF / JPG / PNG, до 5 МБ"
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
        value={value.file}
        onChange={(file) => onChange({ ...value, file })}
        files={files}
      />
      <TypesPicker
        value={value.areas}
        onChange={(areas) => onChange({ ...value, areas })}
        label="Объекты экспертизы по лицензии"
        hint="Выберите все типы, по которым работает ваша лицензия — можно несколько"
      />
      <RentalPriceField
        kind={value.rentalKind}
        percent={value.rentalPercent}
        fixedAmount={value.rentalFixed}
        onChangeKind={(rentalKind) => onChange({ ...value, rentalKind })}
        onChangePercent={(rentalPercent) => onChange({ ...value, rentalPercent })}
        onChangeFixed={(rentalFixed) => onChange({ ...value, rentalFixed })}
      />
      <RegulatoryDocumentsFields
        value={documents}
        onChange={onDocumentsChange}
        files={files}
      />
    </DirectionOption>
  );
}

