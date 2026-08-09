import type { Dispatch } from "react";
import type { RegisterAction, RegisterState } from "../model/types";

export interface StepProps {
  state: RegisterState;
  dispatch: Dispatch<RegisterAction>;
}
