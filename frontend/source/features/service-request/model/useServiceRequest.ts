"use client";

import { useReducer } from "react";
import { isImageFileName } from "@/source/shared/lib/filePreview";
import { initialServiceRequestState, serviceRequestReducer } from "./reducer";
import type {
  ServiceRequestAgreement,
  ServiceRequestField,
  ServiceRequestVariant,
} from "./types";

export function useServiceRequest() {
  const [state, dispatch] = useReducer(serviceRequestReducer, initialServiceRequestState);

  const setField = (field: ServiceRequestField, value: string) =>
    dispatch({ type: "SET_FIELD", field, value });

  const setVariant = (variant: ServiceRequestVariant) =>
    dispatch({ type: "SET_VARIANT", variant });

  const addFiles = (files: File[]) => {
    const attachments = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      isImage: isImageFileName(file.name),
      file,
    }));
    dispatch({ type: "ADD_FILES", attachments });
  };

  const removeFile = (index: number) => {
    const target = state.attachments[index];
    if (target) URL.revokeObjectURL(target.url);
    dispatch({ type: "REMOVE_FILE", index });
  };

  const toggleSiteVisit = () => dispatch({ type: "TOGGLE_SITE_VISIT" });

  const toggleAgreement = (agreement: ServiceRequestAgreement) =>
    dispatch({ type: "TOGGLE_AGREEMENT", agreement });

  const addRequirement = () => dispatch({ type: "ADD_REQUIREMENT" });

  const setRequirement = (id: number, value: string) =>
    dispatch({ type: "SET_REQUIREMENT", id, value });

  const removeRequirement = (id: number) => dispatch({ type: "REMOVE_REQUIREMENT", id });

  return {
    state,
    setField,
    setVariant,
    addFiles,
    removeFile,
    toggleSiteVisit,
    toggleAgreement,
    addRequirement,
    setRequirement,
    removeRequirement,
  };
}
