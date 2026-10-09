import Field from "@/shared/ui/field";
import FieldGrid from "@/shared/ui/field-grid";
import Input from "@/shared/ui/input";
import Panel from "@/shared/ui/panel";
import Textarea from "@/shared/ui/textarea";

export type SeoFields = {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
};

type SeoFieldsPanelProps = {
  fields: SeoFields;
  onChange: (changes: Partial<SeoFields>) => void;
};

/** Панель SEO-полей страницы: title, description и ключевые слова. */
const SeoFieldsPanel = ({ fields, onChange }: SeoFieldsPanelProps) => (
  <Panel title="SEO">
    <FieldGrid>
      <Field label="Meta title" hint="До 80 символов" wide>
        <Input
          ariaLabel="Meta title"
          maxLength={300}
          value={fields.metaTitle}
          onChange={(metaTitle) => onChange({ metaTitle })}
        />
      </Field>

      <Field label="Meta description" hint="90–200 символов" wide>
        <Textarea
          ariaLabel="Meta description"
          rows={2}
          value={fields.metaDescription}
          onChange={(metaDescription) => onChange({ metaDescription })}
        />
      </Field>

      <Field label="Ключевые слова" hint="Через запятую" wide>
        <Input
          ariaLabel="Ключевые слова"
          value={fields.metaKeywords}
          onChange={(metaKeywords) => onChange({ metaKeywords })}
        />
      </Field>
    </FieldGrid>
  </Panel>
);

export default SeoFieldsPanel;
