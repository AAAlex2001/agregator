import cn from "classnames";
import s from "./style.module.scss";

interface Props {
  light: string;
  dark: string;
  alt?: string;
  className?: string;
}

// Растровая картинка с двумя вариантами под тему: рендерим обе, ненужную прячет CSS по [data-theme].
// Если файла ещё нет (404) — прячем битую картинку, под ней остаётся градиент-фолбэк родителя.
const hideBroken = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.display = "none";
};

export function ThemedImage({ light, dark, alt = "", className }: Props) {
  return (
    <span className={cn(s.wrap, className)}>
      <img className={cn(s.img, s.light)} src={light} alt={alt} onError={hideBroken} loading="eager" />
      <img className={cn(s.img, s.dark)} src={dark} alt={alt} onError={hideBroken} loading="eager" />
    </span>
  );
}
