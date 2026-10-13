import type { SroHolderProfile } from "../../shared/model/sroHolder";
import { SroHolderFields } from "../../shared/ui/SroHolderFields";

const LABELS = {
  sro: "Наименование СРО изыскателей",
  hazardousRight:
    "Право выполнения инженерных изысканий в отношении особо опасных, технически сложных и уникальных объектов капитального строительства (кроме объектов использования атомной энергии)",
  nuclearRight: "Право выполнения инженерных изысканий в отношении объектов использования атомной энергии",
};

interface SurveyHolderProfileFieldsProps {
  value: SroHolderProfile;
  onChange: (value: SroHolderProfile) => void;
}

/** Анкета члена СРО изыскателей. */
export function SurveyHolderProfileFields({ value, onChange }: SurveyHolderProfileFieldsProps) {
  return <SroHolderFields name="survey" labels={LABELS} value={value} onChange={onChange} />;
}
