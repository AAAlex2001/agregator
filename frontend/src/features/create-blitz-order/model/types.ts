import type {
  BlitzCompany,
  BlitzCustomerType,
  BlitzDeadline,
  BlitzIndividual,
  BlitzRequisites,
} from "@/entities/blitz-order";

/** Как заказчик описывает требования к эксперту. */
export type ExpertRequirement = "class" | "category" | "unknown";

/** Текстовые поля заявки. */
export type OrderTextField =
  | "hazardClass"
  | "category"
  | "contractKind"
  | "objectName"
  | "price"
  | "comment";

/** Поле реквизитов организации. */
export type CompanyField = keyof BlitzCompany;

/** Поле паспортных данных. */
export type IndividualField = keyof BlitzIndividual;

/** Черновик заявки. Пустая строка в кодах значит «не знаю». */
export interface CreateBlitzOrderState {
  objectCode: string;
  areaCode: string;
  requirement: ExpertRequirement;
  hazardClass: string;
  category: string;
  contractKind: string;
  objectName: string;
  deadline: BlitzDeadline;
  price: string;
  customerType: BlitzCustomerType;
  company: BlitzCompany;
  individual: BlitzIndividual;
  comment: string;
  step: number;
  isSubmitting: boolean;
}

/** Изменения черновика. */
export type CreateBlitzOrderAction =
  | {
      type: "object/change";
      objectCode: string;
      keepArea: boolean;
    }
  | {
      type: "area/change";
      areaCode: string;
    }
  | {
      type: "requirement/change";
      requirement: ExpertRequirement;
    }
  | {
      type: "field/change";
      field: OrderTextField;
      value: string;
    }
  | {
      type: "deadline/change";
      deadline: BlitzDeadline;
    }
  | {
      type: "customer-type/change";
      customerType: BlitzCustomerType;
    }
  | {
      type: "company/change";
      field: CompanyField;
      value: string;
    }
  | {
      type: "individual/change";
      field: IndividualField;
      value: string;
    }
  | {
      type: "requisites/fill";
      requisites: BlitzRequisites;
    }
  | {
      type: "step/go";
      step: number;
    }
  | {
      type: "submit/start";
    }
  | {
      type: "submit/error";
    };
