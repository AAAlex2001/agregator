"use client";

import { useRouter } from "next/navigation";
import { useEffect, useReducer, useState } from "react";
import type { FormEvent } from "react";
import {
  createBlitzOrder,
  getBlitzRequisites,
  getBlitzTariffs,
  useBlitzCatalog,
  useBlitzFiles,
} from "@/entities/blitz-order";
import type { BlitzCustomerType, BlitzDeadline, BlitzTariff } from "@/entities/blitz-order";
import { toStepError, withStep } from "@/shared/lib/step-error";
import { useSteps } from "@/shared/lib/use-steps";
import { useNotifications } from "@/shared/ui/notifications";
import { ORDER_FIELD_PLACES } from "../config/fields";
import { ORDER_STEPS } from "../config/steps";
import type { OrderStep } from "../config/steps";
import { toBlitzOrderPayload } from "./payload";
import { createBlitzOrderReducer, INITIAL_CREATE_BLITZ_ORDER_STATE } from "./reducer";
import { firstOrderProblem, orderStepProblem } from "./steps";
import type { CompanyField, ExpertRequirement, IndividualField, OrderTextField } from "./types";

/** Название шага по ключу. */
function titleOf(step: OrderStep): string {
  return ORDER_STEPS.find((item) => item.key === step)?.title ?? "";
}

/** Черновик заявки по шагам, справочник, тарифы, файлы и отправка. */
export function useCreateBlitzOrder() {
  const [state, dispatch] = useReducer(createBlitzOrderReducer, INITIAL_CREATE_BLITZ_ORDER_STATE);
  const [tariffs, setTariffs] = useState<BlitzTariff[]>([]);
  const { catalog, error: catalogError } = useBlitzCatalog();
  const documentation = useBlitzFiles();
  const companyCard = useBlitzFiles(1);
  const steps = useSteps(ORDER_STEPS.length);
  const { showError, showSuccess } = useNotifications();
  const router = useRouter();

  useEffect(() => {
    let isActive = true;

    getBlitzTariffs()
      .then((loaded) => {
        if (isActive) {
          setTariffs(loaded);
        }
      })
      .catch(() => undefined);

    getBlitzRequisites()
      .then((requisites) => {
        if (isActive) {
          dispatch({ type: "requisites/fill", requisites });
        }
      })
      .catch(() => undefined);

    return () => {
      isActive = false;
    };
  }, []);

  const tariff = tariffs.find(
    (item) => item.area_code === state.areaCode && item.object_code === state.objectCode,
  );

  /** Объект экспертизы; область остаётся, если объект по ней выдаётся. */
  function changeObject(objectCode: string) {
    const area = catalog?.areas.find((item) => item.code === state.areaCode);

    dispatch({
      type: "object/change",
      objectCode,
      keepArea: area ? area.objects.includes(objectCode) : false,
    });
  }

  /** Область аттестации. */
  function changeArea(areaCode: string) {
    dispatch({ type: "area/change", areaCode });
  }

  /** Как описать требования к эксперту. */
  function changeRequirement(requirement: ExpertRequirement) {
    dispatch({ type: "requirement/change", requirement });
  }

  /** Текстовое поле заявки. */
  function changeField(field: OrderTextField, value: string) {
    dispatch({ type: "field/change", field, value });
  }

  /** Желаемый срок. */
  function changeDeadline(deadline: BlitzDeadline) {
    dispatch({ type: "deadline/change", deadline });
  }

  /** Кто заказчик. */
  function changeCustomerType(customerType: BlitzCustomerType) {
    dispatch({ type: "customer-type/change", customerType });
  }

  /** Поле реквизитов организации. */
  function changeCompany(field: CompanyField, value: string) {
    dispatch({ type: "company/change", field, value });
  }

  /** Поле паспортных данных. */
  function changeIndividual(field: IndividualField, value: string) {
    dispatch({ type: "individual/change", field, value });
  }

  /** Проверяет текущий шаг и открывает следующий. */
  function next() {
    const step = ORDER_STEPS[steps.step].key;
    const problem = orderStepProblem(step, state, documentation.files.length);

    if (problem) {
      showError(problem);
      return;
    }

    steps.forward();
  }

  /** На последнем шаге отправляет заявку, на остальных — переходит дальше. */
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!steps.isLast) {
      next();
      return;
    }

    const failure = firstOrderProblem(state, documentation.files.length);
    if (failure) {
      showError(withStep(ORDER_STEPS[failure.step].title, failure.problem));
      steps.open(failure.step);
      return;
    }

    dispatch({ type: "submit/start" });

    try {
      const card = state.customerType === "individual" ? null : companyCard.files[0] ?? null;
      const order = await createBlitzOrder(toBlitzOrderPayload(state), documentation.files, card);

      showSuccess("Заявка отправлена экспертам");
      router.push(`/blitz/orders/${order.id}`);
    } catch (error) {
      dispatch({ type: "submit/error" });
      const located = toStepError(
        error,
        ORDER_FIELD_PLACES,
        titleOf,
        "Не удалось отправить заявку",
      );

      showError(located.message);

      if (located.step) {
        steps.open(ORDER_STEPS.findIndex((item) => item.key === located.step));
      }
    }
  }

  return {
    state,
    catalog,
    catalogError,
    tariff,
    documentation,
    companyCard,
    changeObject,
    changeArea,
    changeRequirement,
    changeField,
    changeDeadline,
    changeCustomerType,
    changeCompany,
    changeIndividual,
    steps,
    submit,
  };
}
