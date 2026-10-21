import type { BlitzCompany } from "@/entities/blitz-order";
import { Field } from "@/shared/ui/field";
import { TextInput } from "@/shared/ui/text-input";
import { COMPANY_FIELDS } from "../../config/options";
import type { CompanyField } from "../../model/types";
import styles from "./style.module.scss";

/** Реквизиты организации и их изменение. */
interface CompanyFieldsProps {
  company: BlitzCompany;
  onChange: (field: CompanyField, value: string) => void;
}

/** Реквизиты для договора, счёта и акта в две колонки на широком экране. */
export function CompanyFields({ company, onChange }: CompanyFieldsProps) {
  return (
    <div className={styles.grid}>
      {COMPANY_FIELDS.map((item) => (
        <Field
          key={item.field}
          label={item.label}
        >
          <TextInput
            value={company[item.field]}
            placeholder={item.placeholder}
            onChange={(event) => onChange(item.field, event.target.value)}
          />
        </Field>
      ))}
    </div>
  );
}
