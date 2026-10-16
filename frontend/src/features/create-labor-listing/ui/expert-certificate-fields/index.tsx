import { ExpertiseCodesPicker } from "@/entities/expertise";
import { RadioGroup } from "@/shared/ui/radio-group";
import { CATEGORY_OPTIONS } from "../../config/options";
import type { LaborListingForm } from "../../model/types";
import { OtherProfessionField } from "../other-profession-field";
import styles from "./style.module.scss";

/** Черновик объявления исполнителя. */
interface ExpertCertificateFieldsProps {
  form: LaborListingForm;
}

/** Даёт исполнителю без удостоверений в профиле указать их для объявления. */
export function ExpertCertificateFields({ form }: ExpertCertificateFieldsProps) {
  const { fields } = form.state;

  return (
    <div className={styles.group}>
      <div>
        <span className={styles.label}>Ваши удостоверения</span>
        <p className={styles.hint}>
          В профиле пока нет удостоверений. Укажите их для этого объявления.
        </p>
      </div>

      {!fields.otherProfession && (
        <>
          <ExpertiseCodesPicker
            value={fields.certificateCodes}
            onChange={form.changeCodes}
            typeLabel="Выберите вид удостоверения"
            areaLabel="Выберите область аттестации"
            resultLabel="Удостоверения исполнителя"
          />
          <RadioGroup
            variant="checklist"
            name="expertise-category"
            legend="Категория исполнителя"
            value={fields.category}
            options={CATEGORY_OPTIONS}
            onChange={(category) => form.changeField("category", category)}
          />
        </>
      )}

      <OtherProfessionField
        enabled={fields.otherProfession}
        text={fields.otherProfessionText}
        onToggle={form.changeOtherProfession}
        onTextChange={(text) => form.changeField("otherProfessionText", text)}
      />
    </div>
  );
}
