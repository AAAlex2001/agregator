import { Logo } from "@/shared/ui";
import s from "./style.module.scss";

export function TelegramOnly() {
  return (
    <div className={s.wrap}>
      <div className={s.logo}>
        <Logo size={84} />
      </div>
      <h1 className={s.title}>Откройте в Telegram</h1>
      <p className={s.text}>
        Мини-приложение Ресурс-Плюс работает только внутри Telegram. Найдите наш бот и нажмите
        «Открыть приложение».
      </p>
    </div>
  );
}
