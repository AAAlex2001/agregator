import type { RegulationLink } from "@/entities/clarification";
import Button from "@/shared/ui/button";
import IconButton from "@/shared/ui/icon-button";
import { CloseIcon, PlusIcon } from "@/shared/ui/icons";
import Input from "@/shared/ui/input";
import styles from "./style.module.scss";

type RegulationsFieldProps = {
  value: RegulationLink[];
  onChange: (links: RegulationLink[]) => void;
};

/** Нормативные ссылки из ответа: название документа и адрес, по строке на документ. */
const RegulationsField = ({ value, onChange }: RegulationsFieldProps) => {
  const update = (index: number, changes: Partial<RegulationLink>) =>
    onChange(value.map((link, position) => (position === index ? { ...link, ...changes } : link)));

  return (
    <div className={styles.regulations}>
      {value.map((link, index) => (
        <div key={index} className={styles.row}>
          <Input ariaLabel="Название документа" placeholder="ФНП, ГОСТ, ФЗ…" value={link.label} onChange={(label) => update(index, { label })} />
          <Input type="url" ariaLabel="Ссылка" placeholder="https://" value={link.url} onChange={(url) => update(index, { url })} />
          <IconButton tone="danger" ariaLabel="Убрать ссылку" onClick={() => onChange(value.filter((_, position) => position !== index))}>
            <CloseIcon />
          </IconButton>
        </div>
      ))}

      <Button variant="outline" size="sm" onClick={() => onChange([...value, { label: "", url: "" }])}>
        <PlusIcon />
        Добавить ссылку
      </Button>
    </div>
  );
};

export default RegulationsField;
