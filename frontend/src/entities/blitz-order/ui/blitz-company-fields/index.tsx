import { Field } from "@/shared/ui/field";
import { TextInput } from "@/shared/ui/text-input";
import { BLITZ_COMPANY_FIELDS } from "../../config/company";
import type { BlitzCompany } from "../../model/types";
import styles from "./style.module.scss";

/** Реквизиты организации и их изменение. */
interface BlitzCompanyFieldsProps {
  company: BlitzCompany;
  onChange: (field: keyof BlitzCompany, value: string) => void;
}

/** Реквизиты для договора, счёта и акта в две колонки на широком экране. */
export function BlitzCompanyFields({ company, onChange }: BlitzCompanyFieldsProps) {
  return (
    <div className={styles.grid}>
      {BLITZ_COMPANY_FIELDS.map((item) => (
        <Field
          key={item.field}
          label={item.label}
        >
          <TextInput
            value={company[item.field] ?? ""}
            placeholder={item.placeholder}
            onChange={(event) => onChange(item.field, event.target.value)}
          />
        </Field>
      ))}
    </div>
  );
}