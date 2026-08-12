"use client";

import { useReducer, type FormEvent } from "react";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { toRussianPhoneApiValue } from "@/source/shared/lib/phone";
import type { AuthPreset } from "@/source/shared/lib/auth-modal";
import type { CompanyData } from "@/source/entities/user";
import type { UserRole } from "@/source/entities/user";
import { holderProfileToApi } from "@/source/features/directions/design";
import { registerLicenseHolder, registerUser } from "./api";
import { toRegisterDocuments } from "./directionFiles";
import { initFromPreset, reducer } from "./reducer";

export function useRegister(
  preset: AuthPreset | null,
  onRegistered: (email: string, role: UserRole) => void,
) {
  const { showError } = useNotifications();
  const [state, dispatch] = useReducer(reducer, preset, initFromPreset);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (state.waiting) return;

    if (state.password !== state.confirm) {
      showError("Пароли не совпадают");
      return;
    }

    dispatch({ type: "SUBMIT_PENDING" });
    try {
      if (state.role === "LICENSE_HOLDER") {
        await registerLicenseHolder(
          {
            email: state.email.trim(),
            password: state.password,
            phone: toRussianPhoneApiValue(state.phone),
            inn: state.party?.data.inn ?? "",
            company_data: state.party as CompanyData,
            license_number: state.licenseEnabled ? state.licenseNumber.trim() : "",
            license_areas: state.licenseEnabled ? state.licenseAreas : [],
            license_rental_kind: state.licenseEnabled ? state.rentalKind : null,
            license_rental_percent:
              state.licenseEnabled && state.rentalKind === "PERCENT"
                ? Number(state.rentalPercent.replace(",", "."))
                : undefined,
            license_rental_fixed_amount:
              state.licenseEnabled && state.rentalKind === "FIXED"
                ? Number(state.rentalFixed.replace(/\s/g, ""))
                : undefined,
            mining_license_number: state.miningNumber.trim() || null,
            lab_accreditation_number: state.labNumber.trim() || null,
            audit_profile: state.auditHolderProfile,
            tech_diag_profile: state.techDiagHolderProfile,
            design_profile: state.designHolderProfile
              ? holderProfileToApi(state.designHolderProfile)
              : null,
            directions: state.directions,
          },
          state.files.license,
          state.files.mining,
          state.files.sro,
          state.files.lab,
        );
      } else if (state.role === "EXPERT") {
        await registerUser(
          {
            role: "EXPERT",
            email: state.email.trim(),
            password: state.password,
            phone: toRussianPhoneApiValue(state.phone) || undefined,
            first_name: state.firstName || undefined,
            last_name: state.lastName || undefined,
            location_lat: state.location?.lat ?? null,
            location_lng: state.location?.lng ?? null,
            location_address: state.location?.address || null,
            location_city: state.location?.city ?? null,
            travels_to_other_regions: state.travels,
            show_on_map: state.showOnMap,
            map_fields: state.mapFields,
            expertise_profile: state.expertiseProfile,
            audit_expert_profile: state.auditExpertProfile,
            cadastral_profile: state.cadastralProfile,
            forensic_profile: state.forensicProfile,
            research_profile: state.researchProfile,
            laboratory_profile: state.laboratoryProfile,
            tech_diag_profile: state.techDiagProfile,
            design_profile: state.designProfile,
            contact_sales_enabled: state.contactEnabled,
            contact_price_rubles: state.contactEnabled
              ? Number(state.contactPrice.replace(/\s/g, ""))
              : undefined,
            contact_payment_details: state.contactEnabled ? state.contactDetails.trim() : undefined,
            contact_disclosure_consent: state.contactConsent,
          },
          toRegisterDocuments(state.directionFiles),
        );
      } else {
        await registerUser({
          role: "CUSTOMER",
          email: state.email.trim(),
          password: state.password,
          phone: toRussianPhoneApiValue(state.phone) || undefined,
          first_name: state.firstName || undefined,
          last_name: state.lastName || undefined,
          inn: state.party?.data.inn ?? "",
          company_data: state.party as CompanyData | null,
          audit_customer_profile: state.auditCustomerProfile,
          directions: state.directions,
        });
      }
      dispatch({ type: "SUBMIT_FULFILLED" });
      onRegistered(state.email.trim(), state.role);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Не удалось зарегистрироваться";
      dispatch({ type: "SUBMIT_REJECTED", payload: message });
      showError(message);
    }
  };

  return { state, dispatch, submit };
}
