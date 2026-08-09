"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/source/features/session";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { createGuestOrder } from "../api/guestOrder.api";
import type { ServiceRequestState } from "./types";

const SUCCESS_MESSAGE =
  "Заявка опубликована. Вы вошли в кабинет — там появятся отклики исполнителей";

export function useSubmitServiceRequest() {
  const router = useRouter();
  const { reload } = useSession();
  const { showSuccess, showError } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (state: ServiceRequestState) => {
    if (!state.responsesDeadline) {
      showError("Укажите срок приёма откликов");
      return;
    }
    if (!state.startDate) {
      showError("Укажите срок начала работ");
      return;
    }
    if (!state.dueDate) {
      showError("Укажите срок сдачи работ");
      return;
    }

    const isNir = state.variant === "nir";
    setIsSubmitting(true);
    try {
      await createGuestOrder(
        {
          customer: {
            first_name: state.firstName.trim(),
            last_name: state.lastName.trim(),
            phone: state.phone.trim(),
            email: state.email.trim(),
          },
          work_type: isNir ? "RESEARCH" : "LABORATORY",
          title: isNir ? state.topic.trim() : state.researchName.trim(),
          comment: state.description.trim(),
          sum_amount: Number(state.maxPrice.replace(/\s/g, "")),
          start_date: state.startDate,
          deadline: state.dueDate,
          responses_deadline: `${state.responsesDeadline}T23:59:59+03:00`,
          details: isNir
            ? {
                executor_requirements: state.executorRequirements
                  .map((item) => item.value.trim())
                  .filter(Boolean),
                needs_site_visit: state.needsSiteVisit,
              }
            : { equipment_requirements: state.equipmentRequirements.trim() },
        },
        state.attachments.map((attachment) => attachment.file),
      );
      await reload();
      showSuccess(SUCCESS_MESSAGE);
      router.push("/customer/orders");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось отправить заявку");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submit, isSubmitting };
}
