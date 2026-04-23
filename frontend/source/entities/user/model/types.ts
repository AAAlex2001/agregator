export interface UserProfile {
  id: number;
  inn: string | null;
  email: string | null;
  email_verified: boolean;
  phone: string | null;
  avatar_url: string | null;
  first_name: string | null;
  last_name: string | null;
  balance: number;
  rating: number | null;
  review_count: number;
  role: string;
  email_notifications_enabled: boolean;
}
