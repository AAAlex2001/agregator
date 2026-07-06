import { type Dispatch } from "react";
import { type RegisterAction, type RegisterState } from "../../model/types";

export interface StepProps {
  state: RegisterState;
  dispatch: Dispatch<RegisterAction>;
}
