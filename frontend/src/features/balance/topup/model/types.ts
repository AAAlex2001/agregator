export interface CreatePaymentResponse {
  payment_id: number;
  confirmation_url: string;
}

export interface BalanceResponse {
  balance: number;
}

export interface PaymentItem {
  id: number;
  yookassa_id: string | null;
  amount: number;
  payment_type: string;
  status: string;
  description: string;
  created_at: string;
}

export interface PaymentListResponse {
  items: PaymentItem[];
}
