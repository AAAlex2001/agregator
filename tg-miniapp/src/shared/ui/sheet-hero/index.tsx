import { ThemedImage } from "@/shared/ui/themed-image";
import { CloseIcon } from "@/shared/ui/icons/interface";
import s from "./style.module.scss";

interface Props {
  light: string;
  dark: string;
  label?: string;
  title: string;
  desc: string;
  step?: number;
  total?: number;
  onClose: () => void;
}

export function SheetHero({ light, dark, label, title, desc, step, total, onClose }: Props) {
  return (
    <div className={s.hero}>
      <ThemedImage className={s.heroImg} light={light} dark={dark} />

      <button className={s.close} onClick={onClose} aria-label="Закрыть">
        <CloseIcon width={16} height={16} />
      </button>

      <div className={s.heroTxt}>
        {label && <span className={s.stepLab}>{label}</span>}
        <span className={s.stepTitle}>{title}</span>
        <span className={s.stepDesc}>{desc}</span>
        {step !== undefined && total !== undefined && (
          <div className={s.dots}>
            {Array.from({ length: total }).map((_, i) => (
              <span key={i} className={i + 1 === step ? `${s.dot} ${s.dotOn}` : s.dot} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
