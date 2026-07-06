import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import cn from "classnames";
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
  const [viewport, setViewport] = useState<{ top: number; height: number } | null>(null);
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

  useEffect(() => {
    if (!rendered) return;
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => setViewport({ top: vv.offsetTop, height: vv.height });
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      setViewport(null);
    };
  }, [rendered]);

  if (!rendered) return null;

  const view: Frozen = open ? { hero, footer, content: children } : frozen;
  const overlayStyle = viewport ? { top: viewport.top, bottom: "auto" as const, height: viewport.height } : undefined;

  return createPortal(
    <div className={cn(s.overlay, { [s.closing]: closing })} style={overlayStyle} onClick={onClose}>
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
