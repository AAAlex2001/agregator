"use client";

import { createContext, useContext, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";
import type { LocalFile } from "@/shared/lib/local-file";
import { useLocalFiles } from "@/shared/lib/use-local-files";
import { createOrderFormValues } from "./create-order-form-values";
import { orderFormReducer } from "./order-form-reducer";
import type {
  OrderFormAction,
  OrderFormSource,
  OrderFormValues,
} from "./order-form-types";

/** Общий черновик для полей, предпросмотра и действия сохранения заказа. */
interface OrderFormContextValue {
  values: OrderFormValues;
  dispatch: Dispatch<OrderFormAction>;
  createFilePreview: (file: File) => LocalFile;
  removeFilePreview: (selected: LocalFile) => void;
}

/** Начальные данные и содержимое формы; новый заказ или аккаунт требуют нового key. */
interface OrderFormProviderProps {
  source: OrderFormSource;
  children: ReactNode;
}

const OrderFormContext = createContext<OrderFormContextValue | null>(null);

/** Хранит черновик одного создаваемого или редактируемого заказа. */
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

  return (
    <OrderFormContext.Provider
      value={{
        values,
        dispatch,
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
