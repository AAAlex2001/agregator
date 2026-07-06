import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/features/session";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic } from "@/shared/services/telegram";
import { isPhoneComplete, phoneApiValue } from "@/shared/lib/phone";
import { isEmail } from "@/shared/lib/email";
import { passwordValid } from "@/shared/lib/password";
import { CODE_LENGTH } from "@/shared/ui";
import { type Role } from "@/shared/services/api";
import { confirmEmail, registerLicenseHolder, registerUser, resendCode } from "@/entites/registration";
import { initialState, reducer } from "./reducer";

export type StepKey = "org" | "profile" | "license" | "docs" | "account" | "code";


const FLOW: Record<Role, StepKey[]> = {
  CUSTOMER: ["org", "account", "code"],
  EXPERT: ["profile", "account", "code"],
  LICENSE_HOLDER: ["license", "docs", "account", "code"],
};

export function useRegister(role: Role | null) {
  const { signInLink } = useSession();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (role) dispatch({ type: "reset" });
  }, [role]);

  const flow = role ? FLOW[role] : [];
  const stepKey: StepKey = flow[state.step - 1] ?? "org";
  const total = flow.length;
  const isLicense = role === "LICENSE_HOLDER";

  const percent = Number(state.rentalPercent);
  const fixed = Number(state.rentalFixed);
  const rentalOk =
    state.rentalKind === "NEGOTIABLE" ||
    (state.rentalKind === "PERCENT" && percent > 0 && percent <= 100) ||
    (state.rentalKind === "FIXED" && fixed > 0);
  const phoneOk = isLicense
    ? isPhoneComplete(state.phone)
    : state.phone === "" || isPhoneComplete(state.phone);

  const stepReady: Record<StepKey, boolean> = {
    org: Boolean(state.party?.data.inn),
    profile: state.firstName.trim() !== "" && state.lastName.trim() !== "" && state.attested,
    license:
      Boolean(state.party?.data.inn) &&
      state.licenseNumber.trim() !== "" &&
      state.licenseAreas.length > 0 &&
      rentalOk,
    docs: true,
    account:
      isEmail(state.email) &&
      passwordValid(state.password) &&
      state.password === state.confirm &&
      phoneOk &&
      state.consents.privacy &&
      state.consents.terms &&
      state.consents.personal,
    code: state.code.trim().length === CODE_LENGTH,
  };

  const submitData = async () => {
    if (!role || state.busy) return;
    dispatch({ type: "busy", value: true });
    try {
      if (isLicense && state.party) {
        await registerLicenseHolder(
          {
            email: state.email.trim(),
            password: state.password,
            phone: phoneApiValue(state.phone),
            inn: state.party.data.inn ?? "",
            company_data: state.party,
            license_number: state.licenseNumber.trim(),
            license_areas: state.licenseAreas,
            license_rental_kind: state.rentalKind,
            license_rental_percent: state.rentalKind === "PERCENT" ? percent : undefined,
            license_rental_fixed_amount: state.rentalKind === "FIXED" ? fixed : undefined,
            mining_license_number: state.miningNumber.trim() || null,
            lab_accreditation_number: state.labNumber.trim() || null,
          },
          state.files,
        );
      } else {
        const isExpert = role === "EXPERT";
        const isCustomer = role === "CUSTOMER";
        const attested = isExpert && state.attested;
        await registerUser({
          role,
          email: state.email.trim(),
          password: state.password,
          phone: isPhoneComplete(state.phone) ? phoneApiValue(state.phone) : undefined,
          inn: isCustomer ? state.party?.data.inn ?? undefined : undefined,
          company_data: isCustomer ? state.party : undefined,
          first_name: isExpert ? state.firstName.trim() : undefined,
          last_name: isExpert ? state.lastName.trim() : undefined,
          location_lat: isExpert && state.locationLat !== null ? state.locationLat : undefined,
          location_lng: isExpert && state.locationLng !== null ? state.locationLng : undefined,
          location_address: isExpert && state.locationAddress ? state.locationAddress : undefined,
          location_city: isExpert && state.locationCity ? state.locationCity : undefined,
          travels_to_other_regions: isExpert ? state.travels : undefined,
          expert_is_attested: isExpert ? state.attested : undefined,
          expert_certificates: attested && state.certificates.length ? state.certificates : undefined,
          expert_show_on_map: attested ? state.showOnMap : undefined,
          expert_map_fields: attested && state.showOnMap ? state.mapFields : undefined,
        });
      }
      notifyHaptic("success");
      dispatch({ type: "step", value: state.step + 1 });
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось зарегистрироваться");
    } finally {
      dispatch({ type: "busy", value: false });
    }
  };

  const next = () => {
    if (stepKey === "account") {
      void submitData();
      return;
    }
    dispatch({ type: "step", value: state.step + 1 });
  };

  const back = () => dispatch({ type: "step", value: state.step - 1 });

  const submitCode = async () => {
    if (!role || state.busy) return;
    dispatch({ type: "busy", value: true });
    try {
      await confirmEmail(state.email.trim(), state.code.trim(), role);
      await signInLink(state.email.trim(), state.password, role);
      notifyHaptic("success");
      navigate("/", { replace: true });
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Неверный код");
      dispatch({ type: "busy", value: false });
    }
  };

  const resend = async () => {
    if (!role) return;
    try {
      await resendCode(state.email.trim(), role);
      notifyHaptic("success");
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось отправить код");
    }
  };

  return { state, dispatch, stepKey, total, stepReady, next, back, submitCode, resend };
}
