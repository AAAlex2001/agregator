/** Аттестация кандидата: область, объект экспертизы и категория. */
export interface CommissionAttestation {
  area_code: string;
  object_code: string;
  category: number;
}

/** Заявка кандидата в конкурсную комиссию. */
export interface CommissionApplication {
  full_name: string;
  phone: string;
  email: string;
  attestations: CommissionAttestation[];
  message: string | null;
}

/** Контактное поле заявки. */
export type ContactField = "fullName" | "phone" | "email" | "message";

/** Аттестация, которую кандидат собирает перед добавлением. */
export interface AttestationDraft {
  areaCode: string;
  objectCode: string;
  category: string;
}

/** Черновик заявки и состояние отправки. */
export interface CommissionFormState {
  fullName: string;
  phone: string;
  email: string;
  message: string;
  draft: AttestationDraft;
  attestations: CommissionAttestation[];
  isSubmitting: boolean;
  isSent: boolean;
}

/** Изменения черновика заявки. */
export type CommissionFormAction =
  | {
      type: "contact/change";
      field: ContactField;
      value: string;
    }
  | {
      type: "draft/change";
      draft: AttestationDraft;
    }
  | {
      type: "attestation/add";
    }
  | {
      type: "attestation/remove";
      index: number;
    }
  | {
      type: "submit/start";
    }
  | {
      type: "submit/success";
    }
  | {
      type: "submit/error";
    };
