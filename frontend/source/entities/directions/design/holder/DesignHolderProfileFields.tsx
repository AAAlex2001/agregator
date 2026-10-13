import type { SroHolderProfile } from "../../shared/model/sroHolder";
import { SroHolderFields } from "../../shared/ui/SroHolderFields";

const LABELS = {
  sro: "Наименование СРО проектировщиков",
  hazardousRight:
    "Право подготовки проектной документации в отношении особо опасных, технически сложных и уникальных объектов капитального строительства (кроме объектов использования атомной энергии)",
  nuclearRight: "Право подготовки проектной документации в отношении объектов использования атомной энергии",
};

interface DesignHolderProfileFieldsProps {
  value: SroHolderProfile;
  onChange: (value: SroHolderProfile) => void;
}

/** Анкета члена СРО проектировщиков. */
export function DesignHolderProfileFields({ value, onChange }: DesignHolderProfileFieldsProps) {
  return <SroHolderFields name="design" labels={LABELS} value={value} onChange={onChange} />;
}
