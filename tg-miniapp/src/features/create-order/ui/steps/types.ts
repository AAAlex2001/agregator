import { type Dispatch } from "react";
import { type CreateOrderAction, type CreateOrderState } from "../../model/reducer";

export interface StepProps {
  state: CreateOrderState;
  dispatch: Dispatch<CreateOrderAction>;
}
