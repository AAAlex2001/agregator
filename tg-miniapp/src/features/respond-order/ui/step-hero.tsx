import { ThemedImage } from "@/shared/ui";
import { CloseIcon } from "@/shared/ui/icons/interface";
import s from "./respond-sheet.module.scss";

interface Props {
  image: string;
  illu: string;
  step: number;
  total: number;
  label: string;
  title: string;
  desc: string;
  showDots: boolean;
  onClose: () => void;
}

export function StepHero({ image, illu, step, total, label, title, desc, showDots, onClose }: Props) {
  return (
    <div className={s.hero}>
      <ThemedImage
        className={s.heroImg}
        light={`/respond-order/${image}-light.webp`}
        dark={`/respond-order/${image}-dark.webp`}
      />
      <span className={s.heroIllu}>{illu}</span>

      {showDots && (
        <div className={s.dots}>
          {Array.from({ length: total }).map((_, i) => (
            <span key={i} className={i + 1 === step ? `${s.dot} ${s.dotOn}` : s.dot} />
          ))}
        </div>
      )}

      <button className={s.close} onClick={onClose} aria-label="Закрыть">
        <CloseIcon width={16} height={16} />
      </button>

      <div className={s.heroTxt}>
        <span className={s.stepLab}>{label}</span>
        <span className={s.stepTitle}>{title}</span>
        <span className={s.stepDesc}>{desc}</span>
      </div>
    </div>
  );
}
