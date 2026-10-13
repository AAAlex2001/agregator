import { AuditCustomerProfileFields, emptyAuditCustomerProfile } from "@/source/entities/directions/audit";
import { ORDER_WORK_OPTIONS } from "@/source/entities/order";
import { PartySuggestInput } from "@/source/entities/party";
import { DirectionList } from "./directions/DirectionList";
import { DirectionOption } from "./directions/DirectionOption";
import { NameFields } from "./NameFields";
import type { StepProps } from "./types";

/** Поля заказчика: направления (у аудита СУПБ своя анкета), имя и организация по ИНН. */
export function CustomerFields({ state, dispatch }: StepProps) {
  const audit = state.auditCustomerProfile;

  return (
    <>
      <DirectionList>
        {ORDER_WORK_OPTIONS.map((option) =>
          option.value === "AUDIT_SUPB" ? (
            <DirectionOption
              key={option.value}
              id={option.value}
              title={option.label}
              description={option.description}
              checked={audit !== null}
              onToggle={() => dispatch({ type: "auditCustomer", value: audit ? null : emptyAuditCustomerProfile })}
            >
              {audit && (
                <AuditCustomerProfileFields value={audit} onChange={(value) => dispatch({ type: "auditCustomer", value })} />
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
                dispatch({ type: "direction", key: option.value, value: !state.directions.includes(option.value) })
              }
            />
          ),
        )}
      </DirectionList>

      <NameFields state={state} dispatch={dispatch} />

      <PartySuggestInput
        value={state.companyName}
        onChange={(query, picked) =>
          picked ? dispatch({ type: "party", party: picked }) : dispatch({ type: "companyText", value: query })
        }
        placeholder="ИНН или название организации"
      />
    </>
  );
}
