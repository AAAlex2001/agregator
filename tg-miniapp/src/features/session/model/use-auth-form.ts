import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError, type Role } from "@/shared/services/api";
import { emitError } from "@/shared/services/error-bus";
import { useSession } from "./session";
import { initialState, reducer } from "./reducer";

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
