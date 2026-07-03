import type { EditProfileAction, EditProfileState } from "./types";

export const initialState: EditProfileState = {
  first: "",
  last: "",
  phone: "",
  email: "",
  code: "",
  stage: "email",
  busy: false,
  done: false,
};

export function reducer(state: EditProfileState, action: EditProfileAction): EditProfileState {
  switch (action.type) {
    case "init":
      return {
        ...initialState,
        first: action.first,
        last: action.last,
        phone: action.phone,
      };
    case "first":
      return { ...state, first: action.value };
    case "last":
      return { ...state, last: action.value };
    case "phone":
      return { ...state, phone: action.value };
    case "email":
      return { ...state, email: action.value };
    case "code":
      return { ...state, code: action.value };
    case "stage":
      return { ...state, stage: action.stage };
    case "busy":
      return { ...state, busy: action.value };
    case "done":
      return { ...state, busy: false, done: true };
  }
}
