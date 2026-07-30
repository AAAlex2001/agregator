import { useNavigate } from "react-router-dom";
import { tapHaptic } from "@/shared/services/telegram";
import { ChatIcon, CompassIcon, ReviewsIcon, UserIcon } from "@/shared/ui/icons/interface";
import s from "../style.module.scss";

interface Props {
  unread: number;
  onOpenChat: () => void;
}

export function HeaderActions({ unread, onOpenChat }: Props) {
  const navigate = useNavigate();
  const action = (callback: () => void) => () => {
    tapHaptic();
    callback();
  };

  return (
    <>
      <button className={s.iconBtn} aria-label="Полезное" onClick={action(() => navigate("/useful"))}>
        <CompassIcon width={22} height={22} />
      </button>
      <button className={s.iconBtn} aria-label="Чаты" onClick={action(onOpenChat)}>
        <ChatIcon width={22} height={22} />
        {unread > 0 && <span className={s.chatBadge}>{unread > 99 ? "99+" : unread}</span>}
      </button>
      <button className={s.iconBtn} aria-label="Отзывы исполнителей" onClick={action(() => navigate("/experts-reviews"))}>
        <ReviewsIcon width={22} height={22} />
      </button>
      <button className={s.iconBtn} aria-label="Профиль" onClick={action(() => navigate("/profile"))}>
        <UserIcon width={22} height={22} />
      </button>
    </>
  );
}
