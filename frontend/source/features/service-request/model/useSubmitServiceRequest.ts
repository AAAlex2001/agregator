"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/source/features/session";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { createGuestOrder } from "../api/guestOrder.api";
import { serviceRequestSchema } from "./schema";
import type { ServiceRequestState } from "./types";

const SUCCESS_MESSAGE =
  "Заявка опубликована. Вы вошли в кабинет — там появятся отклики исполнителей";

export function useSubmitServiceRequest() {
  const router = useRouter();
  const { reload } = useSession();
  const { showSuccess, showError } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (state: ServiceRequestState) => {
    const parsed = serviceRequestSchema.safeParse(state);
    if (!parsed.success) {
      showError(parsed.error.issues[0]?.message ?? "Проверьте заполнение формы");
      return;
    }

    const values = parsed.data;
    const isNir = values.variant === "nir";
    setIsSubmitting(true);
    try {
      await createGuestOrder(
        {
          customer: {
            first_name: values.firstName,
            last_name: values.lastName,
            phone: values.phone,
            email: values.email,
          },
          work_type: isNir ? "RESEARCH" : "LABORATORY",
          title: isNir ? values.topic : values.researchName,
          comment: values.description,
          sum_amount: Number(values.maxPrice.replace(/\s/g, "")),
          start_date: values.startDate,
          deadline: values.dueDate,
          responses_deadline: `${values.responsesDeadline}T23:59:59+03:00`,
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
