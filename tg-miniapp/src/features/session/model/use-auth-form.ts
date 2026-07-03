import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError, type Role } from "@/shared/services/api";
import { emitError } from "@/shared/services/error-bus";
import { useSession } from "./session";

interface State {
  email: string;
  password: string;
  loading: boolean;
  roles: Role[];
  rolesOpen: boolean;
}

type Action =
  | { type: "email"; value: string }
  | { type: "password"; value: string }
  | { type: "loading"; value: boolean }
  | { type: "rolesRequired"; roles: Role[] }
  | { type: "closeRoles" };

const initialState: State = {
  email: "",
  password: "",
  loading: false,
  roles: [],
  rolesOpen: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "email":
      return { ...state, email: action.value };
    case "password":
      return { ...state, password: action.value };
    case "loading":
      return { ...state, loading: action.value };
    case "rolesRequired":
      return { ...state, roles: action.roles, rolesOpen: true, loading: false };
    case "closeRoles":
      return { ...state, rolesOpen: false };
  }
}

function rolesFrom409(error: unknown): Role[] | null {
  if (!(error instanceof ApiError) || error.status !== 409) return null;
  const roles = (error.body as { detail?: { available_roles?: Role[] } } | null)?.detail?.available_roles;
  return roles && roles.length ? roles : null;
}

export function useAuthForm() {
  const { signInLink } = useSession();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);

  const submit = async (role?: Role) => {
    dispatch({ type: "loading", value: true });
    try {
      await signInLink(state.email.trim(), state.password, role);
      navigate("/", { replace: true });
    } catch (e) {
      const roles = rolesFrom409(e);
      if (roles) {
        dispatch({ type: "rolesRequired", roles });
        return;
      }
      emitError(e instanceof Error ? e.message : "Не удалось войти");
      dispatch({ type: "loading", value: false });
    }
  };

  return { state, dispatch, submit };
}
