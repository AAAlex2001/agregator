import s from "./OfferDiff.module.scss";

interface Props {
  previous: string | null;
  current: string;
}

export function OfferDiff({ previous, current }: Props) {
  if (!previous || previous === current) {
    return <>{current || "—"}</>;
  }
  return (
    <span className={s.diff}>
      <span className={s.previous}>{previous}</span>
      <span className={s.current}>{current}</span>
    </span>
  );
}
