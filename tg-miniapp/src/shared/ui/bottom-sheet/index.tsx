import { useEffect, useState, type ReactNode } from "react";
import cn from "classnames";
import { tapHaptic } from "@/shared/services/telegram";
import { CloseIcon } from "@/shared/ui/icons/interface";
import s from "./style.module.scss";

interface Props {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
}

export function BottomSheet({ open, title, onClose, children }: Props) {
  const [render, setRender] = useState(open);
  const [closing, setClosing] = useState(false);
  const [frozen, setFrozen] = useState<{ title?: string; content: ReactNode }>({ title, content: children });

  useEffect(() => {
    if (open) {
      setRender(true);
      setClosing(false);
      return;
    }
    setClosing(true);
    const timer = window.setTimeout(() => setRender(false), 320);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (open) setFrozen({ title, content: children });
  }, [open, title, children]);

  useEffect(() => {
    if (!render) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [render]);

  if (!render) return null;

  const close = () => {
    tapHaptic();
    onClose();
  };

  const shownTitle = open ? title : frozen.title;

  return (
    <div className={cn(s.overlay, { [s.closing]: closing })} onClick={close}>
      <div className={cn(s.sheet, { [s.closing]: closing })} onClick={(e) => e.stopPropagation()}>
        <div className={s.top}>
          {shownTitle ? <h3 className={s.title}>{shownTitle}</h3> : <span />}
          <button className={s.close} onClick={close} aria-label="Закрыть">
            <CloseIcon width={18} height={18} />
          </button>
        </div>
        <div className={s.body}>{open ? children : frozen.content}</div>
      </div>
    </div>
  );
}
