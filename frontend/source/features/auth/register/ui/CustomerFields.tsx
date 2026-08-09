import { TextInput } from "@/source/shared/ui/Inputs";
import { ORDER_WORK_OPTIONS } from "@/source/entities/order";
import { PartySuggestInput, type PartySuggestion } from "@/source/features/party-suggest";
import {
  AuditCustomerProfileFields,
  emptyAuditCustomerProfile,
} from "@/source/features/directions/audit";
import { DirectionOption } from "./directions/DirectionOption";
import type { StepProps } from "./types";
import d from "./directions/DirectionsPicker.module.scss";

export function CustomerFields({ state, dispatch }: StepProps) {
  const audit = state.auditCustomerProfile;

  return (
    <>
      <ul className={d.list}>
        {ORDER_WORK_OPTIONS.map((option) =>
          option.value === "AUDIT_SUPB" ? (
            <DirectionOption
              key={option.value}
              id="AUDIT_SUPB"
              title={option.label}
              description={option.description}
              checked={audit !== null}
              onToggle={() =>
                dispatch({
                  type: "auditCustomer",
                  value: audit ? null : { ...emptyAuditCustomerProfile },
                })
              }
            >
              {audit && (
                <AuditCustomerProfileFields
                  value={audit}
                  onChange={(value) => dispatch({ type: "auditCustomer", value })}
                />
              )}
            </DirectionOption>
          ) : (
            <DirectionOption
              key={option.value}
              id={option.value}
              title={option.label}
              description={option.description}
              checked={state.directions.includes(option.value)}
              onToggle={() =>
                dispatch({
                  type: "direction",
                  key: option.value,
                  value: !state.directions.includes(option.value),
                })
              }
            />
          ),
        )}
      </ul>

      <TextInput
        id="lastName"
        value={state.lastName}
        autoComplete="off"
        onChange={(e) => dispatch({ type: "set", key: "lastName", value: e.target.value })}
        placeholder="Фамилия"
      />
      <TextInput
        id="firstName"
        value={state.firstName}
        autoComplete="off"
        onChange={(e) => dispatch({ type: "set", key: "firstName", value: e.target.value })}
        placeholder="Имя"
      />

      <PartySuggestInput
        value={state.companyName}
        onChange={(query: string, picked: PartySuggestion | null) =>
          picked
            ? dispatch({ type: "party", party: picked })
            : dispatch({ type: "companyText", value: query })
        }
        placeholder="ИНН или название организации"
      />
    </>
  );
}
