import type { Taxonomy, TaxonomyOption } from "@/entities/clarification";
import Checkbox from "@/shared/ui/checkbox";
import Panel from "@/shared/ui/panel";
import type { ClarificationFields, TaxonomyDimension } from "../../model/types";
import styles from "./style.module.scss";

const GROUPS: { dimension: TaxonomyDimension; source: keyof Taxonomy; title: string }[] = [
  { dimension: "oversightAreas", source: "oversight_areas", title: "Область надзора" },
  { dimension: "industries", source: "industries", title: "Отрасль" },
  { dimension: "activities", source: "activities", title: "Вид деятельности" },
  { dimension: "objectTypes", source: "object_types", title: "Тип объекта" },
];

type TaxonomyFieldsProps = {
  taxonomy: Taxonomy;
  fields: ClarificationFields;
  onToggle: (dimension: TaxonomyDimension, value: string) => void;
};

/** Четыре группы классификатора разъяснения: галочки по справочникам Ростехнадзора. */
const TaxonomyFields = ({ taxonomy, fields, onToggle }: TaxonomyFieldsProps) => (
  <>
    {GROUPS.map(({ dimension, source, title }) => (
      <Panel key={dimension} title={title}>
        <div className={styles.grid}>
          {(taxonomy[source] as TaxonomyOption[]).map((option) => (
            <Checkbox
              key={option.value}
              checked={fields[dimension].includes(option.value)}
              onChange={() => onToggle(dimension, option.value)}
            >
              {option.label}
            </Checkbox>
          ))}
        </div>
      </Panel>
    ))}
  </>
);

export default TaxonomyFields;
