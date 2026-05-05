import type { OrderCardData } from "@/source/entities/order";

export type ModalStep = "details" | "tender" | "offer";

export interface RespondFormData {
  deadline: string;
  costAmount: number;
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
}