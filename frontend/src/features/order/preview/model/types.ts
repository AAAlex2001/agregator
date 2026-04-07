export interface BadgeData {
  text: string;
  variant: string;
}

export interface OrderData {
  id: number;
  public_id: string;
  title: string;
  company: string;
  typical_names: string;
  comment: string;
  sum: string;
  date: string;
  responses_deadline: string | null;
  technical_files: string[];
  badges: BadgeData[];
  status: string;
}
