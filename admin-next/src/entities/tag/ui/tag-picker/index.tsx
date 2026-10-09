import Chip from "@/shared/ui/chip";
import Message from "@/shared/ui/message";
import styles from "./style.module.scss";

type TagPickerProps = {
  options: string[];
  selected: string[];
  onToggle: (name: string) => void;
};

/** Выбор тегов чипами. Показывает все известные теги плюс уже выбранные. */
const TagPicker = ({ options, selected, onToggle }: TagPickerProps) => {
  const names = Array.from(new Set([...options, ...selected]));

  if (names.length === 0) return <Message>Тегов пока нет — добавьте их в разделе «Теги».</Message>;

  return (
    <div className={styles.picker}>
      {names.map((name) => (
        <Chip key={name} active={selected.includes(name)} onClick={() => onToggle(name)}>
          {name}
        </Chip>
      ))}
    </div>
  );
};

export default TagPicker;
