import { CATEGORY_OPTIONS } from "@/source/entities/expertise";
import { RadioGroup } from "@/source/shared/ui";

const OPTIONS = [
  { value: "", label: "Любая категория" },
  ...CATEGORY_OPTIONS.map((category) => ({
    value: category,
    label: `${category} категория`,
  })),
];

interface ExpertiseCategoryFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function ExpertiseCategoryField({ value, onChange }: ExpertiseCategoryFieldProps) {
  return (
    <RadioGroup
      name="expertise-category"
      legend="Категория исполнителя"
      variant="checklist"
      value={value}
      options={OPTIONS}
      onChange={onChange}
    />
  );
}
