import { createRegistrationAccount } from "./account";
import { createCustomerRegistration } from "./customer";
import { createExpertRegistration } from "./expert";
import { createHolderRegistration } from "./holder";
import { applyRegistrationPreset } from "./preset";
import type { RegisterAction, RegisterState, RegistrationPreset } from "./types";

/** Создаёт независимое состояние формы с выбранными на странице ролью и направлением. */
export function createRegisterState(preset: RegistrationPreset | null): RegisterState {
  const state: RegisterState = {
    role: preset?.role ?? "CUSTOMER",
    account: createRegistrationAccount(),
    company: { query: "", selected: null },
    customer: createCustomerRegistration(),
    expert: createExpertRegistration(),
    holder: createHolderRegistration(),
    isSubmitting: false,
  };

  return preset ? applyRegistrationPreset(state, preset) : state;
}

/** Обновляет поля; смена роли сбрасывает направления, сохраняя общие данные и лицензии. */
export function registerReducer(state: RegisterState, action: RegisterAction): RegisterState {
  switch (action.type) {
    case "role/changed":
      return {
        ...state,
        role: action.role,
        customer: createCustomerRegistration(),
        expert: {
          ...createExpertRegistration(),
          location: state.expert.location,
          contactOffer: state.expert.contactOffer,
        },
        holder: {
          ...createHolderRegistration(),
          license: { ...state.holder.license, enabled: false },
          regulatoryDocuments: state.holder.regulatoryDocuments,
        },
      };
    case "account/changed":
      return {
        ...state,
        account: action.account,
      };
    case "company/changed":
      return {
        ...state,
        company: action.company,
      };
    case "customer/changed":
      return {
        ...state,
        customer: action.customer,
      };
    case "expert/changed":
      return {
        ...state,
        expert: action.expert,
      };
    case "holder/changed":
      return {
        ...state,
        holder: action.holder,
      };
    case "registration/started":
      return {
        ...state,
        isSubmitting: true,
      };
    case "registration/finished":
      return {
        ...state,
        isSubmitting: false,
      };
  }
}

