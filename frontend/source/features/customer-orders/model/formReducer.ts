export interface FormFilesState {
  files: File[];
  keepFiles: string[];
}

type FormFilesAction =
  | { type: "ADD_FILES"; files: File[] }
  | { type: "REMOVE_FILE"; index: number }
  | { type: "REMOVE_EXISTING_FILE"; index: number };

export function createInitialFormFilesState(existingFiles?: string[]): FormFilesState {
  return {
    files: [],
    keepFiles: existingFiles ?? [],
  };
}

export function formFilesReducer(state: FormFilesState, action: FormFilesAction): FormFilesState {
  switch (action.type) {
    case "ADD_FILES":
      return { ...state, files: action.files };
    case "REMOVE_FILE":
      return {
        ...state,
        files: state.files.filter((_, index) => index !== action.index),
      };
    case "REMOVE_EXISTING_FILE":
      return {
        ...state,
        keepFiles: state.keepFiles.filter((_, index) => index !== action.index),
      };
    default:
      return state;
  }
}