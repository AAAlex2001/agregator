import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import cn from "classnames";
import { tapHaptic } from "@/shared/services/telegram";
import { lockDocument, unlockDocument } from "@/shared/lib/scroll-lock";
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
    lockDocument();
    return () => unlockDocument();
  }, [rendered]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [scrollKey]);

  if (!rendered) return null;

  const view: Frozen = open ? { hero, footer, content: children } : frozen;

  const close = () => {
    tapHaptic();
    onClose();
  };

  return createPortal(
    <div className={cn(s.overlay, { [s.closing]: closing })} onClick={close}>
      <div className={cn(s.sheet, { [s.closing]: closing })} onClick={(e) => e.stopPropagation()}>
        {view.hero}
        <div className={s.scroll} ref={scrollRef}>
          <div className={s.panel}>{view.content}</div>
        </div>
        {view.footer && <div className={s.footer}>{view.footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
