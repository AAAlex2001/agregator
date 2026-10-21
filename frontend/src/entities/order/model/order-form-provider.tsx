"use client";

import { createContext, useContext, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";
import type { LocalFile } from "@/shared/lib/local-file";
import { useLocalFiles } from "@/shared/lib/use-local-files";
import { useSteps } from "@/shared/lib/use-steps";
import { createOrderFormValues } from "./create-order-form-values";
import { orderFormReducer } from "./order-form-reducer";
import { getOrderFormSteps } from "./order-form-steps";
import type { OrderFormStep } from "./order-form-steps";
import type {
  OrderFormAction,
  OrderFormSource,
  OrderFormValues,
} from "./order-form-types";

/** Шаги формы: их список для выбранного вида работ, текущий шаг и переходы. */
type OrderFormSteps = ReturnType<typeof useSteps> & {
  keys: OrderFormStep[];
  current: OrderFormStep;
};

/** Общий черновик для полей, предпросмотра, шагов и действия сохранения заказа. */
interface OrderFormContextValue {
  values: OrderFormValues;
  dispatch: Dispatch<OrderFormAction>;
  steps: OrderFormSteps;
  createFilePreview: (file: File) => LocalFile;
  removeFilePreview: (selected: LocalFile) => void;
}

/** Начальные данные и содержимое формы; новый заказ или аккаунт требуют нового key. */
interface OrderFormProviderProps {
  source: OrderFormSource;
  children: ReactNode;
}

const OrderFormContext = createContext<OrderFormContextValue | null>(null);

/** Хранит черновик создаваемого или редактируемого заказа и шаг, на котором он заполняется. */
export function OrderFormProvider({
  source,
  children,
}: OrderFormProviderProps) {
  const filePreviews = useLocalFiles();
  const [values, dispatch] = useReducer(
    orderFormReducer,
    source,
    createOrderFormValues,
  );
  const keys = getOrderFormSteps(values);
  const stepper = useSteps(keys.length);

  return (
    <OrderFormContext.Provider
      value={{
        values,
        dispatch,
        steps: { ...stepper, keys, current: keys[stepper.step] },
        createFilePreview: filePreviews.createFile,
        removeFilePreview: filePreviews.removeFile,
      }}
    >
      {children}
    </OrderFormContext.Provider>
  );
}

/** Даёт операциям формы доступ к черновику и временным адресам его файлов. */
export function useOrderFormContext() {
  const context = useContext(OrderFormContext);

  if (!context) {
    throw new Error("Форма заказа должна находиться внутри OrderFormProvider.");
  }

  return context;
}

/** Даёт полям и операциям сохранения доступ к текущему черновику. */
export function useOrderForm() {
  const { values, dispatch } = useOrderFormContext();

  return { values, dispatch };
}

/** Шаги формы заказа: какие есть, на каком пользователь и переходы между ними. */
export function useOrderFormSteps() {
  return useOrderFormContext().steps;
}
