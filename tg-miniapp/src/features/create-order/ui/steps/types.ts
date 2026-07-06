import { type Dispatch } from "react";
import { type CreateOrderAction, type CreateOrderState } from "../../model/types";

export interface StepProps {
  state: CreateOrderState;
  dispatch: Dispatch<CreateOrderAction>;
}
