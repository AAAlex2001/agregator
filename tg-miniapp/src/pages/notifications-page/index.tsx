import { useEffect, useState } from "react";
import { useSession } from "@/entites/session";
import { updateEmailPreferences, type EmailPreferences } from "@/entites/profile";
import { emitError } from "@/shared/services/error-bus";
import { tapHaptic } from "@/shared/services/telegram";
import { Screen } from "@/widgets/app-shell";
import { Card, Spinner, Toggle } from "@/shared/ui";
import s from "./style.module.scss";

type PrefKey = keyof EmailPreferences;

const TYPES: { key: PrefKey; label: string }[] = [
  { key: "email_on_response_created", label: "Новый отклик на заказ" },
  { key: "email_on_response_updated", label: "Изменение отклика" },
  { key: "email_on_expert_rejected", label: "Отклонение исполнителя" },
  { key: "email_on_order_updated", label: "Изменения в заказе" },
  { key: "email_on_bidding_finished", label: "Завершение приёма откликов" },
  { key: "email_on_chat_message", label: "Сообщения в чате" },
  { key: "email_on_question_asked", label: "Новые вопросы по заказу" },
  { key: "email_on_question_answered", label: "Ответы на вопросы" },
  { key: "email_on_new_blog_post", label: "Новые статьи в блоге" },
];

export function NotificationsPage() {
  const { profile, reloadProfile } = useSession();
  const [prefs, setPrefs] = useState<EmailPreferences | null>(profile?.email_preferences ?? null);

  useEffect(() => {
    if (!prefs && profile?.email_preferences) setPrefs(profile.email_preferences);
  }, [profile, prefs]);

  if (!prefs) {
    return (
      <Screen bare heading="Уведомления" panel>
        <Spinner page />
      </Screen>
    );
  }

  const apply = async (key: PrefKey, value: boolean) => {
    tapHaptic();
    const prev = prefs;
    setPrefs({ ...prefs, [key]: value });
    try {
      await updateEmailPreferences({ [key]: value });
      await reloadProfile();
    } catch (e) {
      setPrefs(prev);
      emitError(e instanceof Error ? e.message : "Не удалось сохранить");
    }
  };

  return (
    <Screen bare heading="Уведомления" panel>
      <Card className={s.tg}>
        <div className={s.tgText}>
          <p className={s.tgTitle}>Уведомления в Telegram</p>
          <p className={s.tgSub}>
            Получайте уведомления о новых заказах, откликах, сообщениях и новостях прямо в Telegram —
            не пропустите ничего важного.
          </p>
        </div>
        <Toggle on={prefs.notify_telegram_enabled} onChange={(v) => void apply("notify_telegram_enabled", v)} />
      </Card>

      <p className={s.groupTitle}>Что присылать</p>
      <div className={s.group}>
        {TYPES.map((type) => (
          <div key={type.key} className={s.row}>
            <span className={s.rowLabel}>{type.label}</span>
            <Toggle on={prefs[type.key]} onChange={(v) => void apply(type.key, v)} />
          </div>
        ))}
      </div>
    </Screen>
  );
}
