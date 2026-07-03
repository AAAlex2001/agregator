import cn from "classnames";
import s from "./style.module.scss";

interface Props {
  light: string;
  dark: string;
  alt?: string;
  className?: string;
}

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
