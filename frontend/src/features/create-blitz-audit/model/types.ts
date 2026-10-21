import type {
  BlitzAuditBudget,
  BlitzAuditKind,
  BlitzAuditNegotiation,
  BlitzAuditObject,
  BlitzAuditScope,
  BlitzAuditStage,
  BlitzAuditTiming,
  BlitzCompany,
  BlitzRequisites,
} from "@/entities/blitz-order";

/** Аудит заказывает организация или ИП. */
export type AuditCustomerType = "legal" | "entrepreneur";

/** Текстовое поле представителя заказчика. */
export type ApplicantField = "full_name" | "position" | "organization" | "inn" | "phone" | "email";

/** Текстовое поле ОПО. */
export type ObjectField = "reg_number" | "name" | "hazard_class" | "address" | "industry";

/** Текстовое поле сведений обо всех ОПО. */
export type FleetField = "count" | "profile";

/** Прочие текстовые поля заявки. */
export type AuditTextField = "stoName" | "timingStart" | "timingEnd" | "price" | "comment";

/** Представитель заказчика. */
export interface ApplicantDraft {
  full_name: string;
  position: string;
  organization: string;
  inn: string;
  phone: string;
  email: string;
  by_proxy: boolean;
}

/** Все ОПО организации. Пока ответа нет, multi_region — null. */
export interface FleetDraft {
  count: string;
  profile: string;
  multi_region: boolean | null;
}

/** Черновик заявки на аудит. */
export interface CreateBlitzAuditState {
  applicant: ApplicantDraft;
  scope: BlitzAuditScope;
  objects: BlitzAuditObject[];
  fleet: FleetDraft;
  stages: BlitzAuditStage[];
  kind: BlitzAuditKind | "";
  useSto: boolean | null;
  stoName: string;
  elements: string[];
  timing: BlitzAuditTiming;
  timingStart: string;
  timingEnd: string;
  budget: BlitzAuditBudget;
  price: string;
  negotiation: BlitzAuditNegotiation;
  customerType: AuditCustomerType;
  company: BlitzCompany;
  comment: string;
  isSubmitting: boolean;
}

/** Изменения черновика. */
export type CreateBlitzAuditAction =
  | {
      type: "applicant/change";
      field: ApplicantField;
      value: string;
    }
  | {
      type: "applicant/proxy";
      byProxy: boolean;
    }
  | {
      type: "scope/change";
      scope: BlitzAuditScope;
    }
  | {
      type: "object/change";
      index: number;
      field: ObjectField;
      value: string;
    }
  | {
      type: "object/signs";
      index: number;
      signs: string[];
    }
  | {
      type: "object/add";
    }
  | {
      type: "object/remove";
      index: number;
    }
  | {
      type: "fleet/change";
      field: FleetField;
      value: string;
    }
  | {
      type: "fleet/multi-region";
      multiRegion: boolean;
    }
  | {
      type: "field/change";
      field: AuditTextField;
      value: string;
    }
  | {
      type: "stages/change";
      stages: BlitzAuditStage[];
    }
  | {
      type: "kind/change";
      kind: BlitzAuditKind;
    }
  | {
      type: "sto/change";
      useSto: boolean;
    }
  | {
      type: "elements/change";
      elements: string[];
    }
  | {
      type: "timing/change";
      timing: BlitzAuditTiming;
    }
  | {
      type: "budget/change";
      budget: BlitzAuditBudget;
    }
  | {
      type: "negotiation/change";
      negotiation: BlitzAuditNegotiation;
    }
  | {
      type: "customer-type/change";
      customerType: AuditCustomerType;
    }
  | {
      type: "company/change";
      field: keyof BlitzCompany;
      value: string;
    }
  | {
      type: "requisites/fill";
      requisites: BlitzRequisites;
    }
  | {
      type: "submit/start";
    }
  | {
      type: "submit/error";
    };
