import type { OrderCardData } from "@/source/entities/order";
import type { VatKind } from "@/source/entities/response";

export type ModalStep = "details" | "tender" | "offer";

export interface RespondFormData {
  startDate: string;
  deadline: string;
  costAmount: number;
  vatKind: VatKind;
  comment: string;
  files: File[];
  expertInn: string;
  expertCompanyData: Record<string, unknown>;
}

export interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderCardData | null;
  onRespond: (order: OrderCardData, formData: RespondFormData) => void;
  isResponding: boolean;
  initialStep?: ModalStep;
  /** Подгружать сохранённый черновик при открытии (true — кнопка «Продолжить» в карточке черновика). */
  useDraft?: boolean;
}