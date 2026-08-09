import type { Dispatch } from "react";
import type { OrderFormAction, OrderFormState } from "../../../model/orderForm";

export interface StepProps {
  state: OrderFormState;
  dispatch: Dispatch<OrderFormAction>;
}
