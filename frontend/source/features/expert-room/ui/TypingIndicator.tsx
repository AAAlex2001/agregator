import s from "./TypingIndicator.module.scss";

interface Entry {
  user_id: number;
  user_name: string;
}

interface Props {
  entries: Entry[];
}

function buildLabel(entries: Entry[]): string {
  if (entries.length === 0) return "";
  if (entries.length === 1) return `${entries[0].user_name} печатает…`;
  if (entries.length === 2) return `${entries[0].user_name} и ${entries[1].user_name} печатают…`;
  return `${entries[0].user_name} и ещё ${entries.length - 1} печатают…`;
}

export function TypingIndicator({ entries }: Props) {
  if (entries.length === 0) {
    return <div className={s.placeholder} aria-hidden />;
  }

  return (
    <div className={s.row} role="status" aria-live="polite">
      <span className={s.dots} aria-hidden>
        <span className={s.dot} />
        <span className={s.dot} />
        <span className={s.dot} />
      </span>
      <span className={s.label}>{buildLabel(entries)}</span>
    </div>
  );
}
