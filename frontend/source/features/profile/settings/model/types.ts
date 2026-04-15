export interface UserProfile {
  id: number;
  email: string | null;
  phone: string | null;
  first_name: string | null;
  last_name: string | null;
  balance: number;
  rating: number | null;
  review_count: number;
  role: string;
}

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
}

/* ── Reducer ── */

export interface ProfileFormState {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  repeatPassword: string;
  isSaving: boolean;
  error: string | null;
  success: string | null;
}

type ProfileFormField = "firstName" | "lastName" | "phone" | "email" | "password" | "repeatPassword";

export type ProfileFormAction =
  | { type: "SET_FIELD"; field: ProfileFormField; value: string }
  | { type: "SET_SAVING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SUCCESS"; payload: string | null }
  | { type: "RESET_PASSWORD" };
