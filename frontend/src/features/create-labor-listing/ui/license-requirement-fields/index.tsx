import { ExpertiseCodesPicker, TypesPicker } from "@/entities/expertise";
import { RadioGroup } from "@/shared/ui/radio-group";
import { CATEGORY_OPTIONS, EXPERTISE_MODE_OPTIONS } from "../../config/options";
import type { LaborListingForm } from "../../model/types";
import { OtherProfessionField } from "../other-profession-field";
import styles from "./style.module.scss";

/** Черновик объявления организации. */
interface LicenseRequirementFieldsProps {
  form: LaborListingForm;
}

/** Требования организации: точные удостоверения, виды экспертизы или иная профессия. */
export function LicenseRequirementFields({ form }: LicenseRequirementFieldsProps) {
  const { fields } = form.state;

  /** Переключает точное удостоверение и любой исполнитель вида. */
  function changeMode(value: string) {
    form.changeMode(value === "GENERAL" ? "GENERAL" : "EXACT");
  }

  return (
    <div className={styles.group}>
      {!fields.otherProfession && (
        <>
          <RadioGroup
            variant="checklist"
            name="labor-expertise-mode"
            legend="Требования к исполнителю"
            value={fields.expertiseMode}
            options={EXPERTISE_MODE_OPTIONS}
            onChange={changeMode}
          />

          {fields.expertiseMode === "EXACT" ? (
            <ExpertiseCodesPicker
              value={fields.certificateCodes}
              onChange={form.changeCodes}
              typeLabel="Выберите вид удостоверения"
              areaLabel="Выберите точную область аттестации"
              resultLabel="Требуемые удостоверения"
            />
          ) : (
            <TypesPicker
              value={fields.expertiseTypes}
              onChange={form.changeTypes}
              label="Выберите вид экспертизы"
              hint="Область Э не уточняется — подойдёт любой исполнитель выбранного вида"
            />
          )}

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
