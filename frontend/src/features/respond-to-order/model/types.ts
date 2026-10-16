import type { CompanySuggestion } from "@/entities/company";
import type { VatKind } from "@/entities/response";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";

/** Экраны отклика: условия заказа, подтверждение и заполнение предложения. */
export type RespondStep = "details" | "confirmation" | "offer";

/** Условия, которые исполнитель предлагает заказчику при отклике. */
export interface OfferFields {
  startDate: string;
  deadline: string;
  cost: string;
  vatKind: VatKind;
  comment: string;
  companyName: string;
  company: CompanySuggestion | null;
}

/** Поля предложения, которые сохраняются без преобразования. */
export type OfferTextField = "startDate" | "deadline" | "comment";

/** Изменения сроков, стоимости, налога и реквизитов предложения. */
export type OfferAction =
  | { type: "field/changed"; field: OfferTextField; value: string }
  | { type: "cost/changed"; value: string }
  | { type: "vat/changed"; value: VatKind }
  | {
      type: "company/changed";
      name: string;
      company: CompanySuggestion | null;
    };

/** Черновик предложения, вложения и действия его заполнения и отправки. */
export interface RespondForm {
  fields: OfferFields;
  files: FileGalleryItem[];
  isSubmitting: boolean;
  changeField: (field: OfferTextField, value: string) => void;
  changeCost: (value: string) => void;
  changeVatKind: (value: VatKind) => void;
  changeCompany: (query: string, company: CompanySuggestion | null) => void;
  addFiles: (files: FileList | null) => void;
  submit: () => void;
}

/** Переходы после успешного отклика и при отсутствии подходящей подписки. */
export interface RespondCallbacks {
  onResponded: () => void;
  onSubscriptionRequired: () => void;
}
