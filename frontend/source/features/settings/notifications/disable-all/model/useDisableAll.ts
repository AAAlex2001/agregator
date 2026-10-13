"use client";

import { useState } from "react";
import { updateEmailPreferences, updateOrderNotifications, type EmailPreferences } from "@/source/entities/user";
import { useSession } from "@/source/entities/session";
import { useNotifications } from "@/source/shared/ui/Notifications";

const ALL_OFF: EmailPreferences = {
  email_on_response_created: false,
  email_on_response_updated: false,
  email_on_expert_rejected: false,
  email_on_order_updated: false,
  email_on_bidding_finished: false,
  email_on_chat_message: false,
  email_on_question_asked: false,
  email_on_question_answered: false,
  email_on_new_blog_post: false,
  email_on_labor_listing: false,
};

/** Отключает все письма разом, у исполнителя — ещё и фильтр новых заказов. */
export function useDisableAll() {
  const { role, setUser } = useSession();
  const { showError, showSuccess } = useNotifications();
  const [isPending, setIsPending] = useState(false);

  const disableAll = async () => {
    setIsPending(true);
    try {
      let profile = await updateEmailPreferences(ALL_OFF);
      if (role === "EXPERT") profile = await updateOrderNotifications([]);
      setUser(profile);
      showSuccess("Все почтовые уведомления отключены");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось отключить уведомления");
    } finally {
      setIsPending(false);
    }
  };

  return { isPending, disableAll };
}
