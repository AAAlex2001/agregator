"use client";

import { useReducer } from "react";
import { updateProfile, changePassword, uploadAvatar } from "../api/settings.api";
import { profileFormReducer, createInitialState } from "./reducer";
import { validatePassword } from "./validation";
import type { UserProfile } from "./types";

interface SaveProfileResult {
  profile?: UserProfile;
  errorMessage?: string;
  successMessage?: string;
}

export function useProfileForm(profile: UserProfile) {
  const [state, dispatch] = useReducer(
    profileFormReducer,
    {
      firstName: profile.first_name || "",
      lastName: profile.last_name || "",
      phone: profile.phone || "",
      email: profile.email || "",
    },
    createInitialState,
  );

  const handleSave = async (avatarFile?: File | null) => {
    if (state.isSaving) {
      return {} satisfies SaveProfileResult;
    }

    const pwError = validatePassword(state.password, state.repeatPassword);
    if (pwError) {
      dispatch({ type: "SET_ERROR", payload: pwError });
      return { errorMessage: pwError } satisfies SaveProfileResult;
    }

    dispatch({ type: "SET_SAVING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      let updated = await updateProfile({
        first_name: state.firstName,
        last_name: state.lastName,
        phone: state.phone || undefined,
        email: state.email || undefined,
      });

      if (avatarFile) {
        updated = await uploadAvatar(avatarFile);
      }

      if (state.password) {
        await changePassword(state.password, state.repeatPassword);
        dispatch({ type: "RESET_PASSWORD" });
      }

      dispatch({ type: "SET_SUCCESS", payload: "Данные сохранены" });
      return {
        profile: updated,
        successMessage: "Данные сохранены",
      } satisfies SaveProfileResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ошибка сохранения";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      return {
        errorMessage,
      } satisfies SaveProfileResult;
    } finally {
      dispatch({ type: "SET_SAVING", payload: false });
    }
  };

  return {
    ...state,
    setFirstName: (v: string) => dispatch({ type: "SET_FIELD", field: "firstName", value: v }),
    setLastName: (v: string) => dispatch({ type: "SET_FIELD", field: "lastName", value: v }),
    setPhone: (v: string) => dispatch({ type: "SET_FIELD", field: "phone", value: v }),
    setEmail: (v: string) => dispatch({ type: "SET_FIELD", field: "email", value: v }),
    setPassword: (v: string) => dispatch({ type: "SET_FIELD", field: "password", value: v }),
    setRepeatPassword: (v: string) => dispatch({ type: "SET_FIELD", field: "repeatPassword", value: v }),
    handleSave,
  };
}
