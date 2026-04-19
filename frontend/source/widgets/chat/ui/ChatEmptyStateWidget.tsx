import { Subtitle } from "@/source/shared/ui/Typography";
import s from "./ChatEmptyStateWidget.module.scss";

export function ChatEmptyStateWidget() {
  return (
    <section className={s.desktopEmptyState} aria-label="Пустое состояние чата">
      <Subtitle
        text="Выберите кому написать в левой панели чатов"
        className={s.emptyStateText}
      />
    </section>
  );
}