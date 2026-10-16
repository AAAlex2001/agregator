import type { Dispatch, RefObject } from "react";
import { getUserProfile } from "../api/get-user-profile";
import type { UserAction, UserProfile } from "./types";

/** Загружает профиль, не позволяя старому ответу отменить выход или смену аккаунта. */
export async function loadUserProfile(
  dispatch: Dispatch<UserAction>,
  profileRequestVersionRef: RefObject<number>,
): Promise<UserProfile | null> {
  const requestVersion = ++profileRequestVersionRef.current;

  dispatch({ type: "profile/loading" });

  try {
    const user = await getUserProfile();

    if (requestVersion !== profileRequestVersionRef.current) {
      throw new Error("Аккаунт изменился во время загрузки профиля");
    }

    dispatch({ type: "profile/loaded", user });

    return user;
  } catch (error) {
    if (requestVersion === profileRequestVersionRef.current) {
      dispatch({
        type: "profile/failed",
        error: error instanceof Error ? error.message : "Не удалось загрузить профиль",
      });
    }

    throw error;
  }
}
