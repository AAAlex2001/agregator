export interface BadgeOption {
  text: string;
  variant: string;
}

export interface OrderBadgeResponse {
  text: string;
  variant: string;
}

export interface CustomerOrderResponse {
  id: number;
  title: string;
  company: string;
  typical_names: string;
  comment: string;
  customer_id: number;
  customer_name: string;
  sum: string;
  date: string;
  technical_files: string[];
  badges: OrderBadgeResponse[];
  status: string;
}

export interface CustomerOrdersListResponse {
  items: CustomerOrderResponse[];
  total: number;
}

export interface CustomerOrderCardVM {
  id: number;
  title: string;
  company: string;
  date: string;
  sum: string;
  badges: { text: string; variant: string }[];
  status: string;
}

export interface CustomerOrdersState {
  items: CustomerOrderCardVM[];
  total: number;
  isLoading: boolean;
  error: string | null;
}

export interface CreateOrderPayload {
  title: string;
  company: string;
  typical_names: string;
  comment: string;
  customer_id: number;
  sum_amount: number;
  deadline: string;
  badges: BadgeOption[];
  files?: File[];
}
