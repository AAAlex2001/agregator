export interface LeaveReviewState {
  rating: number;
  comment: string;
  busy: boolean;
}

export type LeaveReviewAction =
  | { type: "reset" }
  | { type: "rating"; value: number }
  | { type: "comment"; value: string }
  | { type: "busy"; value: boolean };
