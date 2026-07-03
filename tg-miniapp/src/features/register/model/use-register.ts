import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/features/session";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic } from "@/shared/services/telegram";
import { isPhoneComplete, phoneApiValue } from "@/shared/lib/phone";
import { type Role } from "@/shared/services/api";
import { confirmEmail, registerLicenseHolder, registerUser, resendCode } from "./api";
import { initialState, reducer } from "./reducer";

export function useRegister(role: Role | null) {
  const { signInLink } = useSession();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (role) dispatch({ type: "reset" });
  }, [role]);

  const isLicense = role === "LICENSE_HOLDER";
  const nameOk = role !== "EXPERT" || (state.firstName.trim() !== "" && state.lastName.trim() !== "");
  const companyOk = !(role === "CUSTOMER" || isLicense) || Boolean(state.party?.data.inn);
  const percent = Number(state.rentalPercent.replace(",", "."));
  const rentalOk =
    !isLicense ||
    state.rentalKind === "NEGOTIABLE" ||
    (state.rentalKind === "PERCENT" && percent > 0 && percent <= 100) ||
    (state.rentalKind === "FIXED" && Number(state.rentalFixed.replace(/\s/g, "")) > 0);
  const licenseOk =
    !isLicense ||
    (state.licenseNumber.trim() !== "" && state.licenseAreas.length > 0 && isPhoneComplete(state.phone) && rentalOk);
  const passwordOk =
    state.password.length >= 6 && /[A-Z]/.test(state.password) && /[a-z]/.test(state.password);
  const baseOk = state.email.trim() !== "" && passwordOk && state.password === state.confirm && state.agree;
  const canSubmit = baseOk && nameOk && companyOk && licenseOk;

  const submitData = async () => {
    if (!role || !canSubmit || state.busy) return;
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
            license_rental_percent:
              state.rentalKind === "PERCENT" ? Number(state.rentalPercent.replace(",", ".")) : undefined,
            license_rental_fixed_amount:
              state.rentalKind === "FIXED" ? Number(state.rentalFixed.replace(/\s/g, "")) : undefined,
          },
          state.file,
        );
      } else {
        const isExpert = role === "EXPERT";
        const isCustomer = role === "CUSTOMER";
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
        });
      }
      notifyHaptic("success");
      dispatch({ type: "step", value: 2 });
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось зарегистрироваться");
    } finally {
      dispatch({ type: "busy", value: false });
    }
  };

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

  return { state, dispatch, isLicense, canSubmit, submitData, submitCode, resend };
}
