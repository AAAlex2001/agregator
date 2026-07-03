import { useEffect, useState, type ReactNode } from "react";
import cn from "classnames";
import s from "./style.module.scss";

interface Frozen {
  hero: ReactNode;
  content: ReactNode;
}

interface Props {
  open: boolean;
  onClose: () => void;
  hero: ReactNode;
  children: ReactNode;
}

export function FullSheet({ open, onClose, hero, children }: Props) {
  const [rendered, setRendered] = useState(open);
  const [closing, setClosing] = useState(false);
  const [frozen, setFrozen] = useState<Frozen>({ hero, content: children });

  useEffect(() => {
    if (open) {
      setRendered(true);
      setClosing(false);
      return;
    }
    if (!rendered) return;
    setClosing(true);
    const timer = window.setTimeout(() => {
      setRendered(false);
      setClosing(false);
    }, 320);
    return () => window.clearTimeout(timer);
  }, [open, rendered]);

  useEffect(() => {
    if (open) setFrozen({ hero, content: children });
  }, [open, hero, children]);

  useEffect(() => {
    if (!rendered) return;
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [rendered]);

  if (!rendered) return null;

  const view: Frozen = open ? { hero, content: children } : frozen;

  return (
    <div className={cn(s.overlay, { [s.closing]: closing })} onClick={onClose}>
      <div className={cn(s.sheet, { [s.closing]: closing })} onClick={(e) => e.stopPropagation()}>
        {view.hero}
        <div className={s.scroll}>
          <div className={s.panel}>{view.content}</div>
        </div>
      </div>
    </div>
  );
}
