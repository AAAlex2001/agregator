import { ThemedImage } from "@/shared/ui/themed-image";
import { CloseIcon } from "@/shared/ui/icons/interface";
import s from "./style.module.scss";

interface Props {
  light: string;
  dark: string;
  title: string;
  desc: string;
  onClose: () => void;
}

export function SheetHero({ light, dark, title, desc, onClose }: Props) {
  return (
    <div className={s.hero}>
      <ThemedImage className={s.image} light={light} dark={dark} />

      <button className={s.close} onClick={onClose} aria-label="Закрыть">
        <CloseIcon width={16} height={16} />
      </button>

      <div className={s.text}>
        <span className={s.title}>{title}</span>
        <span className={s.desc}>{desc}</span>
      </div>
    </div>
  );
}
