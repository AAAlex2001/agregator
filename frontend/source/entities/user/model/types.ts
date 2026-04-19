export interface UserProfile {
  id: number;
  inn: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  first_name: string | null;
  last_name: string | null;
  balance: number;
  rating: number | null;
  review_count: number;
  role: string;
}
