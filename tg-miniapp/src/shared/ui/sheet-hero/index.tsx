import cn from "classnames";
import { ThemedImage } from "@/shared/ui/themed-image";
import { CloseIcon } from "@/shared/ui/icons/interface";
import { tapHaptic } from "@/shared/services/telegram";
import s from "./style.module.scss";

interface Props {
  light: string;
  dark: string;
  title: string;
  subtitle?: string;
  desc: string;
  label?: string;
  step?: number;
  total?: number;
  onClose: () => void;
}

export function SheetHero({ light, dark, title, subtitle, desc, label, step, total, onClose }: Props) {
  return (
    <div className={s.hero}>
      <ThemedImage className={s.image} light={light} dark={dark} />

      <button
        className={s.close}
        onClick={() => {
          tapHaptic();
          onClose();
        }}
        aria-label="Закрыть"
      >
        <CloseIcon width={16} height={16} />
      </button>

      <div className={s.text}>
        {label && <span className={s.label}>{label}</span>}
        <span className={s.title}>{title}</span>
        {subtitle ? <span className={s.subtitle}>{subtitle}</span> : null}
        <span className={s.desc}>{desc}</span>
        {step !== undefined && total !== undefined && (
          <div className={s.dots}>
            {Array.from({ length: total }).map((_, i) => (
              <span key={i} className={cn(s.dot, { [s.dotOn]: i + 1 === step })} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
