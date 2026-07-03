import cn from "classnames";
import { ThemedImage } from "@/shared/ui/themed-image";
import { CloseIcon } from "@/shared/ui/icons/interface";
import s from "./style.module.scss";

interface Props {
  light: string;
  dark: string;
  title: string;
  desc: string;
  label?: string;
  step?: number;
  total?: number;
  tone?: "light" | "dark";
  onClose: () => void;
}

export function SheetHero({ light, dark, title, desc, label, step, total, tone = "light", onClose }: Props) {
  return (
    <div className={s.hero}>
      <ThemedImage className={s.image} light={light} dark={dark} />

      <button className={s.close} onClick={onClose} aria-label="Закрыть">
        <CloseIcon width={16} height={16} />
      </button>

      <div className={cn(s.text, { [s.textDark]: tone === "dark" })}>
        {label && <span className={s.label}>{label}</span>}
        <span className={s.title}>{title}</span>
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
