import { CloseIcon } from "@/shared/ui/icons/interface";
import { tapHaptic } from "@/shared/services/telegram";
import s from "./article-hero.module.scss";

interface Props {
  image: string;
  title: string;
  onClose: () => void;
}

export function ArticleHero({ image, title, onClose }: Props) {
  return (
    <div className={s.hero}>
      {image && <img className={s.image} src={image} alt="" />}
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
        <span className={s.title}>{title}</span>
      </div>
    </div>
  );
}
