import { BadgeCodesPicker } from "@/source/entities/expertise";
import { ExpertiseCategoryField } from "./ExpertiseCategoryField";
import { OtherProfessionField } from "./OtherProfessionField";
import s from "./LaborForm.module.scss";

interface ExpertEditableCertificatesFieldProps {
  certificateCodes: string[];
  category: string;
  otherProfession: boolean;
  otherProfessionText: string;
  onCertificateCodesChange: (codes: string[]) => void;
  onCategoryChange: (category: string) => void;
  onOtherProfessionToggle: (enabled: boolean) => void;
  onOtherProfessionTextChange: (text: string) => void;
}

export function ExpertEditableCertificatesField({
  certificateCodes,
  category,
  otherProfession,
  otherProfessionText,
  onCertificateCodesChange,
  onCategoryChange,
  onOtherProfessionToggle,
  onOtherProfessionTextChange,
}: ExpertEditableCertificatesFieldProps) {
  return (
    <div className={s.fieldGroup}>
      <div>
        <span className={s.label}>Ваши удостоверения</span>
        <p className={s.hint}>
          В профиле пока нет удостоверений. Укажите их для этого объявления.
        </p>
      </div>

      {!otherProfession && (
        <>
          <BadgeCodesPicker
            value={certificateCodes}
            onChange={onCertificateCodesChange}
            typeLabel="Выберите вид удостоверения"
            areaLabel="Выберите область аттестации"
            resultLabel="Удостоверения исполнителя"
          />

          <ExpertiseCategoryField
            value={category}
            onChange={onCategoryChange}
          />
        </>
      )}

      <OtherProfessionField
        enabled={otherProfession}
        text={otherProfessionText}
        onToggle={onOtherProfessionToggle}
        onTextChange={onOtherProfessionTextChange}
      />
    </div>
  );
}
