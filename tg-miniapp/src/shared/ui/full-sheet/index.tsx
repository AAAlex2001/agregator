import { useEffect, useRef, useState, type ReactNode } from "react";
import cn from "classnames";
import { useKeyboardInset } from "@/shared/lib/use-keyboard-inset";
import s from "./style.module.scss";

interface Frozen {
  hero: ReactNode;
  footer: ReactNode;
  content: ReactNode;
}

interface Props {
  open: boolean;
  onClose: () => void;
  hero: ReactNode;
  footer?: ReactNode;
  scrollKey?: unknown;
  children: ReactNode;
}

export function FullSheet({ open, onClose, hero, footer = null, scrollKey, children }: Props) {
  const [rendered, setRendered] = useState(open);
  const [closing, setClosing] = useState(false);
  const [frozen, setFrozen] = useState<Frozen>({ hero, footer, content: children });
  const scrollRef = useRef<HTMLDivElement>(null);
  const keyboardInset = useKeyboardInset(rendered);

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
    if (open) setFrozen({ hero, footer, content: children });
  }, [open, hero, footer, children]);

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

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [scrollKey]);

  if (!rendered) return null;

  const view: Frozen = open ? { hero, footer, content: children } : frozen;

  return (
    <div
      className={cn(s.overlay, { [s.closing]: closing })}
      style={{ paddingBottom: keyboardInset }}
      onClick={onClose}
    >
      <div
        className={cn(s.sheet, { [s.closing]: closing })}
        style={keyboardInset ? { height: `calc(var(--tg-viewport-height, 100dvh) - 22px - ${keyboardInset}px)` } : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {view.hero}
        <div className={s.scroll} ref={scrollRef}>
          <div className={s.panel}>{view.content}</div>
        </div>
        {view.footer && <div className={s.footer}>{view.footer}</div>}
      </div>
    </div>
  );
}
